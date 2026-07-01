@echo off
title betNANDO Dev
color 0A
cd /d "%~dp0"

echo ==========================================
echo          BETLEAGUE - Modo Desenvolvimento
echo ==========================================
echo.

:: Kill existing processes on ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5555 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado. Instala em https://nodejs.org
    pause
    exit /b 1
)

:: Start PostgreSQL with Docker
echo [0/3] A iniciar PostgreSQL...
where docker >nul 2>&1
if %errorlevel% equ 0 (
    docker ps -q -f name=betleague-db | findstr . >nul 2>&1
    if %errorlevel% neq 0 (
        docker-compose up -d postgres
        echo A aguardar PostgreSQL...
        timeout /t 5 /nobreak >nul
    ) else (
        echo PostgreSQL ja esta a correr.
    )
) else (
    echo [AVISO] Docker nao encontrado. Certifica-te que PostgreSQL esta a correr na porta 5432.
)

:: Start API
echo [1/3] A iniciar API...
start "betNANDO API" /D "%~dp0apps\api" cmd /k "title betNANDO API && color 0B && npx tsx watch src/index.ts"

:: Wait for API
timeout /t 2 /nobreak >nul

:: Start Web
echo [2/3] A iniciar Web...
start "betNANDO Web" /D "%~dp0apps\web" cmd /k "title betNANDO Web && color 0D && npx vite --host"

echo.
echo ==========================================
echo   API  : http://localhost:3001
echo   Web  : http://localhost:5555
echo   Docs : http://localhost:3001/api/docs
echo ==========================================
echo.
echo   Admin: admin@betnando.com / admin123
echo   User : joao@example.com / password123
echo.
echo   Fechar esta janela nao fecha os servidores.
echo   Para parar: fecha as janelas API e Web.
echo ==========================================
