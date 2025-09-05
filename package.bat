@echo off
REM Monorepo package script for OpenTTD Coopetition
REM This script creates multiple zip files for different distribution targets

setlocal enabledelayedexpansion

REM Create output directory if it doesn't exist
if not exist dist mkdir dist

REM Get version from version.nut
for /f "tokens=3" %%i in ('findstr /C:"COOPETITION_VERSION =" src\version.nut') do set VERSION=%%i

echo Packaging Coopetition v%VERSION%...

REM Run quality gates
echo Running quality gates...
call npm run test
if errorlevel 1 (
    echo Quality gates failed!
    exit /b 1
)

REM Build all components
echo Building all components...
call npm run build:all
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

REM Create complete package with everything
echo Creating complete package...
powershell -Command "Compress-Archive -Path src,campaigns,workspaces,docs,build,LICENSE,README.md,package.json -DestinationPath dist\coopetition-complete-v%VERSION%.zip -Force"

echo.
echo Packages created:
echo   - dist\coopetition-v%VERSION%.zip: Core GameScript mod
echo   - dist\coopetition-content-v%VERSION%.zip: Campaign content only
echo   - dist\coopetition-tools-v%VERSION%.zip: Development tools
echo   - dist\coopetition-complete-v%VERSION%.zip: Everything combined
echo.
echo To install the mod, extract coopetition-v%VERSION%.zip to your OpenTTD game script directory in a 'coopetition' subfolder.