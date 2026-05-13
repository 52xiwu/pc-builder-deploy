#!/bin/bash
# 启动混合方案系统：价格API服务 + 网站

echo "🚀 启动PC硬件价格混合方案系统..."
echo "=========================================="

# 检查Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python3"
    exit 1
fi

# 检查依赖
echo "🔧 检查Python依赖..."
pip3 install beautifulsoup4 requests --break-system-packages > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Python依赖检查完成"
else
    echo "⚠️  Python依赖安装可能有问题，但继续执行..."
fi

# 停止可能正在运行的服务
echo "🛑 停止可能正在运行的服务..."
pkill -f "price-api-server.py" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
sleep 2

# 启动价格API服务
echo "💰 启动价格API服务 (端口: 8081)..."
cd /var/www/pc-builder
nohup python3 price-api-server.py > /tmp/price-api.log 2>&1 &
API_PID=$!
sleep 3

# 检查API服务是否启动
if ps -p $API_PID > /dev/null; then
    echo "✅ 价格API服务已启动 (PID: $API_PID)"
    echo "📝 日志文件: /tmp/price-api.log"
else
    echo "❌ 价格API服务启动失败"
    echo "📋 查看日志: tail -f /tmp/price-api.log"
    exit 1
fi

# 启动网站服务器
echo "🌐 启动网站服务器 (端口: 8080)..."
if [ -f "server.js" ]; then
    nohup node server.js > /tmp/website.log 2>&1 &
    WEB_PID=$!
    sleep 2
    
    if ps -p $WEB_PID > /dev/null; then
        echo "✅ 网站服务器已启动 (PID: $WEB_PID)"
        echo "📝 日志文件: /tmp/website.log"
    else
        echo "❌ 网站服务器启动失败"
        echo "📋 查看日志: tail -f /tmp/website.log"
        kill $API_PID 2>/dev/null
        exit 1
    fi
else
    echo "⚠️  未找到server.js，使用Nginx服务现有网站"
    systemctl restart nginx > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Nginx已重启"
    fi
fi

# 显示状态
echo ""
echo "=========================================="
echo "🎉 混合方案系统启动完成！"
echo ""
echo "📊 服务状态:"
echo "  • 价格API服务: http://localhost:8081 (PID: $API_PID)"
echo "  • 网站服务: http://localhost:8080 (PID: ${WEB_PID:-Nginx})"
echo "  • 公网访问: https://82.156.44.180"
echo ""
echo "🔧 API端点:"
echo "  • GET /api/prices          - 获取所有价格"
echo "  • GET /api/prices/sync     - 同步所有价格"
echo "  • GET /api/prices/{id}     - 获取单个产品价格"
echo "  • GET /api/health          - 健康检查"
echo ""
echo "📋 监控命令:"
echo "  • 查看API日志: tail -f /tmp/price-api.log"
echo "  • 查看网站日志: tail -f /tmp/website.log"
echo "  • 停止所有服务: pkill -f \"price-api-server.py\"; pkill -f \"node server.js\""
echo ""
echo "🚀 现在打开浏览器访问: https://82.156.44.180"
echo "   查看左上角的'价格API'状态显示"
echo "=========================================="

# 保持脚本运行
echo ""
echo "按 Ctrl+C 停止所有服务..."
echo ""

# 捕获Ctrl+C
trap 'echo ""; echo "🛑 停止所有服务..."; kill $API_PID $WEB_PID 2>/dev/null; exit 0' INT

# 等待
wait