#!/bin/bash
# 启动扩展版电脑硬件销售网站（硬件种类全面）

echo "🌟 启动扩展版电脑硬件销售网站..."
echo "=" * 60

# 停止旧进程
pkill -f "http.server 8080" 2>/dev/null || true
sleep 1

# 检查文件
if [ ! -f "index.html" ]; then
    echo "❌ 找不到index.html"
    exit 1
fi

if [ ! -f "fix-hardware-expanded.js" ]; then
    echo "❌ 找不到扩展脚本"
    exit 1
fi

# 启动服务器
echo "🚀 启动HTTP服务器..."
python3 -m http.server 8080 > logs/expanded.log 2>&1 &
SERVER_PID=$!
sleep 3

if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ 服务器启动失败"
    echo "查看日志: tail -f logs/expanded.log"
    exit 1
fi

echo "✅ 服务器启动成功 (PID: $SERVER_PID)"

# 获取IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "🎉 扩展版网站已启动！"
echo "=" * 60
echo "访问地址:"
echo "• http://localhost:8080"
echo "• http://$SERVER_IP:8080"
echo ""
echo "📊 扩展内容统计:"
echo "✅ 硬件选择器: 64个硬件项目（每个类别8个）"
echo "✅ 产品商城: 40个精选产品"
echo "✅ 游戏电竞: 10个专业电竞产品"
echo "✅ 工作站: 10个专业创作产品"
echo "✅ 性价比: 10个高性价比产品"
echo "✅ RGB光效: 10个RGB灯光产品"
echo ""
echo "🔧 硬件选择器增强:"
echo "• CPU处理器: 8个选项（从旗舰到入门）"
echo "• 显卡 GPU: 8个选项（从RTX 4090到RTX 3050）"
echo "• 主板: 8个选项（Intel/AMD全系列）"
echo "• 内存: 8个选项（DDR5/DDR4全规格）"
echo "• 存储: 8个选项（NVMe/SATA全类型）"
echo "• 散热: 8个选项（水冷/风冷全覆盖）"
echo "• 电源: 8个选项（钛金到铜牌全等级）"
echo "• 机箱: 8个选项（全尺寸全风格）"
echo ""
echo "🛍️ 产品商城分类:"
echo "1. 全部 (40个产品)"
echo "2. 游戏电竞 (10个产品) - 专业电竞装备"
echo "3. 工作站 (10个产品) - 专业创作工具"
echo "4. 性价比 (10个产品) - 高性价比选择"
echo "5. RGB光效 (10个产品) - 炫酷灯光效果"
echo ""
echo "🎨 新增功能:"
echo "✅ 硬件类别标签（旗舰/中端/性价比/电竞）"
echo "✅ RGB标识（RGB产品特殊标记）"
echo "✅ 品牌和分类显示"
echo "✅ 筛选计数显示"
echo "✅ 动画效果增强"
echo "✅ 响应式优化"
echo ""
echo "🧪 测试步骤:"
echo "1. 访问上面的网址"
echo "2. 测试硬件选择器（点击不同标签查看8个选项）"
echo "3. 测试产品商城（点击不同筛选查看对应产品）"
echo "4. 查看硬件类别标签和RGB标识"
echo "5. 测试所有交互功能"
echo ""
echo "💡 重点测试:"
echo "- 点击'主板'标签 → 查看8个主板选项"
echo "- 点击'游戏电竞'筛选 → 查看10个电竞产品"
echo "- 点击'RGB光效'筛选 → 查看10个RGB产品"
echo "- 注意硬件上的类别标签（旗舰/中端等）"
echo "- 注意产品上的RGB标识"
echo ""
echo "🛑 停止服务: pkill -f 'http.server 8080'"
echo "=" * 60
echo ""
echo "🎯 扩展目标达成:"
echo "• 硬件种类全面覆盖"
echo "• 产品分类丰富多样"
echo "• 用户体验显著提升"
echo "• 网站专业性增强"
echo ""
echo "服务运行中... (按 Ctrl+C 停止)"

# 等待用户中断
trap 'echo -e "\n🛑 停止服务..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

wait