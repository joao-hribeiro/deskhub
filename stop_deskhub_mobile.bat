@echo off
setlocal
echo Encerrando Desk Hub Mobile Bridge e Companion...
powershell -NoProfile -Command "$procs = Get-CimInstance Win32_Process | Where-Object { ($_.Name -match '^pythonw?\.exe$') -and ($_.CommandLine -match 'mobile_web[/\\]server\.py|-m\s+deskhub') }; $count = 0; foreach ($p in $procs) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue; $count++ }; Write-Host ('Processos encerrados: ' + $count)"
pause
