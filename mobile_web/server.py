"""Mobile Web/PWA Bridge Server for Desk Hub.

Acts as the WebSocket hub for the Desk Hub Python companion (/ws),
serves the mobile PWA frontend over HTTP (/), and streams real-time
state + decoded images to mobile browser clients (/client).
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import io
import json
import logging
import mimetypes
import pathlib
import struct
import sys
import time
import urllib.parse

import httpx
import websockets
from PIL import Image
from websockets.datastructures import Headers
from websockets.http11 import Response

log = logging.getLogger("deskhub.mobile_web")

STATIC_DIR = pathlib.Path(__file__).resolve().parent / "static"
IGNORED_TYPES = {"ai", "claude", "alert"}
ALLOWED_CLIENT_CMDS = {"media", "shortcut", "speedtest", "steam_launch"}
WEATHER_REFRESH_S = 15 * 60
DEFAULT_LAT = -23.5505
DEFAULT_LON = -46.6333
DEFAULT_CITY = "São Paulo"

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/manifest+json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".png": "image/png",
    ".ico": "image/x-icon",
}


def rgb565_to_png_data_url(width: int, height: int, pixels: bytes) -> str:
    """Convert raw RGB565 little-endian pixels into a PNG data URL."""
    expected = width * height * 2
    if width <= 0 or height <= 0 or len(pixels) != expected:
        raise ValueError(f"invalid RGB565 frame {width}x{height} len={len(pixels)}")
    im = Image.frombytes("RGB", (width, height), pixels, "raw", "BGR;16")
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def decode_art1(raw: bytes) -> dict | None:
    """Decode an ART1 binary frame into a JSON-serializable art_image message."""
    if len(raw) < 12 or raw[:4] != b"ART1":
        return None
    art_id, w, h = struct.unpack_from("<IHH", raw, 4)
    if art_id == 0 or w > 1024 or h > 1024:
        return None
    data_url = rgb565_to_png_data_url(w, h, raw[12:])
    return {"type": "art_image", "art_id": art_id, "width": w, "height": h, "data_url": data_url}


def decode_stm1(raw: bytes) -> dict | None:
    """Decode an STM1 binary frame into a JSON-serializable steam_image message."""
    if len(raw) < 16 or raw[:4] != b"STM1":
        return None
    appid, w, h, kind, _ = struct.unpack_from("<IHHHH", raw, 4)
    if w > 1024 or h > 1024:
        return None
    data_url = rgb565_to_png_data_url(w, h, raw[16:])
    return {
        "type": "steam_image",
        "appid": appid,
        "kind": kind,
        "width": w,
        "height": h,
        "data_url": data_url,
    }


def _http_response(status: int, reason: str, body: bytes, content_type: str) -> Response:
    headers = Headers(
        {
            "Content-Type": content_type,
            "Content-Length": str(len(body)),
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff",
        }
    )
    return Response(status, reason, headers, body)


class MobileBridge:
    def __init__(
        self,
        token: str = "deskhub-mobile",
        lat: float | None = None,
        lon: float | None = None,
        city: str | None = None,
        static_dir: pathlib.Path = STATIC_DIR,
    ):
        self.token = token
        self.lat = lat
        self.lon = lon
        self.city = city
        self.static_dir = static_dir.resolve()

        self.companion_ws = None
        self.pc_online = False
        self.clients: set = set()
        self.cache: dict[str, dict] = {}
        self.latest_art: dict | None = None
        self.steam_images: dict[tuple[int, int], dict] = {}
        self.weather: dict | None = None

    # ---- static file serving ----------------------------------------------

    def process_request(self, _connection, request) -> Response | None:
        path = urllib.parse.urlsplit(request.path).path
        if path in ("/ws", "/client"):
            return None

        rel = "index.html" if path == "/" else path.lstrip("/")
        target = (self.static_dir / rel).resolve()
        if not target.is_relative_to(self.static_dir) or not target.is_file():
            return _http_response(404, "Not Found", b"Not Found", "text/plain; charset=utf-8")

        ext = target.suffix.lower()
        ctype = CONTENT_TYPES.get(ext) or mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        return _http_response(200, "OK", target.read_bytes(), ctype)

    # ---- broadcast helpers ------------------------------------------------

    async def broadcast(self, msg: dict | str):
        if not self.clients:
            return
        payload = msg if isinstance(msg, str) else json.dumps(msg, separators=(",", ":"))
        dead = []
        for ws in list(self.clients):
            try:
                await ws.send(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.clients.discard(ws)

    async def _send_safe(self, ws, msg: dict):
        try:
            await ws.send(json.dumps(msg, separators=(",", ":")))
        except Exception:
            self.clients.discard(ws)

    # ---- WebSocket handlers -----------------------------------------------

    async def handle_ws(self, ws):
        path = urllib.parse.urlsplit(ws.request.path).path
        if path == "/ws":
            await self._handle_companion(ws)
        elif path == "/client":
            await self._handle_client(ws)
        else:
            await ws.close(1008, "unknown path")

    async def _handle_companion(self, ws):
        try:
            raw_hello = await asyncio.wait_for(ws.recv(), timeout=10)
            hello = json.loads(raw_hello)
        except Exception:
            await ws.close(1008, "expected hello")
            return

        if not isinstance(hello, dict) or hello.get("type") != "hello" or hello.get("token") != self.token:
            await self._send_safe(ws, {"type": "error", "error": "invalid token"})
            await ws.close(1008, "unauthorized")
            log.warning("rejected companion connection with invalid hello/token")
            return

        await ws.send(json.dumps({"type": "hello_ok", "version": "mobile-web-1.0"}))
        self.companion_ws = ws
        self.pc_online = True
        log.info("companion connected from %s", ws.remote_address)
        await self.broadcast({"type": "hub_status", "pc_online": True})

        try:
            async for raw in ws:
                if isinstance(raw, bytes):
                    await self._handle_companion_binary(raw)
                else:
                    await self._handle_companion_json(raw)
        except websockets.ConnectionClosed:
            pass
        finally:
            if self.companion_ws is ws:
                self.companion_ws = None
                self.pc_online = False
                log.info("companion disconnected")
                await self.broadcast({"type": "hub_status", "pc_online": False})

    async def _handle_companion_binary(self, raw: bytes):
        try:
            if raw[:4] == b"ART1":
                msg = decode_art1(raw)
                if msg:
                    self.latest_art = msg
                    await self.broadcast(msg)
            elif raw[:4] == b"STM1":
                msg = decode_stm1(raw)
                if msg:
                    self.steam_images[(msg["appid"], msg["kind"])] = msg
                    await self.broadcast(msg)
        except Exception as e:
            log.debug("failed to decode binary frame: %s", e)

    async def _handle_companion_json(self, raw: str):
        try:
            msg = json.loads(raw)
        except ValueError:
            return
        if not isinstance(msg, dict):
            return
        t = msg.get("type")
        if not t or t in IGNORED_TYPES:
            return

        if t == "media" and (not msg.get("active") or msg.get("art_id", 0) == 0):
            self.latest_art = None

        self.cache[t] = msg
        await self.broadcast(raw)

    async def _handle_client(self, ws):
        self.clients.add(ws)
        log.info("mobile client connected (%d active)", len(self.clients))
        try:
            await self._send_safe(ws, {"type": "hub_status", "pc_online": self.pc_online})
            if self.weather:
                await self._send_safe(ws, self.weather)

            for key in ("layout", "home", "tiles", "tile_state", "pc_power"):
                if key in self.cache:
                    await self._send_safe(ws, self.cache[key])
            for key, msg in list(self.cache.items()):
                if key not in ("layout", "home", "tiles", "tile_state", "pc_power"):
                    await self._send_safe(ws, msg)

            if self.latest_art:
                await self._send_safe(ws, self.latest_art)
            for img in list(self.steam_images.values()):
                await self._send_safe(ws, img)

            async for raw in ws:
                if isinstance(raw, bytes):
                    continue
                try:
                    cmd = json.loads(raw)
                except ValueError:
                    continue
                if not isinstance(cmd, dict):
                    continue
                kind = cmd.get("type")
                if kind == "ping":
                    await self._send_safe(ws, {"type": "pong"})
                    continue
                if kind not in ALLOWED_CLIENT_CMDS:
                    continue
                comp = self.companion_ws
                if comp is not None:
                    try:
                        await comp.send(json.dumps(cmd, separators=(",", ":")))
                    except Exception as e:
                        log.debug("failed forwarding %s to companion: %s", kind, e)
        except websockets.ConnectionClosed:
            pass
        finally:
            self.clients.discard(ws)
            log.info("mobile client disconnected (%d active)", len(self.clients))

    # ---- Weather polling --------------------------------------------------

    async def _resolve_location(self, client: httpx.AsyncClient) -> tuple[float, float, str]:
        if self.lat is not None and self.lon is not None:
            return self.lat, self.lon, self.city or "Local"
        try:
            r = await client.get("https://get.geojs.io/v1/ip/geo.json")
            r.raise_for_status()
            data = r.json()
            lat = float(data["latitude"])
            lon = float(data["longitude"])
            city = str(data.get("city") or self.city or "Local")
            return lat, lon, city
        except Exception as e:
            log.warning("location lookup failed (%s), using fallback %s", e, DEFAULT_CITY)
            return DEFAULT_LAT, DEFAULT_LON, self.city or DEFAULT_CITY

    async def weather_loop(self):
        async with httpx.AsyncClient(timeout=12) as client:
            lat, lon, city = await self._resolve_location(client)
            self.lat, self.lon, self.city = lat, lon, city
            log.info("weather location: %s (%.4f, %.4f)", city, lat, lon)
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": (
                    "temperature_2m,apparent_temperature,relative_humidity_2m,"
                    "weather_code,wind_speed_10m,is_day"
                ),
                "hourly": "temperature_2m,weather_code,precipitation_probability,is_day",
                "daily": (
                    "weather_code,temperature_2m_max,temperature_2m_min,"
                    "precipitation_probability_max"
                ),
                "timezone": "auto",
                "forecast_days": 6,
            }
            while True:
                ok = False
                try:
                    r = await client.get(url, params=params)
                    r.raise_for_status()
                    payload = r.json()
                    self.weather = {
                        "type": "weather",
                        "city": city,
                        "updated_at": int(time.time()),
                        "current": payload.get("current", {}),
                        "hourly": payload.get("hourly", {}),
                        "daily": payload.get("daily", {}),
                    }
                    await self.broadcast(self.weather)
                    ok = True
                except Exception as e:
                    log.warning("weather fetch failed: %s", e)
                await asyncio.sleep(WEATHER_REFRESH_S if ok else 60)


async def run_server(
    host: str,
    port: int,
    token: str,
    lat: float | None = None,
    lon: float | None = None,
    city: str | None = None,
):
    bridge = MobileBridge(token=token, lat=lat, lon=lon, city=city)
    weather_task = asyncio.create_task(bridge.weather_loop())
    try:
        async with websockets.serve(
            bridge.handle_ws,
            host,
            port,
            process_request=bridge.process_request,
            max_size=2**20,
            ping_interval=15,
            ping_timeout=15,
        ):
            log.info("Desk Hub Mobile Bridge running at http://%s:%d", host, port)
            await asyncio.Future()
    finally:
        weather_task.cancel()


def main():
    ap = argparse.ArgumentParser(description="Desk Hub Mobile Web/PWA Bridge Server")
    ap.add_argument("--host", default="0.0.0.0", help="Bind address (default: 0.0.0.0)")
    ap.add_argument("--port", type=int, default=8080, help="HTTP + WebSocket port (default: 8080)")
    ap.add_argument("--token", default="deskhub-mobile", help="Companion auth token")
    ap.add_argument("--lat", type=float, default=None, help="Latitude for Open-Meteo weather")
    ap.add_argument("--lon", type=float, default=None, help="Longitude for Open-Meteo weather")
    ap.add_argument("--city", default=None, help="Display city name for weather")
    ap.add_argument("--verbose", "-v", action="store_true")
    args = ap.parse_args()

    fmt = "%(asctime)s %(levelname)s %(name)s: %(message)s"
    level = logging.DEBUG if args.verbose else logging.INFO
    if sys.stderr is None:
        from logging.handlers import RotatingFileHandler

        log_file = pathlib.Path.home() / ".deskhub" / "mobile_bridge.log"
        log_file.parent.mkdir(parents=True, exist_ok=True)
        handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=1, encoding="utf-8")
        logging.basicConfig(level=level, format=fmt, handlers=[handler])
    else:
        logging.basicConfig(level=level, format=fmt)
    logging.getLogger("websockets").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)

    try:
        asyncio.run(run_server(args.host, args.port, args.token, args.lat, args.lon, args.city))
    except KeyboardInterrupt:
        pass
    except OSError as e:
        log.error("could not bind %s:%d (%s) — already running?", args.host, args.port, e)
        sys.exit(1)


if __name__ == "__main__":
    main()
