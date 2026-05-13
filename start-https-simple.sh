#!/bin/bash
# 简单HTTPS启动脚本

echo "🔒 配置HTTPS访问..."
echo "=" * 60

# 停止所有服务
pkill -f "http.server" 2>/dev/null
pkill -f "python3.*8443" 2>/dev/null
sleep 2

# 创建SSL目录
SSL_DIR="/root/.openclaw/workspace/pc-builder-website/ssl"
mkdir -p "$SSL_DIR"
cd "$SSL_DIR"

# 生成证书
echo "🔐 生成SSL证书..."
openssl req -x509 -newkey rsa:2048 \
    -keyout server.key \
    -out server.crt \
    -days 365 \
    -nodes \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=PCBuilder/CN=82.156.44.180" \
    2>/dev/null

echo "✅ 证书生成完成"

# 创建简单的HTTPS服务器
cat > simple_https.py << 'EOF'
import http.server
import ssl
import os

# 切换到网站根目录
os.chdir('/root/.openclaw/workspace/pc-builder-website')

# 服务器配置
server_address = ('0.0.0.0', 8443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# SSL配置
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile='ssl/server.crt',
    keyfile='ssl/server.key',
    ssl_version=ssl.PROTOCOL_TLS
)

print("=" * 60)
print("🚀 HTTPS服务器已启动!")
print("=" * 60)
print("访问地址:")
print("• https://82.156.44.180:8443")
print("• https://localhost:8443")
print("")
print("⚠️  浏览器安全提示:")
print("1. 浏览器会显示'不安全'警告")
print("2. 点击'高级'")
print("3. 点击'继续前往82.156.44.180(不安全)'")
print("=" * 60)

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 服务器停止")
EOF

# 启动HTTPS服务器
echo "🚀 启动HTTPS服务器 (端口: 8443)..."
cd /root/.openclaw/workspace/pc-builder-website
python3 ssl/simple_https.py > logs/https.log 2>&1 &
HTTPS_PID=$!
sleep 5

if ps -p $HTTPS_PID > /dev/null; then
    echo "✅ HTTPS服务器启动成功 (PID: $HTTPS_PID)"
    
    # 测试连接
    echo ""
    echo "🧪 测试HTTPS连接..."
    sleep 2
    if curl -k -s -o /dev/null -w "HTTPS状态: %{http_code}\n" https://localhost:8443; then
        echo "✅ HTTPS连接测试成功"
    else
        echo "⚠️  HTTPS连接测试失败，但服务可能仍在启动中"
    fi
    
    echo ""
    echo "🎉 HTTPS配置完成!"
    echo "=" * 60
    echo "🔐 安全访问地址:"
    echo "• https://82.156.44.180:8443"
    echo ""
    echo "📋 使用说明:"
    echo "1. 在浏览器访问上面的地址"
    echo "2. 浏览器会显示安全警告（正常现象）"
    echo "3. 点击'高级' → '继续前往网站'"
    echo "4. 网站功能与HTTP版本完全相同"
    echo ""
    echo "🔧 管理命令:"
    echo "• 查看状态: ps aux | grep 'simple_https'"
    echo "• 查看日志: tail -f logs/https.log"
    echo "• 停止服务: pkill -f 'simple_https'"
    echo "• 重启服务: ./start-https-simple.sh"
    echo ""
    echo "📊 当前HTTP服务:"
    echo "• HTTP (8080): 已停止"
    echo "• HTTPS (8443): 运行中"
    echo "=" * 60
    
else
    echo "❌ HTTPS服务器启动失败"
    echo "尝试手动启动:"
    echo "cd /root/.openclaw/workspace/pc-builder-website"
    echo "python3 ssl/simple_https.py"
    exit 1
fi

echo ""
echo "HTTPS服务运行中..."