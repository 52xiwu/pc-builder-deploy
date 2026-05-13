#!/bin/bash
# 修复所有问题并启动完整版本

echo "🔧 修复电脑硬件销售网站问题..."
echo "=" * 60

# 1. 停止所有相关进程
echo "🛑 停止现有服务..."
pkill -f "http.server 8080" 2>/dev/null || true
pkill -f "http.server 8081" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true
sleep 1

# 2. 检查并修复HTML文件
echo "📝 修复HTML文件..."
if [ -f "index.html" ]; then
    # 确保加载了所有必要的JS文件
    if ! grep -q "api-service.js" index.html; then
        echo "⚠️ 缺少api-service.js，正在修复..."
        sed -i '/<script src="app.js"/i\    <script src="api-service.js"></script>' index.html
    fi
    
    if ! grep -q "app-enhanced.js" index.html; then
        echo "⚠️ 缺少app-enhanced.js，正在修复..."
        sed -i '/<script src="api-service.js"/a\    <script src="app-enhanced.js"></script>' index.html
    fi
    
    echo "✅ HTML文件修复完成"
else
    echo "❌ 找不到index.html"
    exit 1
fi

# 3. 创建完整的启动配置
echo "🚀 创建完整启动配置..."
cat > start-fixed.sh << 'EOF'
#!/bin/bash
# 修复版完整启动脚本

echo "🎯 启动修复版电脑硬件销售网站..."
echo "=" * 50

# 停止旧进程
pkill -f "http.server 8080" 2>/dev/null || true

# 启动服务器
python3 -m http.server 8080 > logs/fixed.log 2>&1 &
SERVER_PID=$!
sleep 2

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ 服务器启动成功 (PID: $SERVER_PID)"
    
    # 获取IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo "🎉 修复版网站已启动！"
    echo "=" * 50
    echo "访问地址:"
    echo "• http://localhost:8080"
    echo "• http://$SERVER_IP:8080"
    echo ""
    echo "🔧 修复内容:"
    echo "✅ 加载了所有必要的JavaScript文件"
    echo "✅ 启用了增强版应用逻辑"
    echo "✅ 修复了交互功能"
    echo "✅ 集成了API服务层"
    echo ""
    echo "📋 现在可用的功能:"
    echo "1. 完整的硬件选择配置器"
    echo "2. 实时价格计算"
    echo "3. 产品商城浏览和筛选"
    echo "4. 购物车功能（本地存储）"
    echo "5. 用户登录界面"
    echo "6. 装机指南"
    echo "7. OpenClaw集成链接"
    echo "8. 所有按钮交互修复"
    echo ""
    echo "💡 测试步骤:"
    echo "1. 访问上面的网址"
    echo "2. 点击'开始装机'按钮"
    echo "3. 选择硬件并查看价格变化"
    echo "4. 浏览产品商城"
    echo "5. 测试购物车功能"
    echo "6. 检查所有链接和按钮"
    echo ""
    echo "🛑 停止服务: pkill -f 'http.server 8080'"
    echo "=" * 50
    echo ""
    echo "服务运行中... (按 Ctrl+C 停止)"
    
    # 保持运行
    wait
else
    echo "❌ 服务器启动失败"
    exit 1
fi
EOF

chmod +x start-fixed.sh

# 4. 启动修复版
echo "🚀 启动修复版网站..."
./start-fixed.sh