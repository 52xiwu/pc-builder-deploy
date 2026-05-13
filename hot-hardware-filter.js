/**
 * hot-hardware-filter.js
 * ─────────────────────────────────────────────
 * 热门硬件推荐区块 · 筛选引擎
 * 纯原生 JS，无依赖，IIFE 避免污染全局命名空间
 * ─────────────────────────────────────────────
 * 暴露回调（2 选 1）：
 *   window.onHotHardwareFilterChange(filter)  — 切换筛选项时触发
 *
 * 卡片可附加多标签（如 data-filter="gaming rgb"），
 * 筛选时只要命中任意一个标签即展示（OR 逻辑）。
 * ─────────────────────────────────────────────
 */

;(function () {
    'use strict';

    /* ── 常量 ─────────────────────────────────── */
    var SCROLL_TRACK_ID = 'productsScrollTrack';
    var FILTER_ATTR    = 'data-filter';
    var ACTIVE_CLASS   = 'active';

    /* ── DOM 引用 ─────────────────────────────── */
    var track        = document.getElementById(SCROLL_TRACK_ID);
    var filterBtns   = document.querySelectorAll('.hw-tab[data-filter]');
    var cards        = track ? track.querySelectorAll('.product-card') : [];

    if (!track || !filterBtns.length) return;

    /* ── 当前状态 ─────────────────────────────── */
    var currentFilter = 'all';

    /* ── 核心：切换筛选 ─────────────────────── */
    function applyFilter(filter) {
        currentFilter = filter;

        cards.forEach(function (card) {
            var tags = (card.getAttribute(FILTER_ATTR) || '').split(/\s+/);
            var show = (filter === 'all') || tags.includes(filter);
            card.style.display = show ? '' : 'none';
        });

        /* 切换后把滚动位置重置到左侧 */
        track.scrollLeft = 0;
    }

    /* ── 按钮状态同步 ─────────────────────────── */
    function syncButtons(filter) {
        filterBtns.forEach(function (btn) {
            var isActive = (btn.getAttribute('data-filter') === filter);
            btn.classList.toggle(ACTIVE_CLASS, isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    /* ── 事件：点击筛选按钮 ─────────────────── */
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');
            if (filter === currentFilter) return;   // 无变化，不重复触发

            syncButtons(filter);
            applyFilter(filter);

            /* 全局回调 */
            if (typeof window.onHotHardwareFilterChange === 'function') {
                window.onHotHardwareFilterChange(filter);
            }

            /* CustomEvent，供外部解耦监听 */
            track.dispatchEvent(new CustomEvent('filter-changed', {
                bubbles: true,
                detail: { filter: filter }
            }));
        });
    });

    /* ── 键盘导航（← →） ────────────────────────
     * role="radiogroup" 内，方向键在选项间循环移动。
     * Enter / Space 由浏览器原生处理（点击效果），
     * 此处仅补足 ← → 横向切换。
     */
    var filterBar = document.querySelector('.products-filter');
    if (filterBar) {
        filterBar.addEventListener('keydown', function (e) {
            var allBtns  = Array.from(filterBtns);
            var curIdx   = allBtns.findIndex(function (b) {
                return b.getAttribute('data-filter') === currentFilter;
            });
            if (curIdx === -1) return;

            var nextIdx;
            if (e.key === 'ArrowRight') {
                nextIdx = (curIdx + 1) % allBtns.length;
                e.preventDefault();
                allBtns[nextIdx].focus();
                allBtns[nextIdx].click();           // click 触发切换
            } else if (e.key === 'ArrowLeft') {
                nextIdx = (curIdx - 1 + allBtns.length) % allBtns.length;
                e.preventDefault();
                allBtns[nextIdx].focus();
                allBtns[nextIdx].click();
            } else if (e.key === 'Home') {
                e.preventDefault();
                allBtns[0].focus();
                allBtns[0].click();
            } else if (e.key === 'End') {
                e.preventDefault();
                allBtns[allBtns.length - 1].focus();
                allBtns[allBtns.length - 1].click();
            }
        });
    }

    /* ── 初始化（页面刷新后保持状态一致性）── */
    /* 当前默认激活 "全部"，无需额外 applyFilter。*/

    /* ── 可选：空状态提示 ─────────────────────── */
    function checkEmpty(filter) {
        var visible = Array.from(cards).filter(function (c) { return c.style.display !== 'none'; });
        var hint    = track.querySelector('.filter-empty-hint');
        if (visible.length === 0) {
            if (!hint) {
                var el = document.createElement('div');
                el.className = 'filter-empty-hint';
                el.textContent = '该分类暂无商品';
                el.style.cssText = [
                    'grid-column: 1 / -1',
                    'text-align: center',
                    'color: rgba(255,255,255,0.3)',
                    'padding: 3rem 0',
                    'font-size: 0.9rem',
                    'letter-spacing: 0.05em'
                ].join(';');
                track.appendChild(el);
            }
        } else {
            if (hint) hint.remove();
        }
    }

    /* ── 混入 checkEmpty 到 applyFilter ─────── */
    var _applyFilter = applyFilter;
    applyFilter = function (filter) {
        _applyFilter(filter);
        checkEmpty(filter);
    };
    applyFilter(currentFilter);   // 初始化时检查一次

})();
