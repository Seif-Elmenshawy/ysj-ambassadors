# Copy MainBranch images to Ambassador public folder
# Run this from the Ambassadors directory

$mainBranchImages = "..\MainBranch\src\images"
$publicDir = "client\public"

# Copy logo images
Copy-Item "$mainBranchImages\YSJ-Logo.png" "$publicDir\logo.png" -ErrorAction SilentlyContinue
Copy-Item "$mainBranchImages\Logo-rev.png" "$publicDir\logo-rev.png" -ErrorAction SilentlyContinue
Copy-Item "$mainBranchImages\half-circle.png" "$publicDir\half-circle.png" -ErrorAction SilentlyContinue

# Copy favicons
$faviconDir = "$mainBranchImages\favicon"
if (Test-Path $faviconDir) {
    Copy-Item "$faviconDir\*" "$publicDir\" -ErrorAction SilentlyContinue
}

Write-Host "Image copy complete. Update Header.tsx/Footer.tsx to use PNG imports."
