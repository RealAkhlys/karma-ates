@echo off
title NASA ISS 3D Fire Spread Simulation Server
color 0B
echo ======================================================================
echo    NASA ISS 3D FIRE SPREAD SIMULATOR -- MISSION CONTROL
echo    Space Apps 2026 / NASA PSI Microgravity Combustion & Safety AI
echo ======================================================================
echo.
echo [1/2] Detecting Python and Node environments...
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       Python launcher detected. Starting local HTTP server on port 8080...
    echo [2/2] Opening default browser at http://localhost:8080/index.html ...
    start "" "http://localhost:8080/index.html"
    py -m http.server 8080
    goto end
)

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       Python detected. Starting local HTTP server on port 8080...
    echo [2/2] Opening default browser at http://localhost:8080/index.html ...
    start "" "http://localhost:8080/index.html"
    python -m http.server 8080
    goto end
)

where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       NPX detected. Starting local HTTP server on port 8080...
    echo [2/2] Opening default browser at http://localhost:8080/index.html ...
    start "" "http://localhost:8080/index.html"
    npx --yes serve -l 8080 .
    goto end
)

echo.
echo [!] Neither Python nor Node was found in PATH.
echo     Opening index.html directly in your default browser...
start "" "index.html"
echo.
echo Note: When running directly from file://, click 'Load ISS FBX File'
echo in the top bar to select the 315 MB ISS FBX model via file picker.
echo ======================================================================
:end
pause
