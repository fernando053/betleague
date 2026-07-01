@echo off
title BetLeague Stop
color 0C
cd /d "%~dp0"

echo A parar BetLeague...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5555 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

echo Servidores parados.
timeout /t 2 /nobreak >nul
