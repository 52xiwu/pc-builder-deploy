#!/bin/bash
# 启动HTTPS版本的电脑硬件销售网站

echo "🔒 启动HTTPS版本的电脑硬件销售网站..."
echo "=" * 60

# 停止现有HTTP服务
echo "🛑 停止现有HTTP服务..."
pkill -f "http.server 8080" 2>/dev/null
pkill -f "ssl_server.py" 2>/dev/null
sleep 2

# 检查是否安装了openssl
if ! command -v openssl &> /dev/null; then
    echo "📦 安装OpenSSL..."
    apt-get update && apt-get install -y openssl
fi

# 生成自签名SSL证书（如果不存在）
CERT_DIR="/root/.openclaw/workspace/pc-builder-website/ssl"
mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/server.key" ] || [ ! -f "$CERT_DIR/server.crt" ]; then
    echo "🔐 生成自签名SSL证书..."
    openssl req -x509 -newkey rsa:4096 \
        -keyout "$CERT_DIR/server.key" \
        -out "$CERT_DIR/server.crt" \
        -days 365 \
        -nodes \
        -subj "/C=CN/ST=Beijing/L=Beijing/O=PCBuilder/CN=82.156.44.180" \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ SSL证书生成成功"
        echo "   • 私钥: $CERT_DIR/server.key"
        echo "   • 证书: $CERT_DIR/server.crt"
        echo "   • 有效期: 365天"
    else
        echo "❌ SSL证书生成失败"
        exit 1
    fi
else
    echo "✅ 使用现有SSL证书"
fi

# 创建Python HTTPS服务器脚本
echo "🐍 创建HTTPS服务器脚本..."
cat > "$CERT_DIR/ssl_server.py" << 'EOF'
#!/usr/bin/env python3
"""
HTTPS服务器 - 电脑硬件销售网站
"""
import http.server
import ssl
import os
import sys

# 配置
CERT_FILE = 'server.crt'
KEY_FILE = 'server.key'
PORT = 8443
BIND_IP = '0.0.0.0'

# 切换到网站目录
os.chdir('/root/.openclaw/workspace/pc-builder-website')

# 创建HTTPS服务器
httpd = http.server.HTTPServer((BIND_IP, PORT), http.server.SimpleHTTPRequestHandler)

# 包装为HTTPS
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"🚀 HTTPS服务器启动在 https://{BIND_IP}:{PORT}")
print(f"📁 服务目录: {os.getcwd()}")
print(f"🔐 SSL证书: {CERT_FILE}")
print(f"🔑 私钥文件: {KEY_FILE}")
print("=" * 60)
print("访问地址:")
print(f"• https://localhost:{PORT}")
print(f"• https://82.156.44.180:{PORT}")
print("=" * 60)
print("⚠️  注意: 这是自签名证书，浏览器会显示安全警告")
print("   点击'高级' → '继续前往网站(不安全)'即可访问")
print("=" * 60)

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 服务器停止")
    sys.exit(0)
EOF

chmod +x "$CERT_DIR/ssl_server.py"

# 启动HTTPS服务器
echo "🚀 启动HTTPS服务器 (端口: 8443)..."
cd "$CERT_DIR"
python3 ssl_server.py > ../logs/https.log 2>&1 &
HTTPS_PID=$!
sleep 5

if ps -p $HTTPS_PID > /dev/null; then
    echo "✅ HTTPS服务器启动成功 (PID: $HTTPS_PID)"
    
    # 同时启动HTTP重定向服务器（可选）
    echo "🔄 启动HTTP重定向服务器 (端口: 8080 → 8443)..."
    cd /root/.openclaw/workspace/pc-builder-website
    cat > redirect_server.py << 'EOF'
#!/usr/bin/env python3
"""
HTTP重定向服务器 - 将HTTP重定向到HTTPS
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

class RedirectHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 构建重定向URL
        redirect_url = f"https://82.156.44.180:8443{self.path}"
        self.send_response(301)
        self.send_header('Location', redirect_url)
        self.end_headers()
        self.wfile.write(b'Redirecting to HTTPS...')
    
    def log_message(self, format, *args):
        # 简化日志
        pass

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), RedirectHandler)
    print(f"🔄 HTTP重定向服务器启动在 http://0.0.0.0:8080")
    print("   所有HTTP请求将重定向到HTTPS")
    server.serve_forever()
EOF
    
    python3 redirect_server.py > logs/redirect.log 2>&1 &
    REDIRECT_PID=$!
    sleep 2
    
    echo ""
    echo "🎉 HTTPS配置完成！"
    echo "=" * 60
    echo "🔐 安全访问地址:"
    echo "• https://82.156.44.180:8443"
    echo ""
    echo "🔄 自动重定向:"
    echo "• http://82.156.44.180:8080 → 自动跳转到HTTPS"
    echo ""
    echo "📋 重要说明:"
    echo "1. 这是自签名证书，浏览器会显示安全警告"
    echo "2. 点击'高级' → '继续前往网站(不安全)'"
    echo "3. 或点击'接受风险并继续'"
    echo ""
    echo "🔧 测试命令:"
    echo "curl -k https://82.156.44.180:8443"
    echo ""
    echo "📊 服务状态:"
    echo "• HTTPS服务器: 运行中 (PID: $HTTPS_PID)"
    echo "• 重定向服务器: 运行中 (PID: $REDIRECT_PID)"
    echo "• 端口: 8443 (HTTPS), 8080 (HTTP重定向)"
    echo ""
    echo "📁 证书位置:"
    echo "• $CERT_DIR/server.crt"
    echo "• $CERT_DIR/server.key"
    echo ""
    echo "📋 查看日志:"
    echo "• HTTPS日志: tail -f logs/https.log"
    echo "• 重定向日志: tail -f logs/redirect.log"
    echo "=" * 60
    
else
    echo "❌ HTTPS服务器启动失败"
    echo "查看错误日志:"
    tail -20 logs/https.log
    exit 1
fi

echo ""
echo "服务运行中..."