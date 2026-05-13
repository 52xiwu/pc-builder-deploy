#!/bin/bash

# 创建图标生成脚本
echo "创建极客装机PWA图标..."

# 创建临时SVG图标
cat > /tmp/icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0f172a"/>
  <g transform="translate(100, 100) scale(0.8)">
    <!-- 电脑轮廓 -->
    <rect x="50" y="50" width="300" height="200" rx="20" fill="#1e293b" stroke="#3b82f6" stroke-width="8"/>
    
    <!-- 屏幕 -->
    <rect x="70" y="70" width="260" height="140" rx="10" fill="#0f172a"/>
    
    <!-- 芯片图案 -->
    <rect x="120" y="100" width="40" height="40" rx="5" fill="#3b82f6"/>
    <rect x="180" y="100" width="40" height="40" rx="5" fill="#10b981"/>
    <rect x="120" y="160" width="40" height="40" rx="5" fill="#f59e0b"/>
    <rect x="180" y="160" width="40" height="40" rx="5" fill="#ef4444"/>
    
    <!-- 连接线 -->
    <line x1="160" y1="100" x2="160" y2="160" stroke="#64748b" stroke-width="3"/>
    <line x1="220" y1="100" x2="220" y2="160" stroke="#64748b" stroke-width="3"/>
    <line x1="120" y1="140" x2="180" y2="140" stroke="#64748b" stroke-width="3"/>
    <line x1="120" y1="200" x2="180" y2="200" stroke="#64748b" stroke-width="3"/>
    
    <!-- 底座 -->
    <rect x="150" y="250" width="100" height="20" rx="5" fill="#334155"/>
    <rect x="170" y="270" width="60" height="10" rx="3" fill="#475569"/>
  </g>
  
  <!-- 文字 -->
  <text x="256" y="450" text-anchor="middle" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="40" font-weight="bold">PC</text>
</svg>
EOF

# 安装依赖（如果未安装）
if ! command -v convert &> /dev/null; then
    echo "安装ImageMagick..."
    apt-get update && apt-get install -y imagemagick
fi

# 生成各种尺寸的图标
sizes=(72 96 128 144 152 192 384 512)
for size in "${sizes[@]}"; do
    convert -background none -size "${size}x${size}" /tmp/icon.svg "/var/www/pc-builder/icons/icon-${size}x${size}.png"
    echo "生成 icon-${size}x${size}.png"
done

# 生成快捷方式图标
convert -background '#3b82f6' -size "192x192" -fill white -font Arial -pointsize 80 -gravity center label:"🛠️" /var/www/pc-builder/icons/tools-192x192.png
convert -background '#10b981' -size "192x192" -fill white -font Arial -pointsize 80 -gravity center label:"🛒" /var/www/pc-builder/icons/shop-192x192.png
convert -background '#f59e0b' -size "72x72" -fill white -font Arial -pointsize 40 -gravity center label:"📱" /var/www/pc-builder/icons/badge-72x72.png

echo "图标生成完成！"
echo "图标保存在: /var/www/pc-builder/icons/"