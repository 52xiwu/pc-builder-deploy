#!/bin/bash
# HTTPS服务管理脚本

case "$1" in
    start)
        echo "🚀 启动HTTPS服务..."
        # 停止现有服务
        pkill -f "https_server_fixed" 2>/dev/null
        pkill -f "http.server 8080" 2>/dev/null
        sleep 2
        
        # 启动HTTPS
        cd /root/.openclaw/workspace/pc-builder-website
        nohup python3 ssl/https_server_fixed.py > logs/https-server.log 2>&1 &
        HTTPS_PID=$!
        sleep 3
        
        if ps -p $HTTPS_PID > /dev/null; then
            echo "✅ HTTPS服务启动成功 (PID: $HTTPS_PID)"
            echo "🔐 访问地址: https://82.156.44.180:8443"
        else
            echo "❌ HTTPS服务启动失败"
            tail -10 logs/https-server.log
        fi
        ;;
    
    stop)
        echo "🛑 停止HTTPS服务..."
        pkill -f "https_server_fixed" 2>/dev/null
        echo "✅ 服务已停止"
        ;;
    
    status)
        echo "📊 HTTPS服务状态:"
        if ps aux | grep "https_server_fixed" | grep -v grep > /dev/null; then
            echo "✅ 运行中"
            echo "🔐 访问地址: https://82.156.44.180:8443"
            echo "📁 日志文件: logs/https-server.log"
            
            # 测试连接
            echo ""
            echo "🧪 连接测试:"
            if curl -k -s -o /dev/null -w "状态码: %{http_code}\n" https://localhost:8443; then
                echo "✅ 连接正常"
            else
                echo "⚠️  连接失败"
            fi
        else
            echo "❌ 未运行"
        fi
        ;;
    
    restart)
        echo "🔄 重启HTTPS服务..."
        $0 stop
        sleep 2
        $0 start
        ;;
    
    logs)
        echo "📋 HTTPS服务日志:"
        tail -20 /root/.openclaw/workspace/pc-builder-website/logs/https-server.log
        ;;
    
    test)
        echo "🧪 测试HTTPS连接..."
        echo "测试地址: https://82.156.44.180:8443"
        echo ""
        echo "1. 快速测试:"
        curl -k -I https://localhost:8443 2>/dev/null | head -5
        echo ""
        echo "2. 详细测试:"
        curl -k -s -o /dev/null -w "
HTTP状态码: %{http_code}
SSL验证: %{ssl_verify_result}
响应时间: %{time_total}秒
下载速度: %{speed_download} B/s
" https://localhost:8443
        ;;
    
    help|*)
        echo "🔒 HTTPS服务管理脚本"
        echo "=" * 60
        echo "使用方法: ./manage-https.sh [命令]"
        echo ""
        echo "可用命令:"
        echo "  start    启动HTTPS服务 (端口: 8443)"
        echo "  stop     停止HTTPS服务"
        echo "  status   查看服务状态"
        echo "  restart  重启服务"
        echo "  logs     查看服务日志"
        echo "  test     测试HTTPS连接"
        echo "  help     显示帮助信息"
        echo ""
        echo "🔐 HTTPS访问地址:"
        echo "• https://82.156.44.180:8443"
        echo ""
        echo "⚠️  重要提示:"
        echo "由于使用自签名证书，浏览器会显示安全警告。"
        echo "请点击'高级' → '继续前往网站(不安全)'"
        echo "=" * 60
        ;;
esac