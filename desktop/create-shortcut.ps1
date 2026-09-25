# Creates a "Pixel Agents" shortcut on the Windows desktop that launches the
# desktop wrapper directly (no terminal window). Re-run after moving the repo.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$desktopDir = $PSScriptRoot
$electron = Join-Path $desktopDir 'node_modules\electron\dist\electron.exe'
if (-not (Test-Path $electron)) {
  throw "Electron not installed. Run 'npm install' in $desktopDir first."
}

# Windows shortcuts need an .ico; wrap the 128x128 PNG (PNG-in-ICO, Vista+).
$png = [System.IO.File]::ReadAllBytes((Join-Path $desktopDir '..\icon.png'))
$icoPath = Join-Path $desktopDir 'icon.ico'
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]1)        # ICONDIR
$bw.Write([byte]128); $bw.Write([byte]128); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)                              # planes, bpp
$bw.Write([uint32]$png.Length); $bw.Write([uint32]22)                    # size, offset
$bw.Write($png)
[System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())

$lnkPath = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Pixel Agents.lnk'
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut($lnkPath)
$lnk.TargetPath = $electron
$lnk.Arguments = '"' + $desktopDir + '"'
$lnk.WorkingDirectory = $desktopDir
$lnk.IconLocation = $icoPath
$lnk.Description = 'Pixel Agents'
$lnk.Save()
Write-Output "Shortcut created: $lnkPath"
