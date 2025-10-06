# Reorganize existing files to new structure
Write-Host "Reorganizing existing files..." -ForegroundColor Green

# Move auth components
if (Test-Path "src\components\auth\Login.tsx") {
    Move-Item -Path "src\components\auth\Login.tsx" -Destination "src\components\features\auth\Login\Login.tsx" -Force
    Write-Host "Moved Login component" -ForegroundColor Cyan
}

# Move manager dashboard components
$managerComponents = @{
    "src\components\manager\OverviewTab.tsx" = "src\components\features\dashboard\manager\Overview\OverviewTab.tsx"
    "src\components\manager\OperationsTab.tsx" = "src\components\features\dashboard\manager\Operations\OperationsTab.tsx"
    "src\components\manager\HRFinanceTab.tsx" = "src\components\features\dashboard\manager\HRFinance\HRFinanceTab.tsx"
    "src\components\manager\IntelligenceTab.tsx" = "src\components\features\dashboard\manager\Intelligence\IntelligenceTab.tsx"
    "src\components\manager\TicketManagement.tsx" = "src\components\features\tickets\TicketList\TicketManagement.tsx"
    "src\components\manager\TimeTracking.tsx" = "src\components\features\dashboard\manager\Operations\TimeTracking.tsx"
    "src\components\manager\LeaveManagement.tsx" = "src\components\features\leave\LeaveRequest\LeaveManagement.tsx"
    "src\components\manager\PayrollManagement.tsx" = "src\components\features\payroll\PayrollList\PayrollManagement.tsx"
    "src\components\manager\NotificationCenter.tsx" = "src\components\features\dashboard\manager\Overview\NotificationCenter.tsx"
    "src\components\manager\AdvancedReports.tsx" = "src\components\features\dashboard\manager\Intelligence\AdvancedReports.tsx"
    "src\components\manager\PerformanceAnalytics.tsx" = "src\components\features\dashboard\manager\Intelligence\PerformanceAnalytics.tsx"
}

foreach ($source in $managerComponents.Keys) {
    if (Test-Path $source) {
        $destination = $managerComponents[$source]
        $destDir = Split-Path -Parent $destination
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "Moved: $(Split-Path -Leaf $source)" -ForegroundColor Cyan
    }
}

# Move employee components
$employeeComponents = @{
    "src\components\employee\EmployeeLayout.tsx" = "src\components\features\dashboard\employee\Dashboard\EmployeeLayout.tsx"
    "src\components\employee\EmployeeDashboard.tsx" = "src\components\features\dashboard\employee\Dashboard\EmployeeDashboard.tsx"
    "src\components\employee\EmployeeProfile.tsx" = "src\components\features\dashboard\employee\Profile\EmployeeProfile.tsx"
    "src\components\employee\EmployeeLeaveManagement.tsx" = "src\components\features\dashboard\employee\LeaveManagement\EmployeeLeaveManagement.tsx"
    "src\components\employee\EmployeeGoals.tsx" = "src\components\features\dashboard\employee\Goals\EmployeeGoals.tsx"
}

foreach ($source in $employeeComponents.Keys) {
    if (Test-Path $source) {
        $destination = $employeeComponents[$source]
        $destDir = Split-Path -Parent $destination
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "Moved: $(Split-Path -Leaf $source)" -ForegroundColor Cyan
    }
}

# Move common components
$commonComponents = @{
    "src\components\common\Header.tsx" = "src\components\common\Header\Header.tsx"
    "src\components\common\Sidebar.tsx" = "src\components\common\Sidebar\Sidebar.tsx"
}

foreach ($source in $commonComponents.Keys) {
    if (Test-Path $source) {
        $destination = $commonComponents[$source]
        $destDir = Split-Path -Parent $destination
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Move-Item -Path $source -Destination $destination -Force
        Write-Host "Moved: $(Split-Path -Leaf $source)" -ForegroundColor Cyan
    }
}

# Move lib files to appropriate locations
$libFiles = @{
    "src\lib\firebase.ts" = "src\lib\firebase\config.ts"
    "src\lib\firebaseAuth.ts" = "src\services\firebase\auth.service.ts"
    "src\lib\firebaseData.ts" = "src\services\firebase\db.service.ts"
    "src\lib\firebaseDataConsolidated.ts" = "src\services\firebase\consolidated.service.ts"
    "src\lib\authService.ts" = "src\services\api\auth.service.ts"
    "src\lib\mockAuth.ts" = "src\services\api\mock.service.ts"
    "src\lib\types.ts" = "src\types\index.ts"
}

foreach ($source in $libFiles.Keys) {
    if (Test-Path $source) {
        $destination = $libFiles[$source]
        $destDir = Split-Path -Parent $destination
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Copy-Item -Path $source -Destination $destination -Force
        Write-Host "Copied: $(Split-Path -Leaf $source) to new location" -ForegroundColor Cyan
    }
}

# Move App.tsx to app folder
if (Test-Path "src\App.tsx") {
    Copy-Item -Path "src\App.tsx" -Destination "src\app\App.tsx" -Force
    Write-Host "Copied App.tsx to app folder" -ForegroundColor Cyan
}

# Move styles
if (Test-Path "src\index.css") {
    Copy-Item -Path "src\index.css" -Destination "src\styles\globals.css" -Force
    Write-Host "Copied index.css to styles/globals.css" -ForegroundColor Cyan
}

Write-Host "File reorganization completed!" -ForegroundColor Green
