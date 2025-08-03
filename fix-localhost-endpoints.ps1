# Fix all localhost:5000 references to use config
Write-Host "Fixing localhost:5000 references..." -ForegroundColor Green

# Files to update
$filesToUpdate = @(
    "client\src\Signup.jsx",
    "client\src\Profile.jsx",
    "client\src\Navbar.jsx",
    "client\src\Home.jsx",
    "client\src\Create.jsx",
    "client\src\components\UserProfile.jsx",
    "client\src\components\WishDetail.jsx",
    "client\src\components\ProfileEdit.jsx",
    "client\src\components\Leaderboard.jsx",
    "client\src\components\ChatWindow.jsx",
    "client\src\components\ChatList.jsx",
    "client\src\components\Discover\WishlistCard.jsx"
)

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $file -Raw
        
        # Replace localhost:5000 API calls
        $content = $content -replace "http://localhost:5000/api", "`${config.getApiUrl()}/api"
        
        # Replace localhost:5000 image URLs
        $content = $content -replace "http://localhost:5000`${", "`${config.getApiUrl()}`${"
        
        # Write back
        Set-Content $file $content -NoNewline
        Write-Host "  Updated $file" -ForegroundColor Green
    }
}

Write-Host "`nAll localhost references fixed!" -ForegroundColor Green 