@echo off
echo ========================================
echo Employee Features Setup Script
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
echo.

echo ========================================
echo Step 1: Setting up Employee Features
echo ========================================
echo Running employee features setup...
echo.

REM Run the employee features setup script
node setup-employee-features.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Employee features setup failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ Employee features setup completed!
echo.

echo ========================================
echo Step 2: Deploying Security Rules
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Firebase CLI is not installed
    echo Please install it with: npm install -g firebase-tools
    echo Then run: firebase login
    echo.
    echo Skipping rules deployment...
    goto :skip_rules
)

REM Check if user is logged in
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo You need to login to Firebase first.
    echo Running: firebase login
    firebase login
    if %errorlevel% neq 0 (
        echo WARNING: Firebase login failed
        echo Skipping rules deployment...
        goto :skip_rules
    )
)

echo Deploying enhanced Firestore rules...
firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo ✅ Rules deployed successfully!
) else (
    echo ❌ Rules deployment failed!
    echo You can deploy manually later with: npm run deploy-rules
)

:skip_rules
echo.

echo ========================================
echo Step 3: Deploying Performance Indexes
echo ========================================
echo.

if exist "firestore-employee-features.indexes.json" (
    echo Deploying performance indexes...
    firebase deploy --only firestore:indexes
    
    if %errorlevel% equ 0 (
        echo ✅ Indexes deployed successfully!
    ) else (
        echo ❌ Indexes deployment failed!
        echo You can deploy manually later with: npm run deploy-indexes
    )
) else (
    echo WARNING: Index file not found, skipping indexes deployment
)

echo.
echo ========================================
echo 🎉 Employee Features Setup Complete!
echo ========================================
echo.
echo ✅ Collections Created:
echo    - employeeProfiles ^(Enhanced profile management^)
echo    - leaveRequests ^(Leave request system^)
echo    - leaveBalances ^(Leave balance tracking^)
echo    - profileChangeLogs ^(Audit trail^)
echo.
echo ✅ Components Created:
echo    - ProfileManagement.tsx ^(Employee profile editor^)
echo    - LeaveManagement.tsx ^(Leave request system^)
echo.
echo ✅ Security Features:
echo    - Role-based access control
echo    - Employee data protection
echo    - Leave approval workflow
echo    - Profile change audit logging
echo.
echo ✅ Performance Features:
echo    - Optimized database indexes
echo    - Efficient query patterns
echo    - Fast data retrieval
echo.
echo 📋 Next Steps:
echo 1. Integrate components into your Employee Layout
echo 2. Add state management for new features
echo 3. Test profile management functionality
echo 4. Test leave request workflow
echo 5. Verify security rules in Firebase Console
echo.
echo 📖 Documentation:
echo - employee-features-setup.md ^(Complete setup guide^)
echo - dashboard-operations.md ^(Feature documentation^)
echo.

pause
