# Fix malformed React import statements
Write-Host "Fixing malformed React import statements..." -ForegroundColor Green

# Get all JSX files
$jsxFiles = Get-ChildItem -Path "client\src" -Filter "*.jsx" -Recurse

foreach ($file in $jsxFiles) {
    Write-Host "Checking $($file.Name)..." -ForegroundColor Yellow
    
    # Read current content
    $content = Get-Content $file.FullName -Raw
    
    # Fix malformed React import
    if ($content -match "^import React$") {
        Write-Host "  Fixing React import in $($file.Name)" -ForegroundColor Red
        
        # Fix the import statement
        $content = $content -replace "^import React$", "import React from 'react';"
        
        # Write back
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  Fixed $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  No issues found" -ForegroundColor Green
    }
}

Write-Host "All React import statements fixed!" -ForegroundColor Green 