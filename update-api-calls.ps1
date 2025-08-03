# Update all API calls to use config system
$EC2_IP = "18.209.102.221"
$API_ENDPOINT = "http://$EC2_IP"

# Add config import to files that need it
$filesToUpdate = @(
    "client\src\Signup.jsx",
    "client\src\Login.jsx", 
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
        Write-Host "Updating $file..."
        
        # Read current content
        $content = Get-Content $file.FullName -Raw
        
        # Add config import if not already present
        if ($content -notmatch "import config from") {
            $content = $content -replace "import React", "import React`nimport config from '../config'"
            $content = $content -replace "import React from 'react'", "import React from 'react'`nimport config from '../config'"
        }
        
        # Replace API calls
        $content = $content -replace "http://$EC2_IP/api", "`${config.getApiUrl()}/api"
        
        # Replace image URLs (keep the path part)
        $content = $content -replace "http://$EC2_IP`${", "`${config.getApiUrl()}`${"
        
        # Write back
        Set-Content $file $content -NoNewline
    }
}

Write-Host "All files updated to use config system!"
Write-Host "Now you can use switch-to-local.bat or switch-to-production.bat to change environments." 