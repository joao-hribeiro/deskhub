@echo off
setlocal
cd /d "%~dp0"

set "PY=%~dp0companion\.venv\Scripts\python.exe"
if not exist "%PY%" (
    echo [ERRO] Ambiente virtual nao encontrado em "%PY%".
    pause
    exit /b 1
)

echo ========================================================
echo   Desk Hub - Tela no Celular (Samsung Galaxy A03)
echo ========================================================
echo.
echo Abra no Chrome do seu Samsung A03 um dos enderecos abaixo:
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { Write-Host ('  -> http://' + $_.IPAddress + ':8080  (' + $_.InterfaceAlias + ')') -ForegroundColor Cyan }"
echo.
echo Dica: Se nao abrir no celular, libere a porta TCP 8080 no Firewall do Windows.
echo No Chrome do celular: menu (3 pontinhos) -^> "Adicionar a tela inicial".
echo.
echo Iniciando servidor Bridge (porta 8080)...
start "DeskHub Mobile Bridge" "%PY%" "%~dp0mobile_web\server.py" --host 0.0.0.0 --port 8080 --token deskhub-mobile

timeout /t 2 /nobreak >nul
echo Iniciando Desk Hub Companion...
cd /d "%~dp0companion"
"%PY%" -m deskhub --config "%~dp0companion\config.toml"

echo.
echo Companion encerrado. Feche a janela "DeskHub Mobile Bridge" se nao for mais usar.
pause
