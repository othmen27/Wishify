# Update API Endpoint Script
# This script replaces all instances of localhost:5000 with your EC2 IP

$EC2_IP = "18.209.102.221"
$API_ENDPOINT = "http://$EC2_IP"

Write-Host "Updating API endpoints from localhost:5000 to $API_ENDPOINT" -ForegroundColor Green

# Get all JSX files
$files = Get-ChildItem -Path "client\src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    # Read file content
    $content = Get-Content $file.FullName -Raw
    
    # Replace localhost:5000 with EC2 IP
    $newContent = $content -replace "http://localhost:5000", $API_ENDPOINT
    
    # Write back to file
    Set-Content $file.FullName $newContent -NoNewline
    
    Write-Host "Updated: $($file.Name)" -ForegroundColor Green
}

Write-Host "All API endpoints updated!" -ForegroundColor Green
Write-Host "Now rebuild your React app with: cd client && npm run build" -ForegroundColor Cyan 