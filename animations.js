/**
 * 电脑硬件销售网站 - 动画和交互效果
 */

class WebsiteAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎨 初始化网站动画效果...');
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化动画
        this.initAnimations();
        
        // 初始化粒子背景
        this.initParticles();
        
        // 初始化滚动效果
        this.initScrollEffects();
        
        console.log('✅ 动画效果初始化完成');
    }
    
    bindEvents() {
        // 导航栏滚动效果
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // 硬件选择器交互
        document.querySelectorAll('.hardware-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.animateHardwareItem(e.target, 'enter');
            });
            
            item.addEventListener('mouseleave', (e) => {
                this.animateHardwareItem(e.target, 'leave');
            });
        });
        
        // 按钮点击效果
        document.querySelectorAll('.neon-btn, .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
        
        // 标签切换效果
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.animateTabSwitch(e.target);
            });
        });
        
        // 页面加载动画
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });
    }
    
    initAnimations() {
        // 添加CSS动画类
        this.addAnimationStyles();
        
        // 初始化硬件展示动画
        this.initHardwareShowcase();
        
        // 初始化统计数字动画
        this.initCounterAnimations();
    }
    
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 硬件展示动画 */
            @keyframes hardwareFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }
                50% {
                    transform: translateY(-20px) rotate(5deg);
                    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
                }
            }
            
            /* 霓虹脉冲动画 */
            @keyframes neonPulse {
                0%, 100% {
                    opacity: 1;
                    filter: drop-shadow(0 0 5px currentColor);
                }
                50% {
                    opacity: 0.8;
                    filter: drop-shadow(0 0 20px currentColor);
                }
            }
            
            /* 光晕效果 */
            @keyframes glow {
                0%, 100% {
                    box-shadow: 0 0 5px currentColor;
                }
                50% {
                    box-shadow: 0 0 20px currentColor;
                }
            }
            
            /* 加载动画 */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* 旋转动画 */
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            /* 波纹效果 */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* 页面加载动画 */
            .page-load-animation {
                animation: fadeInUp 0.6s ease-out forwards;
                opacity: 0;
            }
            
            /* 硬件卡片悬停效果 */
            .hardware-item:hover {
                animation: hardwareFloat 3s ease-in-out infinite;
            }
            
            /* 霓虹按钮效果 */
            .neon-btn {
                animation: neonPulse 2s infinite;
            }
            
            /* 统计数字动画 */
            .counter-animated {
                animation: fadeInUp 0.8s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    initParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-bg';
        document.body.prepend(particlesContainer);
        
        // 创建粒子
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
            `;
            
            // 添加粒子浮动动画
            const particleStyle = document.createElement('style');
            particleStyle.textContent = `
                @keyframes particleFloat {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                    }
                    50% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                    }
                    75% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(particleStyle);
            
            particlesContainer.appendChild(particle);
        }
    }
    
    initHardwareShowcase() {
        const showcase = document.querySelector('.pc-showcase');
        if (!showcase) return;
        
        const parts = showcase.querySelectorAll('.pc-part');
        parts.forEach((part, index) => {
            // 设置延迟动画
            part.style.animationDelay = `${index * 0.5}s`;
            
            // 添加点击效果
            part.addEventListener('click', () => {
                this.animateHardwareClick(part);
            });
        });
    }
    
    initCounterAnimations() {
        // 找到统计数字元素
        const counters = document.querySelectorAll('.stat-value, .hero-stats h3');
        counters.forEach(counter => {
            if (counter.textContent.match(/^\d/)) {
                this.animateCounter(counter);
            }
        });
    }
    
    initScrollEffects() {
        // 观察器用于滚动动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // 如果是统计数字，启动计数动画
                    if (entry.target.classList.contains('stat-value')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.hardware-item, .preset-card, .guide-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 视差滚动效果
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    animateHardwareItem(item, action) {
        if (action === 'enter') {
            item.style.transform = 'scale(1.05)';
            item.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
            item.style.zIndex = '10';
            
            // 显示工具提示
            const tooltip = item.dataset.tooltip;
            if (tooltip) {
                this.showTooltip(item, tooltip);
            }
        } else {
            item.style.transform = 'scale(1)';
            item.style.boxShadow = '';
            item.style.zIndex = '';
            
            // 隐藏工具提示
            this.hideTooltip();
        }
    }
    
    animateTabSwitch(tab) {
        // 移除所有active类
        document.querySelectorAll('.tab-btn').forEach(t => {
            t.classList.remove('active');
        });
        
        // 添加active类
        tab.classList.add('active');
        
        // 添加点击动画
        tab.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tab.style.transform = 'scale(1)';
        }, 150);
    }
    
    createRippleEffect(event) {
        const btn = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - btn.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - btn.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = btn.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        btn.appendChild(circle);
    }
    
    animatePageLoad() {
        // 添加页面加载动画
        document.body.classList.add('loaded');
        
        // 为元素添加延迟动画
        const elements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .pc-showcase');
        elements.forEach((el, index) => {
            el.classList.add('page-load-animation');
            el.style.animationDelay = `${index * 0.2}s`;
        });
        
        // 硬件卡片延迟显示
        const hardwareItems = document.querySelectorAll('.hardware-item');
        hardwareItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('page-load-animation');
        });
    }
    
    animateCounter(element) {
        if (element.classList.contains('counting')) return;
        
        element.classList.add('counting');
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2秒
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            
            // 格式化数字
            let display;
            if (target >= 1000) {
                display = Math.floor(current / 1000) + 'K+';
            } else {
                display = Math.floor(current);
            }
            
            element.textContent = element.textContent.replace(/\d+/, display);
        }, 16);
    }
    
    animateHardwareClick(part) {
        // 创建点击效果
        part.style.animation = 'none';
        part.style.transform = 'scale(1.3)';
        
        // 创建粒子爆炸效果
        this.createExplosion(part);
        
        setTimeout(() => {
            part.style.animation = '';
            part.style.transform = '';
        }, 300);
    }
    
    createExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                left: ${centerX}px;
                top: ${centerY}px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            // 随机方向
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 30;
            const duration = Math.random() * 500 + 500;
            
            const animation = particle.animate([
                {
                    transform: `translate(0, 0)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            animation.onfinish = () => {
                particle.remove();
            };
        }
    }
    
    showTooltip(element, text) {
        // 移除现有的工具提示
        this.hideTooltip();
        
        // 创建新的工具提示
        const tooltip = document.createElement('div');
        tooltip.className = 'hardware-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(15, 23, 42, 0.95);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
            transform: translateY(-100%);
            margin-top: -10px;
            border: 1px solid rgba(102, 126, 234, 0.3);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        `;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.transform = `translate(-50%, -100%)`;
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }
    
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
    
    // 添加视差滚动元素
    addParallaxEffect(selector, speed = 0.5) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('parallax');
            el.dataset.speed = speed;
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.websiteAnimations = new WebsiteAnimations();
    
    // 添加视差效果
    setTimeout(() => {
        if (window.websiteAnimations.addParallaxEffect) {
            window.websiteAnimations.addParallaxEffect('.hero-title', 0.3);
            window.websiteAnimations.addParallaxEffect('.hero-subtitle', 0.5);
            window.websiteAnimations.addParallaxEffect('.pc-showcase', 0.7);
        }
    }, 100);
});

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteAnimations;
}