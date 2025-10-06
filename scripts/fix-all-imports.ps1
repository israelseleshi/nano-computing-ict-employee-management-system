# Fix all remaining import issues
Write-Host "Fixing all remaining imports..." -ForegroundColor Green

# Fix lib files
$libFiles = @(
    "src\lib\firebaseData.ts",
    "src\lib\firebaseDataConsolidated.ts", 
    "src\lib\firebaseAuth.ts",
    "src\lib\firebaseAdapter.ts",
    "src\lib\authService.ts"
)

foreach ($file in $libFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace "from '\./firebase'", "from '@lib/firebase/config'"
        $content = $content -replace "from '\./firebaseAuth'", "from '@lib/firebaseAuth'"
        $content = $content -replace "from '\./firebaseData'", "from '@lib/firebaseData'"
        $content = $content -replace "from '\./mockAuth'", "from '@lib/mockAuth'"
        $content = $content -replace "from '\./firebaseAdapter'", "from '@lib/firebaseAdapter'"
        $content = $content -replace "from '\./firebaseDataConsolidated'", "from '@lib/firebaseDataConsolidated'"
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Fixed: $file" -ForegroundColor Cyan
    }
}

# Fix mockData.ts
if (Test-Path "src\mockData.ts") {
    $content = Get-Content "src\mockData.ts" -Raw
    $content = $content -replace "from '\./types'", "from '@types'"
    Set-Content -Path "src\mockData.ts" -Value $content -NoNewline
    Write-Host "Fixed: src\mockData.ts" -ForegroundColor Cyan
}

# Fix old App.tsx if it exists
if (Test-Path "src\App.tsx") {
    $content = Get-Content "src\App.tsx" -Raw
    $content = $content -replace "from '\./lib/mockAuth'", "from '@lib/mockAuth'"
    $content = $content -replace "from '\./lib/authService'", "from '@lib/authService'"
    $content = $content -replace "from '\./lib/types'", "from '@types'"
    $content = $content -replace "from '\./lib/firebaseData'", "from '@lib/firebaseData'"
    $content = $content -replace "from '\./components/auth/Login'", "from '@features/auth/Login/Login'"
    $content = $content -replace "from '\./components/manager/", "from '@features/dashboard/manager/"
    $content = $content -replace "from '\./components/employee/", "from '@features/dashboard/employee/"
    $content = $content -replace "from '\./components/common/", "from '@components/common/"
    Set-Content -Path "src\App.tsx" -Value $content -NoNewline
    Write-Host "Fixed: src\App.tsx" -ForegroundColor Cyan
}

Write-Host "All imports fixed!" -ForegroundColor Green
