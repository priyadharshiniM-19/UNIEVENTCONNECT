@echo off
echo Starting UniRepo Full Stack Project...
echo.

REM Set environment variables
set NODE_ENV=development
set PORT=5000

echo Environment: %NODE_ENV%
echo Port: %PORT%
echo.

REM Try to run the full stack server
echo Running full stack server...
node full-stack-server.js

REM If the above fails, try to run the original project
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Full stack server failed to start. Trying original project...
  echo.
  
  REM Try to run with tsx
  echo Attempting to run with tsx...
  npx tsx server/index.ts
  
  REM If tsx fails, try ts-node
  if %ERRORLEVEL% NEQ 0 (
    echo.
    echo tsx failed. Trying ts-node...
    echo.
    npx ts-node server/index.ts
    
    REM If ts-node fails, try compiled js
    if %ERRORLEVEL% NEQ 0 (
      echo.
      echo ts-node failed. Trying compiled JavaScript...
      echo.
      node dist/index.js
      
      REM If all attempts fail
      if %ERRORLEVEL% NEQ 0 (
        echo.
        echo All attempts to start the project failed.
        echo Please check the project dependencies and configuration.
        echo.
      )
    )
  )
)

pause