/**
 * 灵熊小记 UA兼容检测脚本
 * 用法: 在HTML文件中引入此脚本即可
 * <script src="lxxjjianrong.js"></script>
 */

// UA验证常量
const LXXJ_TARGET_UA = 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LingXiongRaccoon/1.0 (package:com.xiaohuanxiong.hauntedhive; official:raccoon.fit)';

/**
 * 注入CSS样式到页面头部
 */
function lxxjInjectStyles() {
    const styleId = 'lxxj-ua-fallback-styles';
    if (document.getElementById(styleId)) return;
    
    const styles = `
        #lxxj-ua-fallback-page {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            color: #000000;
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        #lxxj-ua-fallback-page.visible {
            display: flex;
        }

        .lxxj-fallback-content {
            text-align: center;
            padding: 40px;
            max-width: 500px;
        }

        .lxxj-fallback-icon {
            font-size: 64px;
            margin-bottom: 24px;
        }

        .lxxj-fallback-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1a1a1a;
        }

        .lxxj-fallback-message {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            margin-bottom: 24px;
        }

        .lxxj-fallback-download {
            display: inline-block;
            padding: 12px 32px;
            background: #000000;
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 8px;
        }

        .lxxj-fallback-package {
            font-size: 12px;
            color: #666666;
            margin-top: 16px;
            font-family: monospace;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

/**
 * 注入HTML元素到body
 */
function lxxjInjectHTML() {
    if (document.getElementById('lxxj-ua-fallback-page')) return;
    
    const fallbackHTML = `
        <div id="lxxj-ua-fallback-page">
            <div class="lxxj-fallback-content">
                <div class="lxxj-fallback-icon">🦝</div>
                <h1 class="lxxj-fallback-title">请在灵熊小记APP查看</h1>
                <p class="lxxj-fallback-message">
                    为了获得最佳体验，请下载并安装灵熊小记官方应用。
                </p>
                <div class="lxxj-fallback-package">com.xiaohuanxiong.hauntedhive</div>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = fallbackHTML;
    document.body.appendChild(div);
}

/**
 * UA验证函数
 * @returns {boolean} true表示UA匹配，false表示不匹配
 */
function lxxjValidateUA() {
    const currentUA = navigator.userAgent;
    console.log('🔍 LXXJ - Current UA:', currentUA);
    console.log('🎯 LXXJ - Target UA:', LXXJ_TARGET_UA);
    
    if (currentUA === LXXJ_TARGET_UA) {
        console.log('✅ LXXJ - UA验证通过');
        return true;
    } else {
        console.log('❌ LXXJ - UA验证失败');
        return false;
    }
}

/**
 * 隐藏需要保护的页面元素
 */
function lxxjHideProtectedElements() {
    // 隐藏常见的游戏容器元素
    const selectorsToHide = [
        '#game-container',
        '#scene-container', 
        '#canvas-container',
        '#three-canvas',
        '#game-canvas',
        '#scene',
        '.game-wrapper',
        '.scene-wrapper',
        '#loading-screen',
        '#main-menu',
        '#scene-title',
        '#libraries-info',
        '#info-panel',
        '#keyboard-hint',
        '#remote-hint',
        '#first-person-hint',
        '#joystick-container',
        '.compass-arrow',
        '.feature-panel-area'
    ];
    
    selectorsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.id !== 'lxxj-ua-fallback-page') {
                el.style.display = 'none';
            }
        });
    });
    
    // 尝试隐藏body内容（除了fallback页面）
    if (document.body) {
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.id !== 'lxxj-ua-fallback-page') {
                // 如果元素是fallback页面，则保留
                if (!child.classList.contains('lxxj-fallback')) {
                    child.style.display = 'none';
                }
            }
        }
    }
}

/**
 * 初始化UA验证
 */
function lxxjInit() {
    // 注入样式和HTML
    lxxjInjectStyles();
    lxxjInjectHTML();
    
    console.log('🚀 LXXJ - 灵熊小记UA检测初始化...');
    
    // 执行UA验证
    if (!lxxjValidateUA()) {
        // 显示fallback页面
        const fallbackPage = document.getElementById('lxxj-ua-fallback-page');
        if (fallbackPage) {
            fallbackPage.classList.add('visible');
        }
        
        // 隐藏其他页面元素
        lxxjHideProtectedElements();
        
        console.log('🛑 LXXJ - UA验证未通过，已显示提示页面');
    } else {
        console.log('✅ LXXJ - UA验证通过，页面正常加载');
    }
}

/**
 * 手动触发UA验证（用于动态加载内容后）
 */
function lxxjCheck() {
    if (!lxxjValidateUA()) {
        const fallbackPage = document.getElementById('lxxj-ua-fallback-page');
        if (fallbackPage) {
            fallbackPage.classList.add('visible');
        }
        lxxjHideProtectedElements();
    }
}

/**
 * 获取当前UA验证状态
 * @returns {boolean} true表示已通过验证
 */
function lxxjIsValid() {
    return lxxjValidateUA();
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lxxjInit);
} else {
    // 如果DOM已经加载完成，立即执行
    lxxjInit();
}

// 导出到全局作用域
window.lxxjInit = lxxjInit;
window.lxxjCheck = lxxjCheck;
window.lxxjIsValid = lxxjIsValid;
window.lxxjValidateUA = lxxjValidateUA;

console.log('📦 LXXJ - 灵熊小记UA兼容检测脚本已加载');
