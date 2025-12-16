@echo off
REM Script de lancement pour deploy.ps1
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
pause

