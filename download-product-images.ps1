# 从免费图源下载硬件商品图到 icons/products/
$base = "C:\Users\Administrator\Downloads\pc-builder\icons\products"
$ErrorActionPreference = "Continue"

# 分类 -> 图片URL (Unsplash download 或 直接链接)
$sources = @{
    cpu = "https://negativespace.co/wp-content/uploads/2023/01/negative-space-motherboard-cpu-socket-02.jpg"
    gpu = "https://unsplash.com/photos/PpcP7wmm5lQ/download?w=600"
    motherboard = "https://negativespace.co/wp-content/uploads/2023/01/negative-space-motherboard-cpu-socket-02.jpg"
    ram = "https://unsplash.com/photos/5tLfQGURzHM/download?w=600"
    storage = "https://unsplash.com/photos/3pET4l-8Ut0/download?w=600"
    cooling = "https://unsplash.com/photos/ltzme6y7WSc/download?w=600"
    psu = "https://unsplash.com/photos/E2aPGg02QdI/download?w=600"
    case = "https://unsplash.com/photos/BDNeeN0tcwQ/download?w=600"
    monitor = "https://unsplash.com/photos/xA26xebY3dw/download?w=600"
    keyboard = "https://unsplash.com/photos/8X1e9pde0yU/download?w=600"
    mouse = "https://unsplash.com/photos/9QaXPuOPi2M/download?w=600"
    headset = "https://unsplash.com/photos/Z1BBqeQ_2uM/download?w=600"
}

# 分类 -> 商品ID列表
$categoryIds = @{
    cpu = @('cpu0','cpu0a','cpu0b','cpu0c','cpu1','cpu2','cpu2b','cpu3','cpu4','cpu5','cpu6','cpu7','cpu8')
    gpu = @('gpu0','gpu0a','gpu0b','gpu0c','gpu1','gpu2','gpu3','gpu3a','gpu4','gpu5','gpu6','gpu7','gpu8')
    motherboard = @('mb0','mb0a','mb1','mb2','mb2a','mb3','mb4','mb5','mb6','mb7','mb8')
    ram = @('ram0','ram0a','ram1','ram2','ram3','ram4','ram5','ram6','ram7','ram8')
    storage = @('ssd0','ssd0a','ssd1','ssd2','ssd2a','ssd3','ssd4','ssd5','ssd6','ssd7')
    cooling = @('cool0','cool0a','cool1','cool2','cool3','cool4','cool5','cool6','cool7')
    psu = @('psu0','psu0a','psu1','psu2','psu3','psu4','psu5','psu6','psu7')
    case = @('case0','case0a','case1','case2','case3','case4','case5','case6','case7')
    monitor = @('mon0','mon0a','mon0b','mon1','mon2','mon3','mon4','mon5','mon6','mon7')
    keyboard = @('kb0','kb0a','kb1','kb2','kb3','kb4','kb5')
    mouse = @('mouse0','mouse0a','mouse1','mouse2','mouse3','mouse4','mouse5')
    headset = @('hs0','hs0a','hs1','hs2','hs3','hs4','hs5')
}

foreach ($cat in $sources.Keys) {
    $url = $sources[$cat]
    $ids = $categoryIds[$cat]
    if (-not $ids) { continue }
    $temp = Join-Path $env:TEMP "pcb-$cat.jpg"
    try {
        Write-Host "Downloading $cat..."
        $headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        Invoke-WebRequest -Uri $url -OutFile $temp -UseBasicParsing -MaximumRedirection 5 -Headers $headers
        if (Test-Path $temp) {
            foreach ($id in $ids) {
                $dest = Join-Path $base "$id.jpg"
                Copy-Item $temp $dest -Force
            }
            Write-Host "  -> $($ids.Count) files for $cat"
        }
    } catch {
        Write-Host "  Error: $_"
    }
    if (Test-Path $temp) { Remove-Item $temp -ErrorAction SilentlyContinue }
}
Write-Host "Done."
