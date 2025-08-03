# Comprehensive script to fix ALL endpoints and image URLs
Write-Host "Fixing ALL endpoints and image URLs..." -ForegroundColor Green

# Files to update
$filesToUpdate = @(
    "client\src\Login.jsx",
    "client\src\Signup.jsx", 
    "client\src\Profile.jsx",
    "client\src\Wishlist.jsx",
    "client\src\Navbar.jsx",
    "client\src\Create.jsx",
    "client\src\Home.jsx",
    "client\src\components\WishDetail.jsx",
    "client\src\components\UserProfile.jsx",
    "client\src\components\ProfileEdit.jsx",
    "client\src\components\Leaderboard.jsx",
    "client\src\components\Discover\WishlistCard.jsx",
    "client\src\components\ChatList.jsx",
    "client\src\components\ChatWindow.jsx",
    "client\src\components\Chat.jsx"
)

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $file -Raw
        
        # Add config import if not already present
        if ($content -notmatch "import config from") {
            if ($content -match "import React") {
                $content = $content -replace "import React", "import React`nimport config from '../config'"
            } elseif ($content -match "import React from 'react'") {
                $content = $content -replace "import React from 'react'", "import React from 'react'`nimport config from '../config'"
            } else {
                # Add at the beginning if no React import found
                $content = "import config from '../config';`n`n" + $content
            }
        }
        
        # Replace ALL API endpoints
        $content = $content -replace "http://18\.209\.102\.221/api", "`${config.getApiUrl()}/api"
        
        # Replace image URLs (profile images, uploads, etc.)
        $content = $content -replace "http://18\.209\.102\.221`${", "`${config.getApiUrl()}`${"
        
        # Replace any remaining hardcoded IP addresses
        $content = $content -replace "http://18\.209\.102\.221", "`${config.getApiUrl()}"
        
        # Write back
        Set-Content $file $content -NoNewline
        Write-Host "  Updated $file" -ForegroundColor Green
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nAll files updated successfully!" -ForegroundColor Green
Write-Host "Now you can use:" -ForegroundColor Cyan
Write-Host "  - switch-to-local.bat (for local development)" -ForegroundColor White
Write-Host "  - switch-to-production.bat (for AWS deployment)" -ForegroundColor White 