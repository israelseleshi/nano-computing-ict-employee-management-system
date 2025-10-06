# Create Professional Project Structure
Write-Host "Creating professional project structure..." -ForegroundColor Green

# Define all directories to create
$directories = @(
    # Core directories
    "src\app",
    "src\assets\images",
    "src\assets\fonts", 
    "src\assets\icons",
    
    # Components structure
    "src\components\features\auth\Login",
    "src\components\features\auth\Register",
    "src\components\features\auth\ForgotPassword",
    
    "src\components\features\dashboard\manager\Overview",
    "src\components\features\dashboard\manager\Operations",
    "src\components\features\dashboard\manager\HRFinance",
    "src\components\features\dashboard\manager\Intelligence",
    
    "src\components\features\dashboard\employee\Dashboard",
    "src\components\features\dashboard\employee\Profile",
    "src\components\features\dashboard\employee\LeaveManagement",
    "src\components\features\dashboard\employee\Goals",
    
    "src\components\features\leave\LeaveRequest",
    "src\components\features\leave\LeaveBalance",
    "src\components\features\leave\LeaveHistory",
    
    "src\components\features\payroll\PayrollList",
    "src\components\features\payroll\PayrollDetails",
    "src\components\features\payroll\PayrollReport",
    
    "src\components\features\tickets\TicketList",
    "src\components\features\tickets\TicketForm",
    "src\components\features\tickets\TicketDetails",
    
    "src\components\layouts\AuthLayout",
    "src\components\layouts\DashboardLayout",
    "src\components\layouts\PublicLayout",
    
    # Config and contexts
    "src\config",
    "src\contexts",
    "src\hooks",
    
    # Library structure
    "src\lib\firebase",
    "src\lib\utils",
    
    # Pages
    "src\pages",
    
    # Services
    "src\services\api",
    "src\services\firebase",
    
    # State management
    "src\store\slices",
    
    # Styles
    "src\styles\themes",
    
    # Types
    "src\types",
    
    # Scripts
    "scripts",
    
    # Tests
    "tests\unit",
    "tests\integration",
    "tests\e2e",
    
    # Documentation
    "docs",
    
    # GitHub
    ".github\workflows",
    ".github\ISSUE_TEMPLATE",
    
    # VS Code
    ".vscode"
)

# Create each directory
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "✓ Created: $dir" -ForegroundColor Cyan
    } else {
        Write-Host "• Exists: $dir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Directory structure created successfully!" -ForegroundColor Green
