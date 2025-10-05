@echo off
echo ========================================
echo Firebase Rules Deployment Script
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI is not installed
    echo Please install it with: npm install -g firebase-tools
    echo Then run: firebase login
    pause
    exit /b 1
)

REM Check if firestore.rules exists
if not exist "firestore.rules" (
    echo ERROR: firestore.rules file not found!
    echo Please run the Firebase setup script first.
    pause
    exit /b 1
)

echo Firebase CLI found ✓
echo Firestore rules file found ✓
echo.

REM Check if user is logged in
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo You need to login to Firebase first.
    echo Running: firebase login
    firebase login
    if %errorlevel% neq 0 (
        echo ERROR: Firebase login failed
        pause
        exit /b 1
    )
)

echo Deploying Firestore rules...
echo.

REM Deploy the rules
firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Rules deployed successfully! 🎉
    echo ========================================
    echo.
    echo Your Firestore security rules are now active.
    echo You can view them in the Firebase Console.
    echo.
) else (
    echo.
    echo ========================================
    echo Rules deployment failed! ❌
    echo ========================================
    echo Please check the error messages above.
    echo Make sure you have the correct permissions.
    echo.
)

pause
