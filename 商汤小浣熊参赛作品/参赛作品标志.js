/*
 * 参赛作品标志.js
 * 功能：在页面上以"灵动岛"设计风格提示这是商汤小浣熊参赛作品，作者是软软的小窝
 * 效果：进入页面 -> 屏幕上方掉落一个小球 -> 放大成灵动岛(胶囊) -> 显示信息5秒 -> 缩小消失
 * 样式：完全使用自定义CSS（通过JS动态注入），不依赖任何外部CSS文件
 * 适配：字号纯按屏幕宽度(vw)缩放，不受浏览器字体设置/zoom/dpr 影响；大屏不过宽、小屏不溢出
 * 作者：软软的小窝
 *
 * 调整说明：文字字号改为纯 vw 驱动（去除 rem/px 固定依赖），仅随屏幕宽度变化；胶囊边框内收更紧凑
 */

(function () {
    'use strict';

    // 防止重复注入
    if (window.__raccoonFitIslandInjected) return;
    window.__raccoonFitIslandInjected = true;

    // ==================== 1. 注入自定义CSS ====================
    // 说明：
    // - 胶囊宽度用 max-width + 内容自适应(min-width)，避免大屏过窄、小屏溢出
    // - 字号用 clamp()，随视口/字体缩放平滑变化，不写死 px
    // - 定位用视口单位 vw/vh 辅助，translateX(-50%) 保证任意宽度严格居中
    // - 监听 zoom/dpr：CSS 使用相对/视口单位，浏览器缩放时自动重排
    // - 边框往里收：content 的 padding 由 clamp(12px,2vw,20px) 缩至 clamp(8px,1.4vw,14px)
    var css = `
/* ===== 参赛作品标志 - 灵动岛 样式（自定义CSS，无外部依赖） ===== */
@keyframes rfDropIn {
    0%   { transform: translateY(-14vh) scale(0.6); opacity: 0; }
    60%  { transform: translateY(2.6vh) scale(1.15); opacity: 1; }
    80%  { transform: translateY(1.4vh) scale(0.95); }
    100% { transform: translateY(2vh) scale(1); opacity: 1; }
}
/* 胶囊尺寸(宽/高/圆角)全部改用 vw，与字号同步随屏幕宽度缩放，UI 同比变大 */
@keyframes rfExpand {
    0%   { width: 5vw; height: 5vw; min-width: 34px; min-height: 34px; border-radius: 50%; }
    60%  { width: 92vw; max-width: 46vw; height: 11vw; max-height: 68px; border-radius: 34px; }
    100% { width: 92vw; max-width: 44vw; height: 9.5vw; max-height: 60px; border-radius: 30px; }
}
@keyframes rfShrink {
    0%   { width: 92vw; max-width: 44vw; height: 9.5vw; max-height: 60px; border-radius: 30px; opacity: 1; }
    100% { width: 0; height: 0; border-radius: 50%; opacity: 0; transform: translateY(2vh) scale(0); }
}
@keyframes rfContentFadeIn {
    0%   { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
}
@keyframes rfOrbPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 92, 133, 0.5), 0 6px 20px rgba(0,0,0,0.25); }
    50%      { box-shadow: 0 0 0 10px rgba(255, 92, 133, 0), 0 6px 20px rgba(0,0,0,0.25); }
}

.rf-island-wrap {
    position: fixed;
    top: 0; left: 50%;
    transform: translateX(-50%);
    z-index: 2147483640;
    pointer-events: none;
    display: flex; justify-content: center;
    width: 100vw;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
                 "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    /* 字号根：纯 vw 驱动，只随屏幕宽度变化，不受浏览器字体设置/zoom 影响 */
    font-size: clamp(2.2vw, 1vw + 8px, 2.8vw);
}
.rf-island {
    position: relative;
    /* 初始小球：尺寸用 vw，与字号同步随屏幕宽度缩放 */
    width: 5vw; height: 5vw; min-width: 34px; min-height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff5c85 0%, #ff8a5c 55%, #ffd25c 100%);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    animation: rfDropIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards,
               rfOrbPulse 2.4s ease-in-out 0.9s infinite;
    pointer-events: auto;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}
.rf-island.rf-expand {
    animation: rfExpand 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    cursor: default;
}
.rf-island.rf-shrink {
    animation: rfShrink 0.6s cubic-bezier(0.4, 0, 1, 1) forwards;
    pointer-events: none;
}
.rf-island-content {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    white-space: nowrap; opacity: 0;
    color: #fff; text-align: center; line-height: 1.25;
    /* 边框往里收：内边距由 clamp(12px,2vw,20px) 缩小为 clamp(8px,1.4vw,14px) */
    padding: 0 clamp(8px, 1.4vw, 14px);
}
.rf-island-content.rf-show { animation: rfContentFadeIn 0.5s ease 0.25s forwards; }
.rf-island-title {
    /* 字号纯按屏幕宽度(vw)缩放，不受字体设置/zoom 影响；clamp 上下限也用 vw */
    font-size: clamp(3.4vw, 1vw + 8px, 4.4vw); font-weight: 700; letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.18);
}
.rf-island-sub {
    font-size: clamp(2.6vw, 0.75vw + 6px, 3.4vw); font-weight: 500; opacity: 0.92; margin-top: 3px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.18);
}
.rf-island-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: rgba(255,255,255,0.95);
    box-shadow: 0 0 6px rgba(255,255,255,0.7);
}
.rf-island.rf-expand .rf-island-dot { display: none; }

/* ===== 适配：小屏 / 大屏 ===== */
@media (max-width: 380px) {
    .rf-island.rf-expand { width: 90vw !important; max-width: 70vw !important; }
    .rf-island-title { font-size: clamp(3.2vw, 1vw + 7px, 4vw); }
}
/* 大屏：胶囊/字号上限放开，UI 随宽度同比放大（不再被固定 px 卡住） */
@media (min-width: 1600px) {
    .rf-island.rf-expand { max-width: 44vw; }
}
`;

    var styleEl = document.createElement('style');
    styleEl.setAttribute('data-raccoon-fit', 'island-style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ==================== 2. 构建DOM ====================
    var wrap = document.createElement('div');
    wrap.className = 'rf-island-wrap';

    var island = document.createElement('div');
    island.className = 'rf-island';

    var dot = document.createElement('div');
    dot.className = 'rf-island-dot';

    var content = document.createElement('div');
    content.className = 'rf-island-content';
    content.innerHTML =
        '<div class="rf-island-title">商汤小浣熊参赛作品</div>' +
        '<div class="rf-island-sub">作者 · 软软的小窝</div>';

    island.appendChild(dot);
    island.appendChild(content);
    wrap.appendChild(island);
    document.body.appendChild(wrap);

    // ==================== 3. 自适应宽度精修 ====================
    // 胶囊宽度上限改为 vw（44vw），与字号/UI 同比例随屏幕宽度放大；下限略收
    function fitToContent() {
        try {
            var pad = parseFloat(getComputedStyle(content).paddingLeft) +
                      parseFloat(getComputedStyle(content).paddingRight);
            var needed = content.scrollWidth + pad + 16; // 两侧留白收紧
            // 上限随屏幕宽度同比放大（44vw），大屏不再被 360px 死死卡住
            var max = Math.min(window.innerWidth * 0.92, window.innerWidth * 0.44);
            var w = Math.max(160, Math.min(Math.ceil(needed), max)); // 最小宽度同步略收
            island.style.width = w + 'px';
        } catch (e) { /* 非关键，静默 */ }
    }

    // ==================== 4. 动画流程控制 ====================
    var DISPLAY_MS = 5000;

    function expand() {
        island.classList.add('rf-expand');
        content.classList.add('rf-show');
        requestAnimationFrame(function () { setTimeout(fitToContent, 60); });
    }

    function shrinkAndRemove() {
        island.classList.remove('rf-expand');
        island.classList.add('rf-shrink');
        island.addEventListener('animationend', function handler(e) {
            if (e.animationName !== 'rfShrink') return;
            island.removeEventListener('animationend', handler);
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        });
    }

    island.addEventListener('animationend', function handler(e) {
        if (e.animationName !== 'rfDropIn') return;
        island.removeEventListener('animationend', handler);
        setTimeout(expand, 350);
    });

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            if (m.attributeName === 'class' &&
                island.classList.contains('rf-expand')) {
                observer.disconnect();
                setTimeout(shrinkAndRemove, DISPLAY_MS);
            }
        });
    });
    observer.observe(island, { attributes: true });

})();
