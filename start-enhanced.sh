#!/bin/bash
# 电脑硬件销售网站 - 美化增强版启动脚本

echo "🎨 启动电脑硬件销售网站（美化增强版）..."
echo "=" * 60

# 检查目录
if [ ! -f "index.html" ]; then
    echo "❌ 找不到index.html文件"
    exit 1
fi

# 清理可能存在的旧进程
pkill -f "http.server 8081" 2>/dev/null || true

# 检查端口
if lsof -i :8081 > /dev/null 2>&1; then
    echo "❌ 端口8081被占用，请先释放"
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 启动HTTP服务器
echo "🎨 启动美化版HTTP服务器 (端口: 8081)..."
python3 -m http.server 8081 > logs/enhanced-server.log 2>&1 &
SERVER_PID=$!
sleep 2

if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ HTTP服务器启动失败"
    echo "查看日志: tail -f logs/enhanced-server.log"
    exit 1
fi

echo "✅ 美化版HTTP服务器已启动 (PID: $SERVER_PID)"

# 获取服务器IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "🎉 美化增强版网站启动成功！"
echo "=" * 60
echo ""
echo "✨ 新增美化功能："
echo "   - 粒子背景动画"
echo "   - 玻璃态卡片效果"
echo "   - 霓虹按钮和阴影"
echo "   - 硬件浮动动画"
echo "   - 统计数字动画"
echo "   - 视差滚动效果"
echo "   - 点击波纹效果"
echo "   - 工具提示动画"
echo ""
echo "📱 访问方式："
echo "   1. 本地访问: http://localhost:8081"
echo "   2. 网络访问: http://$SERVER_IP:8081"
echo ""
echo "🎨 设计特色："
echo "   - 深色科技主题"
echo "   - 渐变色彩方案"
echo "   - 流畅动画过渡"
echo "   - 响应式交互设计"
echo ""
echo "🔧 技术特性："
echo "   - CSS3动画和过渡"
echo "   - JavaScript交互效果"
echo "   - 粒子系统背景"
echo "   - 视差滚动效果"
echo ""
echo "📊 查看日志："
echo "   tail -f logs/enhanced-server.log"
echo ""
echo "🛑 停止服务："
echo "   按 Ctrl+C 或运行: pkill -f 'http.server 8081'"
echo "=" * 60
echo ""
echo "💡 提示："
echo "   - 原版网站仍在运行: http://localhost:8080"
echo "   - 美化版新增了动画和交互效果"
echo "   - 保持此终端窗口打开以运行服务"

# 等待用户中断
trap 'echo -e "\n🛑 停止服务..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

echo "服务运行中... (按 Ctrl+C 停止)"
wait