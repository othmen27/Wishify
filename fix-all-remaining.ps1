# Fix ALL remaining localhost:5000 references
Write-Host "Fixing ALL remaining localhost:5000 references..." -ForegroundColor Green

# Get all JSX files recursively
$jsxFiles = Get-ChildItem -Path "client\src" -Filter "*.jsx" -Recurse

foreach ($file in $jsxFiles) {
    Write-Host "Checking $($file.Name)..." -ForegroundColor Yellow
    
    # Read current content
    $content = Get-Content $file.FullName -Raw
    
    # Check if file contains localhost:5000
    if ($content -match "localhost:5000") {
        Write-Host "  Found localhost:5000 in $($file.Name)" -ForegroundColor Red
        
        # Replace all localhost:5000 references
        $content = $content -replace "http://localhost:5000`${", "`${config.getApiUrl()}`${"
        $content = $content -replace "http://localhost:5000/api", "`${config.getApiUrl()}/api"
        $content = $content -replace "http://localhost:5000", "`${config.getApiUrl()}"
        
        # Write back
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  Fixed $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  No localhost:5000 found" -ForegroundColor Green
    }
}

Write-Host "All frontend files checked and fixed!" -ForegroundColor Green 