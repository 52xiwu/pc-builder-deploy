#!/bin/bash
# 电脑硬件销售网站启动脚本

echo "🖥️ 启动电脑硬件销售网站..."
echo "=" * 60

# 检查目录
if [ ! -f "index.html" ]; then
    echo "❌ 找不到index.html文件"
    exit 1
fi

# 清理可能存在的旧进程
pkill -f "http.server 8080" 2>/dev/null || true

# 检查端口
if lsof -i :8080 > /dev/null 2>&1; then
    echo "❌ 端口8080被占用，请先释放"
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 启动HTTP服务器
echo "🌐 启动HTTP服务器 (端口: 8080)..."
python3 -m http.server 8080 > logs/server.log 2>&1 &
SERVER_PID=$!
sleep 2

if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ HTTP服务器启动失败"
    echo "查看日志: tail -f logs/server.log"
    exit 1
fi

echo "✅ HTTP服务器已启动 (PID: $SERVER_PID)"

# 获取服务器IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "🎉 网站启动成功！"
echo "=" * 60
echo ""
echo "📱 访问方式:"
echo "   1. 本地访问: http://localhost:8080"
echo "   2. 网络访问: http://$SERVER_IP:8080"
echo ""
echo "🖥️ 网站功能:"
echo "   - 电脑硬件自选配置"
echo "   - 实时价格计算"
echo "   - 兼容性检查"
echo "   - 购物车功能"
echo "   - 预设配置方案"
echo ""
echo "🔧 技术栈:"
echo "   - HTML5 + CSS3 + JavaScript"
echo "   - 响应式设计"
echo "   - 现代UI界面"
echo ""
echo "📊 查看日志:"
echo "   tail -f logs/server.log"
echo ""
echo "🛑 停止服务:"
echo "   按 Ctrl+C 或运行: pkill -f 'http.server 8080'"
echo "=" * 60
echo ""
echo "💡 提示: 保持此终端窗口打开以运行服务"

# 等待用户中断
trap 'echo -e "\n🛑 停止服务..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

echo "服务运行中... (按 Ctrl+C 停止)"
wait