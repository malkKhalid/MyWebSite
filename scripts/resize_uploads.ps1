param(
  [string]$Manifest = "$PSScriptRoot\uploads_manifest.json",
  [string]$Uploads = "$PSScriptRoot\..\server\uploads",
  [string]$LogoOut = "$PSScriptRoot\..\public\logo.png"
)

Add-Type -AssemblyName System.Drawing

$entries = Get-Content $Manifest -Raw | ConvertFrom-Json
$processed = 0; $beforeTotal = 0; $afterTotal = 0

function Fix-Orientation([System.Drawing.Image]$img) {
  try {
    foreach ($p in $img.PropertyItems) {
      if ($p.Id -eq 0x0112 -and $p.Value.Length -ge 2) {
        $rot = [BitConverter]::ToUInt16($p.Value, 0)
        if ($rot -eq 3) { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        elseif ($rot -eq 6) { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        elseif ($rot -eq 8) { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
  } catch { }
}

foreach ($e in $entries) {
  if ($e.kind -eq 'pdf') { continue }
  $path = Join-Path $Uploads $e.file
  if (-not (Test-Path $path)) { Write-Host "MISSING: $($e.file)"; continue }

  $before = (Get-Item $path).Length
  $beforeTotal += $before
  $raw = [byte[]][System.IO.File]::ReadAllBytes($path)
  $ms = New-Object System.IO.MemoryStream(,$raw)
  $img = [System.Drawing.Image]::FromStream($ms)
  Fix-Orientation $img

  $w = $img.Width; $h = $img.Height
  $max = [int]$e.maxDim
  $scale = [Math]::Min(1.0, $max / [Math]::Max($w, $h))
  $nw = [Math]::Max(1, [int][Math]::Round($w * $scale))
  $nh = [Math]::Max(1, [int][Math]::Round($h * $scale))

  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  if ($e.kind -eq 'jpg') {
    $g.Clear([System.Drawing.Color]::White)
  }
  $g.DrawImage($img, 0, 0, $nw, $nh)
  $g.Dispose(); $img.Dispose(); $ms.Dispose()

  $tmp = $path + '.tmp'
  if ($e.kind -eq 'jpg') {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, ([long]$e.quality))
    $bmp.Save($tmp, $codec, $params)
  } else {
    $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  $bmp.Dispose()
  Move-Item -Force -LiteralPath $tmp -Destination $path

  $after = (Get-Item $path).Length
  $afterTotal += $after
  $processed++
  Write-Host ("{0} {1} -> {2} KB ({3}x{4})" -f $e.file, [int]($before/1KB), [int]($after/1KB), $nw, $nh)
}

# Favicon / header static logo
$logoEntry = $entries | Where-Object { $_.table -eq 'settings' -and $_.col -eq 'logoImage' } | Select-Object -First 1
if ($logoEntry) {
  Copy-Item -Force -LiteralPath (Join-Path $Uploads $logoEntry.file) -Destination $LogoOut
  Write-Host "logo -> $LogoOut"
}

Write-Host ("done: {0} images, {1:N1} MB -> {2:N1} MB" -f $processed, ($beforeTotal/1MB), ($afterTotal/1MB))
