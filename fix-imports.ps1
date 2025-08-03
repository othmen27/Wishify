# Fix malformed import statements
Write-Host "Fixing malformed import statements..." -ForegroundColor Green

# Get all JSX files
$jsxFiles = Get-ChildItem -Path "client\src" -Filter "*.jsx" -Recurse

foreach ($file in $jsxFiles) {
    Write-Host "Checking $($file.Name)..." -ForegroundColor Yellow
    
    # Read current content
    $content = Get-Content $file.FullName -Raw
    
    # Fix malformed imports
    if ($content -match "import config from '../config',") {
        Write-Host "  Fixing malformed import in $($file.Name)" -ForegroundColor Red
        
        # Fix the import statement
        $content = $content -replace "import config from '../config', {", "import config from './config';`nimport {"
        
        # Write back
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  Fixed $($file.Name)" -ForegroundColor Green
    } elseif ($content -match "import config from '../config';") {
        Write-Host "  Fixing config path in $($file.Name)" -ForegroundColor Red
        
        # Fix the config path
        $content = $content -replace "import config from '../config';", "import config from './config';"
        
        # Write back
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  Fixed $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  No issues found" -ForegroundColor Green
    }
}

Write-Host "All import statements fixed!" -ForegroundColor Green 