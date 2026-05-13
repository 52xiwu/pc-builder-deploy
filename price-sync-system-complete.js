/**
 * 硬件价格同步系统 - 完成部分
 */

// 续接上面的函数
function setupPriceSync() {
    console.log('🔄 设置价格同步...');
    
    // 价格同步管理器
    window.priceSyncManager = {
        // 同步间隔（毫秒）
        intervals: {
            quick: 300000,    // 5分钟（测试用）
            normal: 3600000,  // 1小时
            slow: 86400000    // 24小时
        },
        
        // 当前同步间隔
        currentInterval: 3600000,
        
        // 同步定时器
        syncTimer: null,
        
        // 开始同步
        start: function(intervalType = 'normal') {
            console.log('🚀 开始价格同步...');
            
            // 设置同步间隔
            this.currentInterval = this.intervals[intervalType] || this.intervals.normal;
            
            // 清除现有定时器
            if (this.syncTimer) {
                clearInterval(this.syncTimer);
            }
            
            // 立即执行一次同步
            this.executeSync();
            
            // 设置定时同步
            this.syncTimer = setInterval(() => {
                this.executeSync();
            }, this.currentInterval);
            
            console.log(`⏰ 价格同步已启动，间隔: ${this.formatInterval(this.currentInterval)}`);
            
            // 显示同步状态
            this.showSyncStatus();
        },
        
        // 执行同步
        executeSync: function() {
            console.log('🔄 执行价格同步...');
            
            // 更新同步状态
            window.priceDatabase.syncStatus.isSyncing = true;
            
            // 显示同步中状态
            this.showSyncingStatus();
            
            // 模拟API调用延迟
            setTimeout(() => {
                // 执行价格同步
                const success = window.priceDatabase.simulatePriceSync();
                
                if (success) {
                    console.log('✅ 价格同步成功');
                    this.showSyncSuccess();
                } else {
                    console.warn('⚠️ 价格同步失败');
                    this.showSyncError();
                }
                
                // 更新价格显示
                updateAllPriceDisplays();
                
            }, 1500); // 模拟1.5秒API延迟
        },
        
        // 停止同步
        stop: function() {
            if (this.syncTimer) {
                clearInterval(this.syncTimer);
                this.syncTimer = null;
                console.log('⏹️ 价格同步已停止');
                this.showSyncStopped();
            }
        },
        
        // 手动触发同步
        triggerSync: function() {
            console.log('🔄 手动触发价格同步');
            this.executeSync();
        },
        
        // 格式化时间间隔
        formatInterval: function(ms) {
            if (ms < 60000) {
                return `${Math.round(ms / 1000)}秒`;
            } else if (ms < 3600000) {
                return `${Math.round(ms / 60000)}分钟`;
            } else if (ms < 86400000) {
                return `${Math.round(ms / 3600000)}小时`;
            } else {
                return `${Math.round(ms / 86400000)}天`;
            }
        },
        
        // 显示同步状态
        showSyncStatus: function() {
            const status = window.priceDatabase.getSyncStatus();
            
            const statusDiv = document.createElement('div');
            statusDiv.id = 'priceSyncStatus';
            statusDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #8b5cf6;
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 0.8rem;
                z-index: 10020;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            
            statusDiv.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <div>
                    <div style="font-weight: 600;">价格同步中</div>
                    <div style="font-size: 0.7rem; opacity: 0.9;">上次同步: ${status.lastSync}</div>
                </div>
            `;
            
            document.body.appendChild(statusDiv);
        },
        
        // 显示同步中状态
        showSyncingStatus: function() {
            const statusDiv = document.getElementById('priceSyncStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <i class="fas fa-sync-alt fa-spin"></i>
                    <div>
                        <div style="font-weight: 600;">正在同步价格...</div>
                        <div style="font-size: 0.7rem; opacity: 0.9;">从淘宝/京东获取最新价格</div>
                    </div>
                `;
                statusDiv.style.background = '#f59e0b';
            }
        },
        
        // 显示同步成功
        showSyncSuccess: function() {
            const statusDiv = document.getElementById('priceSyncStatus');
            if (statusDiv) {
                const status = window.priceDatabase.getSyncStatus();
                
                statusDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <div style="font-weight: 600;">价格同步完成</div>
                        <div style="font-size: 0.7rem; opacity: 0.9;">${status.lastSync}</div>
                    </div>
                `;
                statusDiv.style.background = '#10b981';
                
                // 3秒后恢复原样
                setTimeout(() => {
                    this.showSyncStatus();
                }, 3000);
            }
        },
        
        // 显示同步错误
        showSyncError: function() {
            const statusDiv = document.getElementById('priceSyncStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <div style="font-weight: 600;">同步失败</div>
                        <div style="font-size: 0.7rem; opacity: 0.9;">将在下次重试</div>
                    </div>
                `;
                statusDiv.style.background = '#ef4444';
                
                // 5秒后恢复原样
                setTimeout(() => {
                    this.showSyncStatus();
                }, 5000);
            }
        },
        
        // 显示同步停止
        showSyncStopped: function() {
            const statusDiv = document.getElementById('priceSyncStatus');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <i class="fas fa-pause-circle"></i>
                    <div>
                        <div style="font-weight: 600;">价格同步已停止</div>
                        <div style="font-size: 0.7rem; opacity: 0.9;">点击手动同步</div>
                    </div>
                `;
                statusDiv.style.background = '#6b7280';
                statusDiv.style.cursor = 'pointer';
                
                statusDiv.addEventListener('click', () => {
                    this.triggerSync();
                });
            }
        },
        
        // 添加同步控制面板
        addSyncControlPanel: function() {
            console.log('🎛️ 添加同步控制面板...');
            
            const controlPanel = document.createElement('div');
            controlPanel.id = 'priceSyncControlPanel';
            controlPanel.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 10021;
                min-width: 250px;
                display: none;
            `;
            
            controlPanel.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-cogs"></i>
                    <span>价格同步设置</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 8px;">同步频率:</div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="syncInterval" value="quick" style="cursor: pointer;">
                            <span style="font-size: 0.9rem;">快速 (5分钟)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="syncInterval" value="normal" checked style="cursor: pointer;">
                            <span style="font-size: 0.9rem;">正常 (1小时)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="radio" name="syncInterval" value="slow" style="cursor: pointer;">
                            <span style="font-size: 0.9rem;">慢速 (24小时)</span>
                        </label>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="startSyncBtn" style="flex: 1; padding: 8px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-play"></i> 开始同步
                    </button>
                    <button id="stopSyncBtn" style="flex: 1; padding: 8px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-stop"></i> 停止同步
                    </button>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button id="manualSyncBtn" style="flex: 1; padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-sync"></i> 手动同步
                    </button>
                    <button id="closeControlPanel" style="flex: 1; padding: 8px; background: #e5e7eb; color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-times"></i> 关闭
                    </button>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #6b7280;">
                    <div>数据来源:</div>
                    <div>• 淘宝旗舰店</div>
                    <div>• 京东自营</div>
                    <div>• 拼多多百亿补贴</div>
                </div>
            `;
            
            document.body.appendChild(controlPanel);
            
            // 控制按钮
            const controlBtn = document.createElement('button');
            controlBtn.id = 'priceSyncControlBtn';
            controlBtn.innerHTML = '<i class="fas fa-sliders-h"></i>';
            controlBtn.title = '价格同步设置';
            controlBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                background: #8b5cf6;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10022;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(controlBtn);
            
            // 事件处理
            controlBtn.addEventListener('click', function() {
                controlPanel.style.display = controlPanel.style.display === 'block' ? 'none' : 'block';
                this.style.transform = 'rotate(90deg)';
                
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            });
            
            document.getElementById('closeControlPanel').addEventListener('click', function() {
                controlPanel.style.display = 'none';
            });
            
            document.getElementById('startSyncBtn').addEventListener('click', function() {
                const interval = document.querySelector('input[name="syncInterval"]:checked').value;
                window.priceSyncManager.start(interval);
                controlPanel.style.display = 'none';
                showControlFeedback('✅ 价格同步已启动');
            });
            
            document.getElementById('stopSyncBtn').addEventListener('click', function() {
                window.priceSyncManager.stop();
                controlPanel.style.display = 'none';
                showControlFeedback('⏹️ 价格同步已停止');
            });
            
            document.getElementById('manualSyncBtn').addEventListener('click', function() {
                window.priceSyncManager.triggerSync();
                controlPanel.style.display = 'none';
                showControlFeedback('🔄 手动同步已触发');
            });
            
            console.log('✅ 同步控制面板已添加');
        }
    };
    
    // 添加控制面板
    window.priceSyncManager.addSyncControlPanel();
    
    // 默认启动同步（正常频率）
    setTimeout(() => {
        window.priceSyncManager.start('normal');
    }, 3000);
    
    console.log('✅ 价格同步设置完成');
}

function showControlFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: #8b5cf6;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 10023;
        animation: control-feedback 2s ease-out forwards;
        font-size: 0.9rem;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

function addPriceDisplayOptimization() {
    console.log('💵 添加价格显示优化...');
    
    // 价格显示样式
    const priceStyle = document.createElement('style');
    priceStyle.textContent = `
        /* 价格显示优化 */
        .price-display {
            position: relative;
            display: inline-block;
        }
        
        /* 实时价格样式 */
        .real-time-price {
            font-weight: 700;
            color: #10b981;
            transition: all 0.3s ease;
            position: relative;
        }
        
        /* 价格更新动画 */
        .price-updating {
            animation: price-update-pulse 1s ease;
        }
        
        @keyframes price-update-pulse {
            0% { transform: scale(1); color: #10b981; }
            50% { transform: scale(1.1); color: #f59e0b; }
            100% { transform: scale(1); color: #10b981; }
        }
        
        /* 价格来源标签 */
        .price-source {
            display: inline-block;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 5px;
            vertical-align: middle;
        }
        
        .price-source.taobao {
            background: #ff4400;
            color: white;
        }
        
        .price-source.jd {
            background: #e31436;
            color: white;
        }
        
        .price-source.pinduoduo {
            background: #ee2c2c;
            color: white;
        }
        
        .price-source.average {
            background: #8b5cf6;
            color: white;
        }
        
        /* 价格对比标签 */
        .price-comparison {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
        }
        
        .price-lower {
            background: #10b981;
            color: white;
        }
        
        .price-higher {
            background: #ef4444;
            color: white;
        }
        
        .price-same {
            background: #6b7280;
            color: white;
        }
        
        /* 价格历史趋势 */
        .price-trend {
            display: inline-flex;
            align-items: center;
            margin-left: 5px;
            font-size: 0.8rem;
        }
        
        .price-trend.up {
            color: #ef4444;
        }
        
        .price-trend.down {
            color: #10b981;
        }
        
        .price-trend.stable {
            color: #6b7280;
        }
        
        /* 硬件价格卡片优化 */
        .hardware-price {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        
        .hardware-price .main-price {
            font-size: 1.1rem;
            font-weight: 700;
            color: #10b981;
        }
        
        .hardware-price .price-details {
            font-size: 0.8rem;
            color: #6b7280;
            margin-top: 2px;
        }
        
        /* 价格同步指示器 */
        .price-sync-indicator {
            display: