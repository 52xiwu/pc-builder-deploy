#!/bin/bash
# 修复硬件选择器启动脚本

echo "🔧 启动修复版电脑硬件销售网站（硬件选择器已修复）..."
echo "=" * 60

# 停止旧进程
pkill -f "http.server 8080" 2>/dev/null || true
sleep 1

# 检查文件
if [ ! -f "index.html" ]; then
    echo "❌ 找不到index.html"
    exit 1
fi

if [ ! -f "fix-hardware.js" ]; then
    echo "❌ 找不到fix-hardware.js"
    exit 1
fi

# 启动服务器
echo "🚀 启动HTTP服务器..."
python3 -m http.server 8080 > logs/hardware-fixed.log 2>&1 &
SERVER_PID=$!
sleep 3

if ! ps -p $SERVER_PID > /dev/null; then
    echo "❌ 服务器启动失败"
    echo "查看日志: tail -f logs/hardware-fixed.log"
    exit 1
fi

echo "✅ 服务器启动成功 (PID: $SERVER_PID)"

# 获取IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "🎉 修复版网站已启动！"
echo "=" * 60
echo "访问地址:"
echo "• http://localhost:8080"
echo "• http://$SERVER_IP:8080"
echo ""
echo "🔧 修复内容:"
echo "✅ 主板、内存、存储、散热、电源、机箱数据已修复"
echo "✅ 每个类别都有4个可选硬件项目"
echo "✅ 点击选择功能正常"
echo "✅ 价格计算实时更新"
echo "✅ 配置摘要自动显示"
echo ""
echo "📋 硬件类别列表:"
echo "1. CPU处理器 (4个项目)"
echo "2. 显卡 GPU (4个项目)"
echo "3. 主板 (4个项目)"
echo "4. 内存 (4个项目)"
echo "5. 存储 (4个项目)"
echo "6. 散热 (4个项目)"
echo "7. 电源 (4个项目)"
echo "8. 机箱 (4个项目)"
echo ""
echo "🧪 测试步骤:"
echo "1. 访问上面的网址"
echo "2. 点击'开始装机'或导航栏的'装机配置'"
echo "3. 点击不同的硬件标签（CPU、主板、内存等）"
echo "4. 每个标签下都应该看到4个硬件项目"
echo "5. 点击任意硬件项目进行选择"
echo "6. 查看右侧配置摘要是否更新"
echo "7. 查看总价是否计算正确"
echo ""
echo "💡 示例测试:"
echo "- 点击'主板'标签 → 应该看到4个主板选项"
echo "- 点击'内存'标签 → 应该看到4个内存选项"
echo "- 点击'存储'标签 → 应该看到4个SSD选项"
echo "- 点击任意硬件 → 右侧配置摘要更新"
echo "- 选择多个硬件 → 总价自动计算"
echo ""
echo "🛑 停止服务: pkill -f 'http.server 8080'"
echo "=" * 60
echo ""
echo "💬 如果仍有问题:"
echo "1. 刷新页面 (F5)"
echo "2. 清除浏览器缓存"
echo "3. 使用Chrome/Firefox浏览器"
echo "4. 检查控制台错误 (F12 → Console)"
echo ""
echo "服务运行中... (按 Ctrl+C 停止)"

# 等待用户中断
trap 'echo -e "\n🛑 停止服务..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM

wait