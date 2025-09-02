@echo off
echo Starting the full stack project...

REM Set environment variables
set NODE_ENV=development
set PORT=5000

REM Try to run with tsx if available
echo Attempting to start with tsx...
call npx tsx server/index.ts

REM If tsx fails, try running with ts-node
IF %ERRORLEVEL% NEQ 0 (
    echo tsx failed, trying ts-node...
    call npx ts-node server/index.ts
)

REM If both fail, try running compiled JavaScript
IF %ERRORLEVEL% NEQ 0 (
    echo TypeScript runners failed, trying to run compiled JavaScript...
    node dist/index.js
)

pause