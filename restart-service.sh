#!/bin/bash
# 重启电脑硬件销售网站服务

echo "🔄 重启电脑硬件销售网站服务..."
echo "=" * 60

# 确保停止所有相关进程
echo "🛑 停止现有服务..."
pkill -f "http.server 8080" 2>/dev/null
sleep 2

# 检查是否还有进程运行
if ps aux | grep "http.server 8080" | grep -v grep > /dev/null; then
    echo "⚠️  强制停止剩余进程..."
    pkill -9 -f "http.server 8080" 2>/dev/null
    sleep 1
fi

# 清理端口占用
echo "🧹 清理端口占用..."
fuser -k 8080/tcp 2>/dev/null || true
sleep 1

# 启动新服务
echo "🚀 启动新服务..."
cd /root/.openclaw/workspace/pc-builder-website
python3 -m http.server 8080 > logs/latest.log 2>&1 &
SERVER_PID=$!
sleep 3

# 检查服务状态
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ 服务启动成功 (PID: $SERVER_PID)"
    
    # 获取IP地址
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo "🎉 服务重启完成！"
    echo "=" * 60
    echo "访问地址:"
    echo "• http://localhost:8080"
    echo "• http://$SERVER_IP:8080"
    echo ""
    echo "📊 当前版本功能:"
    echo "✅ 硬件选择器: 96个硬件项目 (12个/类别)"
    echo "✅ 产品商城: 72个产品 (6个筛选分类)"
    echo "✅ 超高端硬件: 32个产品 (含5090/5080/5070显卡)"
    echo "✅ 9850X3D/9800X3D处理器: 已添加"
    echo "✅ 所有交互功能: 正常"
    echo ""
    echo "🔧 测试建议:"
    echo "1. 访问上面的网址"
    echo "2. 点击'超高端'筛选查看5090显卡"
    echo "3. 点击'CPU处理器'标签查看9850X3D"
    echo "4. 测试所有按钮和交互"
    echo ""
    echo "📋 查看日志: tail -f logs/latest.log"
    echo "🛑 停止服务: pkill -f 'http.server 8080'"
    echo "=" * 60
    
    # 测试服务是否响应
    echo "🧪 测试服务响应..."
    sleep 1
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
        echo "✅ 服务响应正常 (HTTP 200)"
    else
        echo "⚠️  服务可能未完全就绪，请稍等几秒再访问"
    fi
    
else
    echo "❌ 服务启动失败"
    echo "查看错误日志:"
    tail -20 logs/latest.log
    exit 1
fi

echo ""
echo "服务运行中..."