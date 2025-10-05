@echo off
echo ========================================
echo Firebase Collections Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if firebase-admin is installed
npm list firebase-admin >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing firebase-admin...
    npm install firebase-admin
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install firebase-admin
        pause
        exit /b 1
    )
)

REM Check if service account key exists
if not exist "firebase-service-account-key.json" (
    echo.
    echo ERROR: firebase-service-account-key.json not found!
    echo.
    echo Please follow these steps:
    echo 1. Go to Firebase Console: https://console.firebase.google.com/
    echo 2. Select your project
    echo 3. Go to Project Settings ^(gear icon^) -^> Service Accounts
    echo 4. Click "Generate new private key"
    echo 5. Save the file as "firebase-service-account-key.json" in this folder
    echo.
    pause
    exit /b 1
)

echo Service account key found ✓
echo Running Firebase setup...
echo.

REM Run the setup script
node setup-firebase-collections.js

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Setup completed successfully! 🎉
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Deploy Firestore rules: firebase deploy --only firestore:rules
    echo 2. Set up user authentication with custom claims
    echo 3. Test your application
    echo.
) else (
    echo.
    echo ========================================
    echo Setup failed! ❌
    echo ========================================
    echo Please check the error messages above.
    echo.
)

pause
