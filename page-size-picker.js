/**
 * 每页条数选择器 - 向上弹出浮层
 * 功能：开/关浮层、键盘导航、选中后回调
 */

(function () {
    const SIZES = [6, 12, 24];

    // ── DOM 引用 ──────────────────────────────────────
    const trigger     = document.getElementById('pageSizeTrigger');
    const panel       = document.getElementById('pageSizePanel');
    const backdrop    = document.getElementById('pageSizeBackdrop');
    const triggerVal  = document.getElementById('triggerValue');
    const options     = Array.from(panel.querySelectorAll('.page-size-option'));

    let isOpen   = false;
    let focusedIdx = SIZES.indexOf(parseInt(triggerVal.textContent));

    // ── 核心函数 ──────────────────────────────────────

    function open() {
        isOpen = true;
        panel.classList.add('open');
        backdrop.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        // 聚焦当前项
        options.forEach(o => o.classList.remove('focused'));
        options[focusedIdx] && options[focusedIdx].classList.add('focused');
    }

    function close() {
        isOpen = false;
        panel.classList.remove('open');
        backdrop.classList.remove('show');
        trigger.setAttribute('aria-expanded', 'false');
        options.forEach(o => o.classList.remove('focused'));
    }

    function select(size, idx) {
        const num = parseInt(size);
        triggerVal.textContent = num;

        // 更新选项状态
        options.forEach((o, i) => {
            const active = i === idx;
            o.classList.toggle('active', active);
            o.setAttribute('aria-selected', String(active));
        });

        focusedIdx = idx;
        close();

        // 触发回调（供父组件使用）
        if (typeof window.onPageSizeChange === 'function') {
            window.onPageSizeChange(num);
        }

        // 抛出自定义事件（解耦）
        document.dispatchEvent(new CustomEvent('page-size-changed', {
            detail: { pageSize: num }
        }));
    }

    // ── 事件绑定 ──────────────────────────────────────

    // 点击触发器
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? close() : open();
    });

    // 点击遮罩关闭
    backdrop.addEventListener('click', close);

    // 点击浮层内部不关闭
    panel.addEventListener('click', (e) => e.stopPropagation());

    // 点击选项
    options.forEach((opt, idx) => {
        opt.addEventListener('click', () => select(opt.dataset.size, idx));
    });

    // ── 键盘导航 ─────────────────────────────────────

    function getFocusable() {
        return options.filter(o => !o.disabled);
    }

    trigger.addEventListener('keydown', (e) => {
        if (!isOpen) {
            // 浮层关闭时：回车或空格打开
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
            return;
        }

        const focusable = getFocusable();
        let idx = focusable.indexOf(document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                idx = idx < focusable.length - 1 ? idx + 1 : 0;
                focusable[idx].classList.add('focused');
                focusable[idx === 0 ? focusable.length - 1 : idx - 1]?.classList.remove('focused');
                focusable[idx].focus();
                break;

            case 'ArrowUp':
                e.preventDefault();
                idx = idx > 0 ? idx - 1 : focusable.length - 1;
                focusable[idx].classList.add('focused');
                focusable[idx === focusable.length - 1 ? 0 : idx + 1]?.classList.remove('focused');
                focusable[idx].focus();
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                if (document.activeElement.classList.contains('page-size-option')) {
                    document.activeElement.click();
                }
                break;

            case 'Escape':
                e.preventDefault();
                close();
                trigger.focus();
                break;

            case 'Tab':
                close();
                break;
        }
    });

    // 浮层选项内键盘
    panel.addEventListener('keydown', (e) => {
        const focusable = getFocusable();
        let idx = focusable.indexOf(document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                idx = idx < focusable.length - 1 ? idx + 1 : 0;
                focusable[idx].focus();
                break;

            case 'ArrowUp':
                e.preventDefault();
                idx = idx > 0 ? idx - 1 : focusable.length - 1;
                focusable[idx].focus();
                break;

            case 'Escape':
                e.preventDefault();
                close();
                trigger.focus();
                break;
        }
    });

})();
