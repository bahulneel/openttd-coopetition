@echo off
REM Package script for OpenTTD Coopetition mod
REM This script creates a zip file with all necessary files for distribution

REM Create output directory if it doesn't exist
if not exist dist mkdir dist

REM Get version from version.nut
for /f "tokens=3" %%i in ('findstr /C:"COOPETITION_VERSION =" src\version.nut') do set VERSION=%%i

REM Create zip file using PowerShell (available on Windows 10+)
powershell -Command "Compress-Archive -Path src\*.nut,LICENSE,README.md -DestinationPath dist\coopetition-v%VERSION%.zip -Force"

echo Package created: dist\coopetition-v%VERSION%.zip
echo To install, extract this zip to your OpenTTD game script directory in a 'coopetition' subfolder.