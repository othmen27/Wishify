# Fix remaining localhost:5000 image URL references
Write-Host "Fixing remaining localhost:5000 image URLs..." -ForegroundColor Green

# Files that still have localhost:5000 image URLs
$filesToUpdate = @(
    "client\src\Profile.jsx",
    "client\src\Navbar.jsx",
    "client\src\components\WishDetail.jsx",
    "client\src\components\UserProfile.jsx",
    "client\src\components\ChatList.jsx",
    "client\src\components\ChatWindow.jsx",
    "client\src\components\Discover\WishlistCard.jsx"
)

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $file -Raw
        
        # Replace localhost:5000 image URLs with config
        $content = $content -replace "http://localhost:5000`${", "`${config.getApiUrl()}`${"
        
        # Write back
        Set-Content $file $content -NoNewline
        Write-Host "  Updated $file" -ForegroundColor Green
    }
}

Write-Host "`nAll remaining localhost references fixed!" -ForegroundColor Green 