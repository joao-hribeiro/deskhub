(() => {
  "use strict";

  // Material Icons codepoints matching firmware/main/icons.h
  const MI = {
    home: "\ue88a",
    insights: "\uf092",
    memory: "\ue322",
    speed: "\ue9e4",
    music_note: "\ue405",
    event: "\ue878",
    calendar_today: "\ue935",
    wb_sunny: "\ue430",
    cloud: "\ue2bd",
    wb_cloudy: "\ue42d",
    grain: "\ue3ea",
    umbrella: "\uf1ad",
    ac_unit: "\ueb3b",
    thunderstorm: "\uebdb",
    foggy: "\ue818",
    nights_stay: "\uea46",
    grid_view: "\ue9b0",
    apps: "\ue5c3",
    wifi: "\ue63e",
    wifi_off: "\ue648",
    computer: "\ue30a",
    desktop_windows: "\ue30c",
    play_arrow: "\ue037",
    pause: "\ue034",
    skip_next: "\ue044",
    skip_previous: "\ue045",
    arrow_upward: "\ue5d8",
    arrow_downward: "\ue5db",
    timer: "\ue425",
    replay: "\ue042",
    sports_esports: "\uea28",
    public: "\ue80b",
    volume_up: "\ue050",
    volume_down: "\ue04d",
    volume_off: "\ue04f",
    mic: "\ue029",
    mic_off: "\ue02b",
    lock: "\ue897",
    photo_camera: "\ue412",
    screenshot_monitor: "\uec08",
    terminal: "\ueb8e",
    code: "\ue86f",
    folder: "\ue2c7",
    keyboard: "\ue312",
    power_settings_new: "\ue8ac",
    schedule: "\ue8b5",
    mail: "\ue158",
    chat: "\ue0b7",
    rocket_launch: "\ueb9b",
    bolt: "\uea0b",
    star: "\ue838",
    favorite: "\ue87d",
    settings: "\ue8b8",
    refresh: "\ue5d5",
    dark_mode: "\ue51c",
    headphones: "\uf01f",
    videocam: "\ue04b",
    movie: "\ue02c",
    developer_board: "\ue30d",
    lan: "\ueb2f",
    shuffle: "\ue043",
    repeat: "\ue040",
    fullscreen: "\ue5d0",
    fullscreen_exit: "\ue5d1",
  };

  const PAGE_META = {
    home: { title: "Home", icon: "home" },
    stats: { title: "PC Stats", icon: "insights" },
    calendar: { title: "Agenda", icon: "event" },
    weather: { title: "Clima", icon: "wb_sunny" },
    media: { title: "Mídia", icon: "music_note" },
    timer: { title: "Timer", icon: "timer" },
    games: { title: "Jogos", icon: "sports_esports" },
    shortcuts: { title: "Atalhos", icon: "grid_view" },
  };

  const SPOTIFY_PATH =
    "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.627.627 0 0 1-.86.208c-2.355-1.439-5.32-1.764-8.812-.966a.625.625 0 1 1-.278-1.22c3.821-.873 7.098-.506 9.742 1.118a.626.626 0 0 1 .208.86zm1.224-2.721a.784.784 0 0 1-1.077.259c-2.696-1.657-6.805-2.137-9.993-1.169a.784.784 0 1 1-.456-1.5c3.64-1.106 8.18-.574 11.267 1.332a.784.784 0 0 1 .259 1.078zm.106-2.833C14.686 8.948 9.38 8.77 6.302 9.704a.94.94 0 1 1-.55-1.8c3.535-1.073 9.399-.867 13.14 1.355a.942.942 0 0 1-.976 1.61z";

  function spotifySvg() {
    return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${SPOTIFY_PATH}"/></svg>`;
  }

  function iconMi(name, cls = "") {
    const glyph = MI[name] || MI.apps;
    return `<span class="mi${cls ? ` ${cls}` : ""}" aria-hidden="true">${glyph}</span>`;
  }

  function esc(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function fmtDuration(s) {
    s = Math.max(0, Math.floor(s || 0));
    if (s >= 3600) {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  function fmtBytes(b) {
    if (b == null) return "--";
    if (b >= 1e12) return `${(b / 1e12).toFixed(2)} TB`;
    if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
    if (b >= 1e6) return `${Math.round(b / 1e6)} MB`;
    return `${Math.round(b / 1e3)} KB`;
  }

  function fmtRate(kbps) {
    if (kbps == null) return "--";
    if (kbps >= 1024) return `${(kbps / 1024).toFixed(1)} MB/s`;
    return `${Math.round(kbps)} KB/s`;
  }

  function fmtAgo(unixSec) {
    if (!unixSec || unixSec <= 0) return "nunca";
    const d = Math.max(0, Math.floor(Date.now() / 1000 - unixSec));
    if (d < 60) return "agora";
    if (d < 3600) return `há ${Math.floor(d / 60)}m`;
    if (d < 86400) return `há ${Math.floor(d / 3600)}h`;
    return `há ${Math.floor(d / 86400)}d`;
  }

  function fmtDurShort(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    if (sec >= 86400) return `${Math.floor(sec / 86400)}d ${Math.floor((sec % 86400) / 3600)}h`;
    if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}m`;
    if (sec >= 60) return `${Math.floor(sec / 60)}m`;
    return `${sec}s`;
  }

  function fmtPlaytime(minutes) {
    if (minutes >= 600) return `${Math.floor(minutes / 60)} h`;
    if (minutes >= 60) return `${(minutes / 60).toFixed(1)} h`;
    return `${minutes} min`;
  }

  function fmtGameAgo(unixSec) {
    if (!unixSec || unixSec <= 0) return "";
    const d = Math.max(0, Math.floor(Date.now() / 1000 - unixSec));
    if (d < 3600) return "Agora há pouco";
    if (d < 86400) return `há ${Math.floor(d / 3600)}h`;
    if (d < 2 * 86400) return "Ontem";
    if (d < 60 * 86400) return `há ${Math.floor(d / 86400)} dias`;
    return `há ${Math.floor(d / (30 * 86400))} meses`;
  }

  function weatherIcon(code, isDay) {
    if (code === 0) return isDay ? "wb_sunny" : "nights_stay";
    if (code <= 2) return isDay ? "wb_cloudy" : "nights_stay";
    if (code === 3) return "cloud";
    if (code === 45 || code === 48) return "foggy";
    if (code >= 51 && code <= 57) return "grain";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "umbrella";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "ac_unit";
    if (code >= 95) return "thunderstorm";
    return "cloud";
  }

  function weatherColor(code, isDay) {
    if (code <= 1) return isDay ? "#fbbf5a" : "#c08cff";
    if (code === 2) return isDay ? "#fcd38d" : "#a9b4ff";
    if (code === 3 || code === 45 || code === 48) return "#aeb7e0";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "#e6f0ff";
    if (code >= 95) return "#c08cff";
    return "#67e8f9";
  }

  function weatherText(code) {
    switch (code) {
      case 0: return "Céu limpo";
      case 1: return "Predom. limpo";
      case 2: return "Parcial. nublado";
      case 3: return "Nublado";
      case 45: case 48: return "Nevoeiro";
      case 51: case 53: case 55: return "Garoa";
      case 56: case 57: return "Garoa congelante";
      case 61: return "Chuva fraca";
      case 63: return "Chuva";
      case 65: return "Chuva forte";
      case 66: case 67: return "Chuva congelante";
      case 71: return "Neve fraca";
      case 73: return "Neve";
      case 75: return "Neve forte";
      case 77: return "Grãos de neve";
      case 80: case 81: return "Pancadas";
      case 82: return "Pancadas fortes";
      case 85: case 86: return "Neve esparsa";
      case 95: return "Tempestade";
      case 96: case 99: return "Tempestade/granizo";
      default: return "Nublado";
    }
  }

  function sameLocalDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  const state = {
    wsConnected: false,
    pcOnline: false,
    activePage: "home",
    statsView: "pc", // "pc" | "internet"
    netEnabled: true,
    pages: ["home", "stats", "calendar", "weather", "media", "timer", "shortcuts"],
    layout: null,
    home: null,
    stats: null,
    statsHist: { cpu: [], gpu: [] },
    media: null,
    mediaUpdatedAt: 0,
    artById: {},
    latestArtUrl: "",
    tiles: [],
    tileOn: new Set(),
    events: [],
    eventsDays: 7,
    weather: null,
    net: null,
    steam: null,
    steamUpdatedAt: 0,
    steamImgs: {},
    pcAsleep: false,
    wakeOverrideUntil: 0,
    saverLastMin: -1,
    timer: {
      totalSec: 25 * 60,
      remainSec: 25 * 60,
      state: "idle", // "idle" | "running" | "paused"
      lastTick: 0,
    },
  };

  const els = {
    app: document.getElementById("app"),
    navItems: document.getElementById("nav-items"),
    statusPc: document.getElementById("status-pc"),
    statusWifi: document.getElementById("status-wifi"),
    pageContainer: document.getElementById("page-container"),
    btnFullscreen: document.getElementById("btn-fullscreen"),
    sleepOverlay: document.getElementById("sleep-overlay"),
    sleepClockBox: document.getElementById("sleep-clock-box"),
    sleepTime: document.getElementById("sleep-time"),
    sleepDate: document.getElementById("sleep-date"),
    timerAlarm: document.getElementById("timer-alarm"),
    alarmSub: document.getElementById("alarm-sub"),
    btnAlarmAgain: document.getElementById("btn-alarm-again"),
    btnAlarmOk: document.getElementById("btn-alarm-ok"),
  };

  const pageEls = {};
  for (const key of Object.keys(PAGE_META)) {
    const sec = document.createElement("div");
    sec.className = "page";
    sec.id = `page-${key}`;
    els.pageContainer.appendChild(sec);
    pageEls[key] = sec;
  }

  let ws = null;
  let reconnectTimer = null;

  function sendCmd(obj) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  }

  function updateStatusUi() {
    els.statusPc.className = `mi status-ico ${state.pcOnline ? "good" : "dim"}`;
    els.statusPc.title = state.pcOnline ? "PC online" : "PC offline";

    els.statusWifi.textContent = state.wsConnected ? MI.wifi : MI.wifi_off;
    els.statusWifi.className = `mi status-ico ${state.wsConnected ? "good" : "bad"}`;
    els.statusWifi.title = state.wsConnected ? "Conectado ao servidor" : "Desconectado";
  }

  function homeGridItems() {
    const defaultGrid = [
      { widget: "stats", x: 0, y: 0, w: 3, h: 1 },
      { widget: "events", x: 0, y: 1, w: 3, h: 2 },
      { widget: "weather", x: 3, y: 0, w: 2, h: 1 },
      { widget: "media", x: 3, y: 1, w: 2, h: 1 },
      { widget: "net", x: 3, y: 2, w: 2, h: 1 },
    ];
    return (state.home?.grid || defaultGrid).filter(
      (g) => g.widget !== "claude" && g.widget !== "ai"
    );
  }

  function homeShowsEvents() {
    return homeGridItems().some((g) => g.widget === "events");
  }

  function calendarBadgeColor() {
    if (!state.pages.includes("calendar") || homeShowsEvents()) return null;
    const now = new Date();
    const nowSec = now.getTime() / 1000;
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime() / 1000;
    for (const ev of state.events) {
      if (ev.end <= nowSec) continue;
      if (ev.start <= dayEnd) return ev.color || "var(--accent)";
      break;
    }
    return null;
  }

  function computeVisiblePages() {
    const raw = state.layout?.pages;
    state.netEnabled = raw ? raw.includes("network") : true;
    if (!state.netEnabled && state.statsView === "internet") {
      state.statsView = "pc";
    }

    let list = raw
      ? raw.filter((p) => p in PAGE_META)
      : ["home", "stats", "calendar", "weather", "media", "timer", "games", "shortcuts"];

    if (!list.includes("home")) list.unshift("home");
    if (list.includes("games")) {
      const hasGames = state.steam && (state.steam.found || state.steam.playing || (state.steam.recent || []).length > 0);
      if (!hasGames) list = list.filter((p) => p !== "games");
    }

    // Firmware keeps Shortcuts last in the rail.
    if (list.includes("shortcuts")) {
      list = [...list.filter((p) => p !== "shortcuts"), "shortcuts"];
    }

    state.pages = list;
    if (!state.pages.includes(state.activePage)) {
      state.activePage = "home";
    }
  }

  function renderNav() {
    computeVisiblePages();
    const calDot = calendarBadgeColor();
    const timerText = state.timer.state !== "idle" ? fmtDuration(state.timer.remainSec) : null;

    els.navItems.innerHTML = state.pages
      .map((p) => {
        const meta = PAGE_META[p];
        const active = p === state.activePage ? "active" : "";
        const dot = p === "calendar" && calDot ? `<span class="nav-dot" style="background:${esc(calDot)}"></span>` : "";
        const content = p === "timer" && timerText ? esc(timerText) : iconMi(meta.icon);
        const hasText = p === "timer" && timerText ? " has-text" : "";
        return `<button class="nav-btn ${active}${hasText}" data-page="${p}" type="button" title="${esc(meta.title)}">${content}${dot}</button>`;
      })
      .join("");

    for (const [key, el] of Object.entries(pageEls)) {
      el.classList.toggle("active", key === state.activePage);
    }
  }

  els.navItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;
    switchPage(btn.dataset.page);
  });

  function switchPage(page) {
    if (page === "network") {
      if (!state.netEnabled) return;
      state.statsView = "internet";
      page = "stats";
    }
    if (!PAGE_META[page]) return;
    state.activePage = page;
    renderNav();
    renderActivePage();
  }

  // ---- Clock, Night / Sleep Saver & Live Ticks ----
  function checkNightMode() {
    const lay = state.layout;
    if (!lay || lay.night_start == null || lay.night_end == null || lay.night_start < 0 || lay.night_end < 0) {
      return false;
    }
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const s = lay.night_start;
    const e = lay.night_end;
    return s < e ? mins >= s && mins < e : mins >= s || mins < e;
  }

  function placeSleepBox() {
    const box = els.sleepClockBox;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = box.offsetWidth || 260;
    const bh = box.offsetHeight || 110;
    const roomX = Math.max(0, vw - 40 - bw);
    const roomY = Math.max(0, vh - 40 - bh);
    box.style.left = `${20 + Math.floor(Math.random() * (roomX + 1))}px`;
    box.style.top = `${20 + Math.floor(Math.random() * (roomY + 1))}px`;
  }

  function updateSleepOverlay() {
    const now = Date.now();
    if (now < state.wakeOverrideUntil) {
      els.sleepOverlay.classList.add("hidden");
      return;
    }
    const night = checkNightMode();
    const sleepMode = state.layout?.pc_sleep || "clock";
    const nightStyle = state.layout?.night_style || "off";

    const shouldSleep = (state.pcAsleep && sleepMode !== "none") || night;
    if (!shouldSleep) {
      els.sleepOverlay.classList.add("hidden");
      state.saverLastMin = -1;
      return;
    }
    const style = night ? nightStyle : sleepMode;
    els.sleepClockBox.classList.toggle("off", style === "off");
    const wasHidden = els.sleepOverlay.classList.contains("hidden");
    els.sleepOverlay.classList.remove("hidden");
    const curMin = new Date().getMinutes();
    if (wasHidden || curMin !== state.saverLastMin) {
      state.saverLastMin = curMin;
      placeSleepBox();
    }
  }

  els.sleepOverlay.addEventListener("click", () => {
    state.wakeOverrideUntil = Date.now() + 60_000;
    updateSleepOverlay();
  });

  function currentMediaPos() {
    if (!state.media) return 0;
    let pos = Number(state.media.pos || 0);
    if (state.media.playing && state.mediaUpdatedAt) {
      pos += (Date.now() - state.mediaUpdatedAt) / 1000;
    }
    const dur = Number(state.media.dur || 0);
    return dur > 0 ? Math.min(pos, dur) : pos;
  }

  function currentGameSessionSec() {
    const p = state.steam?.playing;
    if (!p) return 0;
    const extra = state.steamUpdatedAt ? Math.floor((Date.now() - state.steamUpdatedAt) / 1000) : 0;
    return Number(p.session_s || 0) + Math.max(0, extra);
  }

  function updateTimerDisplayInPlace() {
    const t = state.timer;
    const timeEl = pageEls.timer.querySelector("#timer-disp");
    const statusEl = pageEls.timer.querySelector("#timer-stat");
    const arcEl = pageEls.timer.querySelector("#timer-arc-ind");
    if (!timeEl || !arcEl) {
      renderTimer();
      return;
    }
    timeEl.textContent = fmtDuration(t.remainSec);
    if (statusEl) {
      statusEl.textContent = t.state === "running" ? "Rodando" : t.state === "paused" ? "Pausado" : "Pronto";
    }
    const C = 2 * Math.PI * 134;
    const frac = t.totalSec > 0 ? Math.max(0, Math.min(1, t.remainSec / t.totalSec)) : 0;
    arcEl.setAttribute("stroke-dasharray", `${(frac * C).toFixed(2)} ${C.toFixed(2)}`);
    arcEl.style.strokeOpacity = frac > 0 ? "1" : "0";
  }

  function tickClock() {
    const now = new Date();
    const hhmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const fullDate = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

    els.sleepTime.textContent = hhmm;
    els.sleepDate.textContent = fullDate;
    updateSleepOverlay();

    if (state.activePage === "home") {
      const hdrTime = pageEls.home.querySelector("#home-hdr-time");
      const hdrDate = pageEls.home.querySelector("#home-hdr-date");
      if (hdrTime) hdrTime.textContent = hhmm;
      if (hdrDate) hdrDate.textContent = fullDate;
      const clkTime = pageEls.home.querySelector("#w-clock-time");
      const clkDate = pageEls.home.querySelector("#w-clock-date");
      if (clkTime) clkTime.textContent = hhmm;
      if (clkDate) clkDate.textContent = fullDate;
    }

    if (state.media?.active && state.media.playing && state.activePage === "media") {
      const slider = pageEls.media.querySelector("#media-seek");
      const posLbl = pageEls.media.querySelector("#media-pos");
      if (slider && posLbl) {
        const cur = currentMediaPos();
        const dur = Math.max(Number(state.media.dur || 0), 1);
        posLbl.textContent = fmtDuration(cur);
        if (!slider.matches(":active")) {
          slider.value = Math.floor(cur);
          slider.style.setProperty("--seek-pct", `${Math.min(100, (cur / dur) * 100).toFixed(1)}%`);
        }
      }
    }

    if (state.steam?.playing && state.activePage === "games") {
      const sessEl = pageEls.games.querySelector("#game-now-session");
      if (sessEl) {
        const s = currentGameSessionSec();
        const txt = s >= 3600
          ? `Jogando há ${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`
          : `Jogando há ${Math.floor(s / 60)}m`;
        sessEl.textContent = txt;
      }
    }

    if (state.timer.state === "running") {
      const elapsed = Math.floor((Date.now() - state.timer.lastTick) / 1000);
      if (elapsed >= 1) {
        state.timer.lastTick += elapsed * 1000;
        state.timer.remainSec = Math.max(0, state.timer.remainSec - elapsed);
        if (state.timer.remainSec === 0) {
          state.timer.state = "idle";
          state.timer.remainSec = state.timer.totalSec;
          triggerAlarm();
          if (state.activePage === "timer") renderTimer();
        } else if (state.activePage === "timer") {
          updateTimerDisplayInPlace();
        }
        renderNav();
      }
    }
  }

  // ---- Shared Chart & Arc Helpers ----
  function renderArcGauge(pct, color, valText, name, sub) {
    const r = 46;
    const C = 2 * Math.PI * r;
    const arcLen = C * 0.75;
    const clamped = pct == null ? 0 : Math.max(0, Math.min(100, pct));
    const fill = (clamped / 100) * arcLen;
    return `<div class="card arc-card">
      <div class="arc-box">
        <svg class="arc-svg" viewBox="0 0 112 112" aria-hidden="true">
          <circle cx="56" cy="56" r="${r}" fill="none" stroke="var(--card-hi)" stroke-width="12"
            stroke-linecap="round" stroke-dasharray="${arcLen.toFixed(2)} ${C.toFixed(2)}"
            transform="rotate(135 56 56)"/>
          ${
            clamped > 0
              ? `<circle cx="56" cy="56" r="${r}" fill="none" stroke="${color}" stroke-width="12"
                  stroke-linecap="round" stroke-dasharray="${fill.toFixed(2)} ${C.toFixed(2)}"
                  transform="rotate(135 56 56)"/>`
              : ""
          }
        </svg>
        <div class="arc-val">${esc(valText)}</div>
      </div>
      <div class="arc-name">${esc(name)}</div>
      <div class="arc-sub">${esc(sub)}</div>
    </div>`;
  }

  function drawLineChart(canvas, seriesList, yMax = 100, divLines = 4, lineWidth = 2.5) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(120, Math.floor(rect.width));
    const h = Math.max(54, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#262a32";
    ctx.lineWidth = 1;
    for (let i = 0; i < divLines; i++) {
      const y = divLines === 1 ? Math.round(h / 2) + 0.5 : Math.round((h - 2) * (i / (divLines - 1))) + 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    for (const s of seriesList) {
      const pts = s.data;
      if (!pts.length) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      const total = s.slots || pts.length;
      const offset = total - pts.length;
      const step = w / Math.max(total - 1, 1);
      let started = false;
      pts.forEach((v, idx) => {
        if (v == null || v < 0) {
          started = false;
          return;
        }
        const x = (offset + idx) * step;
        const y = h - (Math.min(Math.max(v, 0), yMax) / yMax) * (h - 8) - 4;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
  }

  // ---- Page Renderers ----
  function renderActivePage() {
    switch (state.activePage) {
      case "home":
        renderHome();
        break;
      case "stats":
        renderStats();
        break;
      case "media":
        renderMedia();
        break;
      case "shortcuts":
        renderShortcuts();
        break;
      case "weather":
        renderWeather();
        break;
      case "calendar":
        renderCalendar();
        break;
      case "games":
        renderGames();
        break;
      case "timer":
        renderTimer();
        break;
    }
  }

  function renderHomeWidget(it) {
    const style = `grid-column:${it.x + 1}/span ${it.w};grid-row:${it.y + 1}/span ${it.h};`;
    const tiny = it.w < 2;
    const w = it.widget;

    if (w === "clock") {
      const now = new Date();
      const hhmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const date = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      return `<div class="w-clock-box" style="${style}">
        <div id="w-clock-time" class="w-clock-time">${esc(hhmm)}</div>
        <div id="w-clock-date" class="w-clock-date">${esc(date)}</div>
      </div>`;
    }

    if (w === "stats") {
      const s = state.stats;
      const online = state.pcOnline && s;
      const ramPct = online && s.ram_total ? (s.ram_used / s.ram_total) * 100 : null;
      const rows = [
        { name: "CPU", val: online ? s.cpu : null, color: "var(--accent2)" },
        { name: "GPU", val: online && s.gpu != null ? s.gpu : null, color: "var(--cyan)" },
        { name: "RAM", val: ramPct, color: "var(--data3)" },
      ];
      return `<div class="card widget-card" style="${style}" data-goto="stats">
        <div class="w-stats-bars">${rows
          .map((r) => {
            const txt = r.val != null ? `${Math.round(r.val)}%` : "--";
            const pct = r.val != null ? Math.min(100, Math.max(0, r.val)) : 0;
            return `<div class="w-stats-row">
              <span class="w-stats-lbl">${r.name}</span>
              ${tiny ? "" : `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${r.color}"></div></div>`}
              <span class="w-stats-val">${txt}</span>
            </div>`;
          })
          .join("")}</div>
      </div>`;
    }

    if (w === "events") {
      const now = new Date();
      const nowSec = now.getTime() / 1000;
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const upcoming = state.events.filter((ev) => ev.end > nowSec);
      const maxRows = it.h >= 2 ? 3 : 1;
      const shown = upcoming.slice(0, maxRows);
      const more = Math.max(0, upcoming.length - shown.length);
      const span = state.eventsDays === 1 ? "no próximo dia" : `nos próximos ${state.eventsDays} dias`;
      const footer = more > 0
        ? `+${more} ${span}`
        : shown.length > 0
          ? `Sem mais eventos ${span}`
          : `Nada agendado ${span}`;

      return `<div class="card widget-card w-events-card" style="${style}" data-goto="calendar">
        <div class="caption">PRÓXIMOS</div>
        <div class="w-events-list">${shown
          .map((ev) => {
            const st = new Date(ev.start * 1000);
            let day = st.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
            if (sameLocalDay(st, now)) day = "Hoje";
            else if (sameLocalDay(st, tomorrow)) day = "Amanhã";
            let when;
            if (ev.all_day) {
              when = `${day}  •  Dia todo`;
            } else if (ev.start <= nowSec) {
              const endStr = new Date(ev.end * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              when = `Agora  •  até ${endStr}`;
            } else {
              const stStr = st.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              when = `${day}  •  ${stStr}`;
            }
            return `<div class="w-event-item">
              <span class="ev-bar" style="background:${esc(ev.color || "var(--accent2)")}"></span>
              <div class="w-event-body">
                <div class="ev-title">${esc(ev.title)}</div>
                <div class="ev-time">${esc(when)}</div>
              </div>
            </div>`;
          })
          .join("")}</div>
        <div class="w-events-more" style="${shown.length ? "" : "padding-left:0"}">${esc(footer)}</div>
      </div>`;
    }

    if (w === "weather") {
      const wx = state.weather;
      if (!wx?.current) {
        return `<div class="card widget-card w-weather-card" style="${style}" data-goto="weather">
          <div class="w-weather-row">
            ${iconMi("cloud", "w-weather-ico")}
            <div class="w-weather-info">
              <div class="w-weather-temp">--</div>
              ${tiny ? "" : `<div class="w-weather-cond">Carregando clima</div>`}
            </div>
          </div>
        </div>`;
      }
      const c = wx.current;
      const isDay = Boolean(c.is_day);
      const hi = wx.daily?.temperature_2m_max?.[0];
      const lo = wx.daily?.temperature_2m_min?.[0];
      const rangeStr = hi != null && lo != null ? `Máx ${Math.round(hi)}°   Mín ${Math.round(lo)}°` : "";
      return `<div class="card widget-card w-weather-card" style="${style}" data-goto="weather">
        <div class="w-weather-row">
          <span class="mi w-weather-ico" style="color:${weatherColor(c.weather_code, isDay)}">${MI[weatherIcon(c.weather_code, isDay)]}</span>
          <div class="w-weather-info">
            <div class="w-weather-temp">${Math.round(c.temperature_2m)}°</div>
            ${
              tiny
                ? ""
                : `<div class="w-weather-cond">${esc(weatherText(c.weather_code))}</div>
                   <div class="w-weather-range">${esc(rangeStr)}</div>`
            }
          </div>
        </div>
      </div>`;
    }

    if (w === "media") {
      const m = state.media;
      const active = Boolean(m && m.active);
      const art = active ? (m.art_id && state.artById[m.art_id]) || state.latestArtUrl : "";
      const cover = art
        ? `<img class="w-media-cover" src="${art}" alt="">`
        : `<div class="w-media-cover">${iconMi("music_note")}</div>`;
      const title = active ? m.title : "Nada tocando";
      const sub = active ? m.artist || "" : state.pcOnline ? "" : "PC offline";
      return `<div class="card widget-card w-media-card" style="${style}" data-goto="media">
        <div class="w-media-row">
          ${cover}
          <div class="w-media-info">
            <div class="w-media-title">${esc(title)}</div>
            <div class="w-media-artist">${esc(sub)}</div>
          </div>
          ${
            active
              ? `<button class="w-media-play" id="btn-home-media-toggle" type="button" title="Play/Pause">${iconMi(m.playing ? "pause" : "play_arrow")}</button>`
              : ""
          }
        </div>
      </div>`;
    }

    if (w === "net") {
      const n = state.net;
      if (!n) {
        return `<div class="card widget-card" style="${style}" data-goto="network">
          <div class="w-net-head"><span class="caption">INTERNET</span></div>
          <div class="w-net-lat" style="color:var(--dim)">--</div>
          ${tiny ? "" : `<div class="w-net-sub">${state.pcOnline ? "Aguardando o PC" : "PC offline"}</div>`}
        </div>`;
      }
      const latVal = n.latency_ms != null ? Math.round(n.latency_ms) : -1;
      const latTxt = latVal >= 0 ? `${latVal} ms` : "--";
      const latCol = latVal < 0 ? "var(--dim)" : latVal < 40 ? "var(--text)" : latVal < 100 ? "var(--warn)" : "var(--bad)";
      let sub = "";
      if (n.testing) {
        sub = "Testando velocidade...";
      } else if (n.speed) {
        sub = `↓ ${Math.round(n.speed.down_mbps)}  ↑ ${Math.round(n.speed.up_mbps)} Mbps  •  ${fmtAgo(n.speed.at)}`;
      } else {
        sub = `Jitter ${n.jitter_ms ?? "--"} ms  •  Perda ${n.loss_pct ?? 0}%`;
      }
      return `<div class="card widget-card" style="${style}" data-goto="network">
        <div class="w-net-head">
          <span class="caption">INTERNET</span>
          ${tiny ? "" : `<span class="w-net-state" style="color:${n.online ? "var(--good)" : "var(--bad)"}">${n.online ? "Online" : "Offline"}</span>`}
        </div>
        <div class="w-net-lat" style="color:${latCol}">${latTxt}</div>
        ${tiny ? "" : `<div class="w-net-sub">${esc(sub)}</div>`}
      </div>`;
    }

    if (w === "game") {
      const st = state.steam;
      const playing = st?.playing;
      const g = playing || st?.recent?.[0] || null;
      const thumb = g ? state.steamImgs[`${g.appid}_1`] || state.steamImgs[`${g.appid}_0`] || state.steamImgs[`${g.appid}_2`] : "";
      let cap = "STEAM";
      let capCol = "var(--muted)";
      let sub = !st ? (state.pcOnline ? "Aguardando o PC" : "PC offline") : st.found ? "Sem jogos recentes" : "Steam não encontrada";
      let name = "";
      if (playing) {
        cap = "JOGANDO";
        capCol = "var(--good)";
        const s = currentGameSessionSec();
        sub = s >= 3600 ? `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m` : `${Math.floor(s / 60)}m`;
        if (g.total_min > 0 && g.total_min * 60 >= s + 600) sub += `  •  ${fmtPlaytime(g.total_min)}`;
        name = g.name;
      } else if (g) {
        cap = "RECENTE";
        const parts = [];
        const ago = fmtGameAgo(g.last);
        if (ago) parts.push(ago);
        if (g.total_min > 0) parts.push(fmtPlaytime(g.total_min));
        sub = parts.join("  •  ");
        name = g.name;
      }
      return `<div class="card widget-card" style="${style}" data-goto="games">
        <div class="w-game-row">
          <div class="w-game-art">
            ${thumb ? `<img src="${thumb}" alt="">` : iconMi("sports_esports")}
            ${!playing && g ? `<button class="w-game-play" data-launch-appid="${g.appid}" type="button" title="Abrir jogo">${iconMi("play_arrow")}</button>` : ""}
          </div>
          <div class="w-game-info">
            <div class="caption" style="color:${capCol}">${cap}</div>
            <div class="w-game-sub">${esc(sub)}</div>
            <div class="w-game-name">${esc(name)}</div>
          </div>
        </div>
      </div>`;
    }

    return `<div class="card widget-card" style="${style}"><div class="empty-state">--</div></div>`;
  }

  function renderHome() {
    const showHdr = state.home?.header !== false;
    const now = new Date();
    const hhmm = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const fullDate = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    const items = homeGridItems();

    pageEls.home.innerHTML = `<div class="home-wrap">
      ${
        showHdr
          ? `<div class="home-header">
               <span id="home-hdr-time" class="home-hdr-time">${esc(hhmm)}</span>
               <span id="home-hdr-date" class="home-hdr-date">${esc(fullDate)}</span>
             </div>`
          : ""
      }
      <div class="home-grid">${items.map(renderHomeWidget).join("")}</div>
    </div>`;

    pageEls.home.querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", () => switchPage(el.dataset.goto));
    });
    pageEls.home.querySelector("#btn-home-media-toggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      sendCmd({ type: "media", cmd: "toggle", value: 0 });
    });
    pageEls.home.querySelectorAll("[data-launch-appid]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        sendCmd({ type: "steam_launch", appid: Number(btn.dataset.launchAppid) });
      });
    });
  }

  function renderStatsPcView() {
    const s = state.stats;
    const online = state.pcOnline && s;
    const hasGpu = online && s.gpu != null;
    const ramPct = online && s.ram_total ? (s.ram_used / s.ram_total) * 100 : null;
    const vramPct = hasGpu && s.vram_total ? (s.vram_used / s.vram_total) * 100 : null;

    const cpuSub = online && s.cpu_temp != null && s.cpu_temp >= 0 ? `${Math.round(s.cpu_temp)}°C` : "";
    const gpuSub = online ? (hasGpu ? (s.gpu_temp != null && s.gpu_temp >= 0 ? `${Math.round(s.gpu_temp)}°C` : "") : "Sem GPU") : "";
    const ramSub = online && s.ram_total ? `${s.ram_used.toFixed(1)} / ${Math.round(s.ram_total)} GB` : "";
    const vramSub = hasGpu && s.vram_total ? `${s.vram_used.toFixed(1)} / ${Math.round(s.vram_total)} GB` : "";

    const hwNames = online ? [s.cpu_name, s.gpu_name].filter(Boolean).join("  /  ") : "";
    const netTxt = online ? `↓ ${fmtRate(s.net_down)}    ↑ ${fmtRate(s.net_up)}` : "";
    const diskTxt = online ? `Disco ${Math.round(s.disk)}% usado` : "";

    return `<div class="stats-view">
      <div class="pc-gauges">
        ${renderArcGauge(online ? s.cpu : null, "var(--accent2)", online ? `${Math.round(s.cpu)}%` : "--", "CPU", cpuSub)}
        ${renderArcGauge(hasGpu ? s.gpu : null, "var(--cyan)", hasGpu ? `${Math.round(s.gpu)}%` : "--", "GPU", gpuSub)}
        ${renderArcGauge(ramPct, "var(--data3)", ramPct != null ? `${Math.round(ramPct)}%` : "--", "RAM", ramSub)}
        ${renderArcGauge(vramPct, "var(--vram)", vramPct != null ? `${Math.round(vramPct)}%` : "--", "VRAM", vramSub)}
      </div>

      <div class="card chart-card">
        <div class="chart-head">
          <div class="chart-legend">
            <span class="caption">ÚLTIMO MINUTO</span>
            <span class="legend-item" style="color:var(--accent2)">• CPU</span>
            <span class="legend-item" style="color:var(--cyan)">• GPU</span>
          </div>
          <span class="chart-net">${esc(netTxt)}</span>
        </div>
        <div class="chart-wrap"><canvas id="stats-chart"></canvas></div>
        <div class="chart-foot">
          <span class="chart-hw">${esc(hwNames)}</span>
          <span class="chart-disk">${esc(diskTxt)}</span>
        </div>
        ${online ? "" : `<div class="chart-offline-msg">Inicie o companion no seu PC</div>`}
      </div>
    </div>`;
  }

  function renderStatsInternetView() {
    const n = state.net;
    const valid = Boolean(n);
    const latVal = valid && n.latency_ms != null ? Math.round(n.latency_ms) : -1;
    const latTxt = latVal >= 0 ? `${latVal} ms` : "--";
    const latCol = latVal < 0 ? "var(--dim)" : latVal < 40 ? "var(--text)" : latVal < 100 ? "var(--warn)" : "var(--bad)";
    const latSub = valid ? `Jitter ${n.jitter_ms ?? "--"} ms  •  Perda ${n.loss_pct ?? 0}%` : "";
    const latSubCol = valid && (n.loss_pct || 0) >= 5 ? "var(--bad)" : "var(--muted)";

    let statusTxt = "--";
    let statusCol = "var(--dim)";
    let dropLine = "";
    if (valid) {
      statusTxt = n.online ? "Online" : "Offline";
      statusCol = n.online ? "var(--good)" : "var(--bad)";
      const parts = [];
      if (n.online && n.up_since) parts.push(`On ${fmtDurShort(Date.now() / 1000 - n.up_since)}`);
      if (n.last_drop?.at) {
        parts.push(`Última queda ${fmtAgo(n.last_drop.at)}, ${fmtDurShort(n.last_drop.dur_s)}`);
      } else {
        parts.push(n.ip || "Sem quedas registradas");
      }
      dropLine = parts.join("  •  ");
    }

    const hist = valid && Array.isArray(n.hist) ? n.hist : [];
    const peak = Math.max(50, ...hist.filter((x) => x > 0));

    const sp = valid ? n.speed : null;
    const downTxt = sp ? `${Math.round(sp.down_mbps)} Mbps` : "--";
    const upTxt = sp ? `${Math.round(sp.up_mbps)} Mbps` : "--";
    const spSub = sp
      ? `Ping ${Math.round(sp.ping_ms)} ms  •  testado ${fmtAgo(sp.at)}`
      : "Sem teste ainda. Um teste usa cerca de 35 MB.";

    const liveDown = state.pcOnline && state.stats ? ((state.stats.net_down || 0) * 8.192 / 1000).toFixed(1) : null;
    const liveUp = state.pcOnline && state.stats ? ((state.stats.net_up || 0) * 8.192 / 1000).toFixed(1) : null;
    const nowTxt = liveDown != null ? `Agora ↓ ${liveDown}  ↑ ${liveUp} Mbps` : "";

    return `<div class="stats-view">
      <div class="net-top-row">
        <div class="card net-top-card">
          <div class="caption">LATÊNCIA</div>
          <div class="net-big-val" style="color:${latCol}">${latTxt}</div>
          <div class="net-sub-line" style="color:${latSubCol}">${esc(latSub)}</div>
        </div>
        <div class="card net-top-card">
          <div class="caption">STATUS</div>
          <div class="net-status-val" style="color:${statusCol}">${statusTxt}</div>
          <div class="net-sub-line">${esc(dropLine)}</div>
        </div>
        <div class="card net-top-card">
          <div class="caption">DADOS USADOS</div>
          <div class="net-data-rows">
            <div class="net-data-row">
              <span class="net-data-lbl">Hoje</span>
              <span class="net-data-val">${valid ? fmtBytes(n.today_bytes) : "--"}</span>
            </div>
            <div class="net-data-row">
              <span class="net-data-lbl">Este mês</span>
              <span class="net-data-val">${valid ? fmtBytes(n.month_bytes) : "--"}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card chart-card">
        <div class="chart-head">
          <span class="caption">LATÊNCIA, ÚLTIMOS 2 MINUTOS</span>
          <span class="chart-hw">${valid ? `máx ${peak} ms` : ""}</span>
        </div>
        <div class="chart-wrap"><canvas id="net-chart"></canvas></div>
        ${state.pcOnline ? "" : `<div class="chart-offline-msg">Inicie o companion no seu PC</div>`}
      </div>

      <div class="card net-speed-card">
        <div class="chart-head">
          <span class="caption">SPEED TEST</span>
          <span class="net-now-live">${esc(nowTxt)}</span>
        </div>
        <div class="net-speed-body">
          <div class="net-speed-left">
            <div class="net-speed-vals">
              <span class="speed-metric"><span class="mi" style="color:var(--cyan)">${MI.arrow_downward}</span>${esc(downTxt)}</span>
              <span class="speed-metric"><span class="mi" style="color:var(--accent2)">${MI.arrow_upward}</span>${esc(upTxt)}</span>
            </div>
            <div class="net-sub-line">${esc(spSub)}</div>
          </div>
          ${
            valid
              ? `<button id="btn-speedtest" class="pill-btn pill-accent" type="button" ${n.testing ? "disabled" : ""}>
                   ${n.testing ? "Testando..." : "Rodar teste"}
                 </button>`
              : ""
          }
        </div>
      </div>
    </div>`;
  }

  function renderStats() {
    const switcher = state.netEnabled
      ? `<div class="seg-switch" role="tablist">
           <button class="seg-btn ${state.statsView === "pc" ? "active" : ""}" data-stats-view="pc" type="button">PC</button>
           <button class="seg-btn ${state.statsView === "internet" ? "active" : ""}" data-stats-view="internet" type="button">Internet</button>
         </div>`
      : "";

    const body = state.statsView === "internet" && state.netEnabled
      ? renderStatsInternetView()
      : renderStatsPcView();

    pageEls.stats.innerHTML = `<div class="stats-shell">${switcher}${body}</div>`;

    pageEls.stats.querySelectorAll("[data-stats-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.statsView = btn.dataset.statsView;
        renderStats();
      });
    });

    if (state.statsView === "internet" && state.netEnabled) {
      const hist = state.net?.hist || [];
      const peak = Math.max(50, ...hist.filter((x) => x > 0));
      drawLineChart(pageEls.stats.querySelector("#net-chart"), [{ data: hist, color: "#5ed3c6", slots: 120 }], peak, 3, 2);
      pageEls.stats.querySelector("#btn-speedtest")?.addEventListener("click", (e) => {
        e.currentTarget.textContent = "Iniciando...";
        sendCmd({ type: "speedtest" });
      });
    } else if (state.pcOnline) {
      const series = [{ data: state.statsHist.cpu, color: "#6cb4ff", slots: 60 }];
      if (state.stats?.gpu != null) series.push({ data: state.statsHist.gpu, color: "#5ed3c6", slots: 60 });
      drawLineChart(pageEls.stats.querySelector("#stats-chart"), series, 100, 4, 3);
    }
  }

  function renderMedia() {
    const m = state.media;
    const spotifyTileIdx = state.tiles.findIndex(
      (t) => String(t.label || "").toLowerCase().includes("spotify")
    );

    if (!m || !m.active) {
      pageEls.media.innerHTML = `<div class="media-empty">
        <span class="mi empty-ico">${MI.music_note}</span>
        <div class="empty-title">Nada tocando</div>
        <div class="empty-sub">${state.pcOnline ? "Toque algo no seu PC" : "Inicie o companion no seu PC"}</div>
        ${
          spotifyTileIdx >= 0
            ? `<button id="btn-media-open-spotify" class="btn-open-spotify" type="button" title="Abrir Spotify no PC">${spotifySvg()}</button>`
            : ""
        }
      </div>`;
      pageEls.media.querySelector("#btn-media-open-spotify")?.addEventListener("click", () => {
        sendCmd({ type: "shortcut", id: spotifyTileIdx });
      });
      return;
    }

    const art = (m.art_id && state.artById[m.art_id]) || state.latestArtUrl;
    const dur = Number(m.dur || 0);
    const pos = Math.floor(currentMediaPos());
    const seekPct = dur > 0 ? Math.min(100, (pos / dur) * 100) : 0;

    pageEls.media.innerHTML = `<div class="media-layout">
      <div class="media-art-box">
        ${art ? `<img src="${art}" alt="Capa">` : iconMi("music_note")}
      </div>
      <div class="media-right">
        <div class="media-src-row">
          <span class="media-source">${esc(m.source || "Mídia")}</span>
          ${
            spotifyTileIdx >= 0
              ? `<button id="btn-media-open-spotify" class="media-btn-app" type="button" title="Abrir Spotify no PC">${spotifySvg()}</button>`
              : ""
          }
        </div>
        <div class="media-title">${esc(m.title)}</div>
        <div class="media-artist">${esc(m.artist || "")}</div>
        <div class="media-album">${esc(m.album || "")}</div>
        <div class="media-seek-wrap">
          <input id="media-seek" class="seek-slider" type="range" min="0" max="${Math.max(dur, 1)}" value="${pos}" style="--seek-pct:${seekPct.toFixed(1)}%" ${m.can_seek && dur > 0 ? "" : "disabled"}>
          <div class="media-times">
            <span id="media-pos">${fmtDuration(pos)}</span>
            <span>${dur > 0 ? fmtDuration(dur) : ""}</span>
          </div>
        </div>
        <div class="media-controls">
          <button class="media-btn" data-media-cmd="prev" type="button" title="Anterior">${iconMi("skip_previous")}</button>
          <button class="media-btn play" data-media-cmd="toggle" type="button" title="Play/Pause">${iconMi(m.playing ? "pause" : "play_arrow")}</button>
          <button class="media-btn" data-media-cmd="next" type="button" title="Próxima">${iconMi("skip_next")}</button>
        </div>
      </div>
    </div>`;

    pageEls.media.querySelector("#btn-media-open-spotify")?.addEventListener("click", () => {
      if (spotifyTileIdx >= 0) sendCmd({ type: "shortcut", id: spotifyTileIdx });
    });

    pageEls.media.querySelectorAll("[data-media-cmd]").forEach((btn) => {
      btn.addEventListener("click", () => sendCmd({ type: "media", cmd: btn.dataset.mediaCmd, value: 0 }));
    });

    const slider = pageEls.media.querySelector("#media-seek");
    if (slider && m.can_seek && dur > 0) {
      slider.addEventListener("input", () => {
        const v = Number(slider.value);
        const posEl = pageEls.media.querySelector("#media-pos");
        if (posEl) posEl.textContent = fmtDuration(v);
        slider.style.setProperty("--seek-pct", `${Math.min(100, (v / dur) * 100).toFixed(1)}%`);
      });
      slider.addEventListener("change", () => {
        sendCmd({ type: "media", cmd: "seek", value: Number(slider.value) });
      });
    }
  }

  function renderShortcuts() {
    if (!state.tiles.length) {
      pageEls.shortcuts.innerHTML = `<div class="media-empty">
        <span class="mi empty-ico">${MI.grid_view}</span>
        <div class="empty-title">Nenhum atalho configurado</div>
        <div class="empty-sub">Inicie o companion no seu PC</div>
      </div>`;
      return;
    }
    const n = state.tiles.length;
    const cols = n <= 4 ? 2 : n <= 6 ? 3 : 4;
    pageEls.shortcuts.innerHTML = `<div class="tiles-grid" style="--cols:${cols}">${state.tiles
      .map((t, idx) => {
        const lit = state.tileOn.has(idx) ? "lit" : "";
        const dis = !state.pcOnline ? "disabled" : "";
        return `<button class="tile-btn ${lit} ${dis}" data-tile-id="${idx}" type="button" style="--tile-col:${esc(t.color || "#2b2f3a")}">
          ${iconMi(t.icon)}
          <span class="tile-lbl">${esc(t.label)}</span>
        </button>`;
      })
      .join("")}</div>`;

    pageEls.shortcuts.querySelectorAll("[data-tile-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.pcOnline) return;
        sendCmd({ type: "shortcut", id: Number(btn.dataset.tileId) });
      });
    });
  }

  function renderWeather() {
    const w = state.weather;
    if (!w?.current) {
      pageEls.weather.innerHTML = `<div class="card" style="height:100%"><div class="empty-state">Buscando previsão do tempo...</div></div>`;
      return;
    }
    const c = w.current;
    const h = w.hourly || {};
    const d = w.daily || {};
    const isDay = Boolean(c.is_day);
    const updatedStr = w.updated_at
      ? `Atualizado ${new Date(w.updated_at * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
      : "";

    const nowMs = Date.now();
    const hours = (h.time || [])
      .map((t, i) => ({
        t,
        ms: new Date(t).getTime(),
        temp: h.temperature_2m?.[i],
        code: h.weather_code?.[i] ?? c.weather_code,
        pop: h.precipitation_probability?.[i] ?? 0,
      }))
      .filter((x) => x.ms >= nowMs - 3600_000)
      .slice(0, 24);

    const days = (d.time || []).slice(0, 6).map((t, i) => ({
      t,
      code: d.weather_code?.[i] ?? 0,
      tmax: d.temperature_2m_max?.[i],
      tmin: d.temperature_2m_min?.[i],
      pop: d.precipitation_probability_max?.[i] ?? 0,
    }));

    pageEls.weather.innerHTML = `<div class="weather-layout">
      <div class="card weather-now-card">
        <div class="weather-now-left">
          <span class="mi weather-now-ico" style="color:${weatherColor(c.weather_code, isDay)}">${MI[weatherIcon(c.weather_code, isDay)]}</span>
          <div>
            <div class="weather-big-temp">${Math.round(c.temperature_2m)}°</div>
            <div class="weather-cond">${esc(weatherText(c.weather_code))}</div>
            <div class="weather-city">${esc(w.city || "Local")}</div>
          </div>
        </div>
        <div class="weather-now-right">
          <div>Sensação ${Math.round(c.apparent_temperature)}°</div>
          <div>Umidade ${Math.round(c.relative_humidity_2m)}%</div>
          <div>Vento ${Math.round(c.wind_speed_10m)} km/h</div>
          <div class="weather-updated">${esc(updatedStr)}</div>
        </div>
      </div>

      <div class="card weather-hourly-card">
        <div class="hourly-strip">${hours
          .map((x, idx) => {
            const dt = new Date(x.t);
            const hDay = dt.getHours() >= 6 && dt.getHours() < 19;
            const hh = idx === 0 ? "Agora" : dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            return `<div class="hour-col">
              <div class="hour-time">${hh}</div>
              <span class="mi hour-ico" style="color:${weatherColor(x.code, hDay)}">${MI[weatherIcon(x.code, hDay)]}</span>
              <div class="hour-temp">${Math.round(x.temp)}°</div>
              <div class="hour-pop">${x.pop >= 10 ? `${Math.round(x.pop)}%` : ""}</div>
            </div>`;
          })
          .join("")}</div>
      </div>

      <div class="card weather-daily-card">
        <div class="daily-grid">${days
          .map((x, idx) => {
            const dt = new Date(x.t + "T12:00:00");
            const label = idx === 0 ? "Hoje" : dt.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
            return `<div class="day-col">
              <div class="day-name">${esc(label)}</div>
              <span class="mi day-ico" style="color:${weatherColor(x.code, true)}">${MI[weatherIcon(x.code, true)]}</span>
              <div class="day-range">${Math.round(x.tmax)}° / ${Math.round(x.tmin)}°</div>
              <div class="day-pop">${x.pop >= 10 ? `${Math.round(x.pop)}%` : ""}</div>
            </div>`;
          })
          .join("")}</div>
      </div>
    </div>`;
  }

  function renderCalendar() {
    const now = new Date();
    const nowSec = now.getTime() / 1000;
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const visible = state.events.filter((ev) => ev.end > nowSec);
    const span = state.eventsDays === 1 ? "no próximo dia" : `nos próximos ${state.eventsDays} dias`;

    if (!visible.length) {
      pageEls.calendar.innerHTML = `<div class="cal-wrap" style="height:100%">
        <div class="cal-page-title">Próximos</div>
        <div class="media-empty">
          <div class="empty-title">Nada agendado ${span}</div>
          <div class="empty-sub">${state.pcOnline ? "Configure feeds ICS em companion/config.toml" : "Inicie o companion no seu PC"}</div>
        </div>
      </div>`;
      return;
    }

    const groups = new Map();
    for (const ev of visible) {
      const dayDate = ev.start < nowSec ? now : new Date(ev.start * 1000);
      const dateStr = dayDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
      let hdr = dateStr;
      if (sameLocalDay(dayDate, now)) hdr = `HOJE  •  ${dateStr}`;
      else if (sameLocalDay(dayDate, tomorrow)) hdr = `AMANHÃ  •  ${dateStr}`;
      if (!groups.has(hdr)) groups.set(hdr, []);
      groups.get(hdr).push(ev);
    }

    let html = `<div class="cal-wrap"><div class="cal-page-title">Próximos</div><div class="cal-list">`;
    for (const [day, list] of groups.entries()) {
      html += `<div class="cal-day-hdr">${esc(day)}</div>`;
      for (const ev of list) {
        const live = !ev.all_day && ev.start <= nowSec && ev.end > nowSec;
        const col = esc(ev.color || "var(--accent2)");
        const s = new Date(ev.start * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const e = new Date(ev.end * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const when = ev.all_day ? "Dia todo" : `${s}<br>${e}`;
        const sub = [ev.loc, ev.cal].filter(Boolean).join("  •  ");
        html += `<div class="cal-ev${live ? " live" : ""}" style="${live ? `border-color:${col}` : ""}">
          <span class="cal-ev-bar" style="background:${col}"></span>
          <span class="cal-ev-time">${when}</span>
          <div class="cal-ev-main">
            <div class="cal-ev-title">${esc(ev.title)}</div>
            ${sub ? `<div class="cal-ev-sub">${esc(sub)}</div>` : ""}
          </div>
        </div>`;
      }
    }
    html += `<div class="cal-end">Sem mais eventos ${span}</div></div></div>`;
    pageEls.calendar.innerHTML = html;
  }

  function renderGames() {
    const st = state.steam;
    const p = st?.playing;
    const friends = st?.friends || [];
    const recent = (st?.recent || []).slice(0, 5);

    let topHtml = "";
    if (p) {
      const heroImg = state.steamImgs[`${p.appid}_0`] || "";
      const sessSec = currentGameSessionSec();
      const sessTxt = sessSec >= 3600
        ? `Jogando há ${Math.floor(sessSec / 3600)}h ${String(Math.floor((sessSec % 3600) / 60)).padStart(2, "0")}m`
        : `Jogando há ${Math.floor(sessSec / 60)}m`;
      const metaParts = [];
      if (p.total_min > 0 && p.total_min * 60 >= sessSec + 600) {
        metaParts.push(`${fmtPlaytime(p.total_min)} jogadas`);
      }
      if (friends.length) {
        metaParts.push(`${friends.length} ${friends.length === 1 ? "amigo jogando" : "amigos jogando"}`);
      }
      topHtml = `<div class="game-now-row">
        ${heroImg ? `<img class="game-hero" src="${heroImg}" alt="">` : `<div class="game-hero"></div>`}
        <div class="game-now-info">
          <div class="caption" style="color:var(--good)">JOGANDO AGORA</div>
          <div class="game-now-title">${esc(p.name)}</div>
          <div id="game-now-session" class="game-now-session">${esc(sessTxt)}</div>
          <div class="game-now-total">${esc(metaParts.join("  •  "))}</div>
        </div>
      </div>`;
    } else {
      const idleSub = !st
        ? (state.pcOnline ? "Aguardando o PC" : "PC offline")
        : !st.found
          ? "Steam não encontrada no PC"
          : "Inicie um jogo ou escolha abaixo";
      const friendsHtml = friends.length
        ? `<div class="game-friends">
             <div class="caption">AMIGOS JOGANDO</div>
             ${friends.slice(0, 4).map((f) => `<div class="friend-row"><span class="friend-name">${esc(f.name)}</span><span class="friend-game">${esc(f.game)}</span></div>`).join("")}
           </div>`
        : "";
      topHtml = `<div class="game-idle-row">
        <div class="game-idle-left">
          ${iconMi("sports_esports")}
          <div>
            <div class="game-now-title">Nenhum jogo aberto</div>
            <div class="game-now-total" style="margin-top:4px">${esc(idleSub)}</div>
          </div>
        </div>
        ${friendsHtml}
      </div>`;
    }

    const recentBody = recent.length
      ? `<div class="recent-grid">${recent
          .map((g) => {
            const thumb = state.steamImgs[`${g.appid}_2`] || state.steamImgs[`${g.appid}_1`] || "";
            return `<div class="game-tile" data-appid="${g.appid}">
              <div class="game-poster-box">
                ${thumb ? `<img src="${thumb}" alt="">` : iconMi("sports_esports")}
                ${g.total_min > 0 ? `<span class="game-hours-pill">${esc(fmtPlaytime(g.total_min))}</span>` : ""}
              </div>
              <div class="game-tile-name">${esc(g.name)}</div>
            </div>`;
          })
          .join("")}</div>`
      : `<div class="empty-state">${st?.found ? "Sem jogos recentes" : ""}</div>`;

    pageEls.games.innerHTML = `<div class="games-layout">
      <div class="card games-top-card">${topHtml}</div>
      <div class="card games-recent-card">
        <div class="caption">RECENTES  •  TOQUE PARA JOGAR</div>
        ${recentBody}
      </div>
    </div>`;

    pageEls.games.querySelectorAll("[data-appid]").forEach((tile) => {
      tile.addEventListener("click", () => {
        sendCmd({ type: "steam_launch", appid: Number(tile.dataset.appid) });
      });
    });
  }

  function triggerAlarm() {
    const mins = Math.floor(state.timer.totalSec / 60);
    els.alarmSub.textContent = state.timer.totalSec % 60 === 0
      ? `Timer de ${mins} ${mins === 1 ? "minuto" : "minutos"}`
      : `Timer de ${state.timer.totalSec} segundos`;
    els.timerAlarm.classList.remove("hidden");
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.22, 0.44].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.19);
      });
    } catch {
      // AudioContext might require prior user gesture
    }
  }

  els.btnAlarmAgain.addEventListener("click", () => {
    els.timerAlarm.classList.add("hidden");
    state.timer.remainSec = state.timer.totalSec;
    state.timer.state = "running";
    state.timer.lastTick = Date.now();
    renderNav();
    if (state.activePage === "timer") renderTimer();
  });

  els.btnAlarmOk.addEventListener("click", () => {
    els.timerAlarm.classList.add("hidden");
  });

  function renderTimer() {
    const t = state.timer;
    const presets = [1, 5, 10, 15, 25, 45];
    const r = 134;
    const C = 2 * Math.PI * r;
    const frac = t.totalSec > 0 ? Math.max(0, Math.min(1, t.remainSec / t.totalSec)) : 0;
    const statusTxt = t.state === "running" ? "Rodando" : t.state === "paused" ? "Pausado" : "Pronto";

    pageEls.timer.innerHTML = `<div class="timer-layout">
      <div class="card timer-ring-card">
        <div class="timer-ring-box">
          <svg class="timer-svg" viewBox="0 0 300 300" aria-hidden="true">
            <circle cx="150" cy="150" r="${r}" fill="none" stroke="var(--card-hi)" stroke-width="16"/>
            <circle id="timer-arc-ind" cx="150" cy="150" r="${r}" fill="none" stroke="var(--accent)"
              stroke-width="16" stroke-linecap="round"
              stroke-dasharray="${(frac * C).toFixed(2)} ${C.toFixed(2)}"
              style="stroke-opacity:${frac > 0 ? 1 : 0}"
              transform="rotate(-90 150 150)"/>
          </svg>
          <div class="timer-center-text">
            <div id="timer-disp" class="timer-display">${fmtDuration(t.remainSec)}</div>
            <div id="timer-stat" class="timer-status">${statusTxt}</div>
          </div>
        </div>
      </div>

      <div class="card timer-ctrl-card">
        <div class="caption">MINUTOS</div>
        <div class="timer-presets">${presets
          .map((m) => {
            const sel = m * 60 === t.totalSec ? "selected" : "";
            return `<button class="timer-preset-btn ${sel}" data-preset="${m}" type="button">${m}</button>`;
          })
          .join("")}</div>
        <div class="timer-actions">
          <button id="btn-timer-reset" class="round-btn timer-reset-btn" type="button" title="Zerar">${iconMi("replay")}</button>
          <button id="btn-timer-toggle" class="timer-go-btn" type="button" title="Iniciar/Pausar">${iconMi(t.state === "running" ? "pause" : "play_arrow")}</button>
        </div>
      </div>
    </div>`;

    pageEls.timer.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = Number(btn.dataset.preset) * 60;
        const wasRunning = t.state === "running";
        t.totalSec = sec;
        t.remainSec = sec;
        t.state = wasRunning ? "running" : "idle";
        t.lastTick = Date.now();
        renderNav();
        renderTimer();
      });
    });

    pageEls.timer.querySelector("#btn-timer-toggle").addEventListener("click", () => {
      if (t.state === "running") {
        t.state = "paused";
      } else {
        if (t.remainSec <= 0) t.remainSec = t.totalSec;
        t.state = "running";
        t.lastTick = Date.now();
      }
      renderNav();
      renderTimer();
    });

    pageEls.timer.querySelector("#btn-timer-reset").addEventListener("click", () => {
      t.state = "idle";
      t.remainSec = t.totalSec;
      renderNav();
      renderTimer();
    });
  }

  // ---- NoSleep & Fullscreen ----
  const noSleep = typeof NoSleep === "function" ? new NoSleep() : null;

  async function enableNoSleep() {
    if (!noSleep || noSleep.isEnabled) return;
    try {
      await noSleep.enable();
    } catch {
      // Browser autoplay policy may require a user gesture first; listeners below retry.
    }
  }

  for (const evt of ["touchstart", "pointerdown", "click"]) {
    document.addEventListener(
      evt,
      () => {
        if (noSleep && !noSleep.isEnabled) enableNoSleep();
      },
      { passive: true }
    );
  }

  function updateFullscreenIcon() {
    const fs = Boolean(document.fullscreenElement);
    els.btnFullscreen.classList.toggle("on", fs);
    const ico = els.btnFullscreen.querySelector(".mi");
    if (ico) ico.textContent = fs ? MI.fullscreen_exit : MI.fullscreen;
  }

  els.btnFullscreen.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation?.lock) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if unsupported
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenIcon);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      enableNoSleep();
    }
  });

  window.addEventListener("resize", () => {
    if (state.activePage === "stats") renderStats();
  });

  // ---- WebSocket Client ----
  function handleServerMessage(msg) {
    switch (msg.type) {
      case "hub_status":
        state.pcOnline = Boolean(msg.pc_online);
        if (!state.pcOnline) state.pcAsleep = false;
        updateStatusUi();
        renderActivePage();
        break;
      case "layout":
        state.layout = msg;
        if (msg.nav && ["left", "right", "bottom"].includes(msg.nav)) {
          els.app.dataset.nav = msg.nav;
        }
        renderNav();
        if (state.activePage === "stats") renderStats();
        break;
      case "home":
        state.home = msg;
        renderNav();
        if (state.activePage === "home") renderHome();
        break;
      case "pc_power":
        state.pcAsleep = Boolean(msg.asleep);
        updateSleepOverlay();
        break;
      case "stats":
        state.stats = msg;
        state.statsHist.cpu.push(Number(msg.cpu || 0));
        if (state.statsHist.cpu.length > 60) state.statsHist.cpu.shift();
        if (msg.gpu != null) {
          state.statsHist.gpu.push(Number(msg.gpu));
          if (state.statsHist.gpu.length > 60) state.statsHist.gpu.shift();
        }
        if (state.activePage === "home") renderHome();
        if (state.activePage === "stats") {
          if (state.statsView === "internet") {
            const liveEl = pageEls.stats.querySelector(".net-now-live");
            if (liveEl) {
              const d = ((msg.net_down || 0) * 8.192 / 1000).toFixed(1);
              const u = ((msg.net_up || 0) * 8.192 / 1000).toFixed(1);
              liveEl.textContent = state.pcOnline ? `Agora ↓ ${d}  ↑ ${u} Mbps` : "";
            }
          } else {
            renderStats();
          }
        }
        break;
      case "media":
        state.media = msg;
        state.mediaUpdatedAt = Date.now();
        if (!msg.active || !msg.art_id) state.latestArtUrl = "";
        if (state.activePage === "home") renderHome();
        if (state.activePage === "media") {
          const slider = pageEls.media.querySelector("#media-seek");
          if (!slider || !slider.matches(":active")) renderMedia();
        }
        break;
      case "art_image":
        state.artById[msg.art_id] = msg.data_url;
        state.latestArtUrl = msg.data_url;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "media") renderMedia();
        break;
      case "tiles":
        state.tiles = msg.tiles || [];
        if (state.activePage === "shortcuts") renderShortcuts();
        break;
      case "tile_state":
        state.tileOn = new Set(msg.on || []);
        if (state.activePage === "shortcuts") renderShortcuts();
        break;
      case "events":
        state.events = msg.events || [];
        state.eventsDays = Number(msg.days || 7);
        renderNav();
        if (state.activePage === "home") renderHome();
        if (state.activePage === "calendar") renderCalendar();
        break;
      case "weather":
        state.weather = msg;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "weather") renderWeather();
        break;
      case "net":
        state.net = msg;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "stats" && state.statsView === "internet") renderStats();
        break;
      case "steam":
        state.steam = msg;
        state.steamUpdatedAt = Date.now();
        renderNav();
        if (state.activePage === "home") renderHome();
        if (state.activePage === "games") renderGames();
        break;
      case "steam_image":
        state.steamImgs[`${msg.appid}_${msg.kind}`] = msg.data_url;
        if (state.activePage === "home") renderHome();
        if (state.activePage === "games") renderGames();
        break;
    }
  }

  function connect() {
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${proto}//${location.host}/client`;
    ws = new WebSocket(url);

    ws.addEventListener("open", () => {
      state.wsConnected = true;
      updateStatusUi();
    });

    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        handleServerMessage(msg);
      } catch {
        // Ignore malformed frame
      }
    });

    ws.addEventListener("close", () => {
      state.wsConnected = false;
      state.pcOnline = false;
      updateStatusUi();
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 2500);
    });
  }

  renderNav();
  renderActivePage();
  updateStatusUi();
  tickClock();
  setInterval(tickClock, 1000);
  enableNoSleep();
  connect();
})();
