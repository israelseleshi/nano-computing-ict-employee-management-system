# Fix all import paths in the features directory
Write-Host "Fixing import paths..." -ForegroundColor Green

# Define replacements
$replacements = @(
    @{
        Old = "from '../../lib/types'"
        New = "from '@types'"
    },
    @{
        Old = "from '../../lib/mockAuth'"
        New = "from '@services/api/mock.service'"
    },
    @{
        Old = "from './Dashboard'"
        New = "from '@components/manager/Dashboard'"
    },
    @{
        Old = "from './AddEmployee'"
        New = "from '@components/manager/AddEmployee'"
    },
    @{
        Old = "from './PayrollManagement'"
        New = "from '@features/payroll/PayrollList/PayrollManagement'"
    }
)

# Get all TypeScript/TSX files in features directory
$files = Get-ChildItem -Path "src\components\features" -Recurse -Include "*.tsx", "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.Old)) {
            $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "Import paths fixed!" -ForegroundColor Green
