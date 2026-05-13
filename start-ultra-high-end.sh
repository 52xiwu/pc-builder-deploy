#!/bin/bash
# 启动超高端硬件版电脑硬件销售网站

echo "👑 启动超高端硬件版电脑硬件销售网站..."
echo "=" * 60

# 停止旧进程
pkill -f "http.server 8080" 2>/dev/null || true
sleep 1

# 检查文件
if [ ! -f "index.html" ]; then
    echo "❌ 找不到index.html"
    exit 1
fi

if [ ! -f "fix-ultra-high-end.js" ]; then
    echo "❌ 找不到超高端硬件脚本"
    exit 1
fi

# 启动服务器
echo "🚀 启动HTTP服务器..."
python3 -m http.server 8080 > logs/ultra-high-end.log 2>&1 &
SERVER_PID=$!
sleep 3

if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ 服务器启动失败"
    echo "查看日志: tail -f logs/ultra-high-end.log"
    exit 1
fi

echo "✅ 服务器启动成功 (PID: $SERVER_PID)"

# 获取IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "🎉 超高端硬件版网站已启动！"
echo "=" * 60
echo "访问地址:"
echo "• http://localhost:8080"
echo "• http://$SERVER_IP:8080"
echo ""
echo "💎 新增超高端硬件:"
echo "✅ NVIDIA RTX 5090 (¥19,999) - 32GB GDDR7 旗舰显卡"
echo "✅ NVIDIA RTX 5080 (¥12,999) - 20GB GDDR7 高端显卡"
echo "✅ NVIDIA RTX 5070 Ti (¥8,999) - 16GB GDDR7 高性能显卡"
echo "✅ NVIDIA RTX 5070 (¥6,999) - 12GB GDDR7 高端显卡"
echo "✅ AMD Ryzen 9 9850X3D (¥6,999) - 24核心/48线程 3D V-Cache"
echo "✅ AMD Ryzen 9 9800X3D (¥5,999) - 20核心/40线程 3D V-Cache"
echo "✅ Intel Core i9-15900KS (¥7,999) - 32核心/48线程"
echo "✅ AMD Threadripper PRO 7995WX (¥49,999) - 96核心/192线程"
echo ""
echo "📊 超高端硬件统计:"
echo "• 总产品数: 32个超高端硬件"
echo "• CPU处理器: 4个超高端选项"
echo "• 显卡: 6个超高端选项 (含5090/5080/5070系列)"
echo "• 主板: 4个超高端选项"
echo "• 内存: 4个超高端选项"
echo "• 存储: 4个超高端选项"
echo "• 散热: 4个超高端选项"
echo "• 电源: 4个超高端选项"
echo "• 机箱: 4个超高端选项"
echo ""
echo "🎯 扩展功能:"
echo "✅ 新增'超高端'筛选分类"
echo "✅ 超高端硬件特殊标识 (💎 徽章)"
echo "✅ 金色价格显示和动画效果"
echo "✅ 硬件选择器中的超高端标签"
echo "✅ 响应式优化和特殊样式"
echo ""
echo "🧪 测试步骤:"
echo "1. 访问上面的网址"
echo "2. 在产品商城点击'超高端'筛选按钮"
echo "3. 查看所有超高端硬件产品"
echo "4. 在硬件选择器中查看超高端选项"
echo "5. 注意💎徽章和特殊样式"
echo ""
echo "💡 重点测试:"
echo "- 点击'超高端'筛选 → 查看32个超高端产品"
echo "- 点击'显卡'标签 → 查看6个超高端显卡选项"
echo "- 点击'CPU处理器'标签 → 查看4个超高端CPU选项"
echo "- 注意超高端硬件的金色价格和💎徽章"
echo "- 测试超高端硬件的选择和价格计算"
echo ""
echo "🔧 硬件选择器现在包含:"
echo "• CPU处理器: 12个选项 (4个超高端 + 8个常规)"
echo "• 显卡: 14个选项 (6个超高端 + 8个常规)"
echo "• 主板: 12个选项 (4个超高端 + 8个常规)"
echo "• 内存: 12个选项 (4个超高端 + 8个常规)"
echo "• 存储: 12个选项 (4个超高端 + 8个常规)"
echo "• 散热: 12个选项 (4个超高端 + 8个常规)"
echo "• 电源: 12个选项 (4个超高端 + 8个常规)"
echo "• 机箱: 12个选项 (4个超高端 + 8个常规)"
echo ""
echo "🛑 停止服务: pkill -f 'http.server 8080'"
echo "=" * 60
echo ""
echo "🎉 扩展目标达成:"
echo "• 添加了您要求的5090/5080/5070显卡"
echo "• 添加了您要求的9850X3D/9800X3D处理器"
echo "• 硬件种类全面覆盖 (从入门到超旗舰)"
echo "• 产品分类丰富多样 (5个筛选分类)"
echo "• 用户体验专业级提升"
echo ""
echo "服务运行中... (按 Ctrl+C 停止)"

# 等待用户中断
trap 'echo -e "\n🛑 停止服务..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

wait