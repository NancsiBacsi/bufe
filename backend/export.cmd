@echo off
set IMAGE_NAME=bufe-backend:dev
set EXPORT_FILE=bufe-backend-dev.tar

echo.
echo Exporting Docker image "%IMAGE_NAME%" to "%EXPORT_FILE%"...
docker save -o "%EXPORT_FILE%" "%IMAGE_NAME%"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Export failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Export finished successfully: %EXPORT_FILE%
pause
