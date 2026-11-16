# index.html / style.css / script.js を1つのHTMLにまとめて
# shosa-kanri-standalone.html を生成するスクリプト
# 使い方: このフォルダで  pwsh ./build-standalone.ps1

$ErrorActionPreference = 'Stop'
$dir = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

$html = [IO.File]::ReadAllText((Join-Path $dir 'index.html'), $utf8)
$css  = [IO.File]::ReadAllText((Join-Path $dir 'style.css'),  $utf8)
$js   = [IO.File]::ReadAllText((Join-Path $dir 'script.js'),  $utf8)

$linkTag   = '<link rel="stylesheet" href="style.css">'
$scriptTag = '<script src="script.js"></script>'

if (-not $html.Contains($linkTag))   { throw "index.html に $linkTag が見つかりません" }
if (-not $html.Contains($scriptTag)) { throw "index.html に $scriptTag が見つかりません" }
if ($js -match '</script') { throw 'script.js に </script が含まれているためインライン化できません' }

$out = $html.Replace($linkTag, "<style>`n$css`n</style>").Replace($scriptTag, "<script>`n$js`n</script>")

$outPath = Join-Path $dir 'shosa-kanri-standalone.html'
[IO.File]::WriteAllText($outPath, $out, $utf8)
Write-Host "生成しました: $outPath ($((Get-Item $outPath).Length) bytes)"
