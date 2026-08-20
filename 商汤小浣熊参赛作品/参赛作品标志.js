(function () {
  'use strict';
  if (window.__RACCOON_FIT_ISLAND__) return;
  window.__RACCOON_FIT_ISLAND__ = true;

  // ---------- 工具：以视口短边为基准，统一跨浏览器比例 ----------
  // 设计稿参考短边 800px：胶囊高 44px / 字 15px / 半径 22px
  function vmin() { return Math.min(window.innerWidth, window.innerHeight) || 800; }
  function dim(ratio) { return Math.round(vmin() * ratio); }

  var ID = 'rf-island-root';
  var STYLE_ID = 'rf-island-style';

  // ---------- 动态样式（尺寸全部由 JS 按 vmin 注入，覆盖默认值） ----------
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    // 基础字号/尺寸用 CSS 变量占位，由 updateSizes() 实时刷新
    s.textContent = [
      '#' + ID + '{position:fixed;top:14px;left:50%;transform:translateX(-50%);',
      'z-index:2147483600;display:flex;justify-content:center;align-items:flex-start;',
      'pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",',
      '"PingFang SC","Microsoft YaHei",sans-serif;}',
      '#' + ID + ' .rf-dot{width:34px;height:34px;border-radius:50%;',
      'background:radial-gradient(circle at 30% 28%,#ffd9a0,#ff8a3d 55%,#e85d2f);',
      'box-shadow:0 6px 18px rgba(232,93,47,.35),0 0 0 2px rgba(255,255,255,.25) inset,',
      '0 0 12px rgba(255,160,90,.6);transition:width .55s cubic-bezier(.5,-0.2,.35,1.2),',
      'height .55s cubic-bezier(.5,-0.2,.35,1.2),border-radius .55s cubic-bezier(.5,-0.2,.35,1.2),',
      'opacity .45s ease;opacity:0;transform:translateY(-30px);}',
      '#' + ID + ' .rf-dot.rf-in{opacity:1;transform:translateY(0);}',
      '#' + ID + ' .rf-dot.rf-expand{display:flex;align-items:center;justify-content:center;',
      'gap:8px;padding:0 16px;width:var(--rf-w);height:var(--rf-h);border-radius:calc(var(--rf-h)/2);}',
      '#' + ID + ' .rf-dot.rf-shrink{width:34px;height:34px;border-radius:50%;padding:0;',
      'opacity:0;transform:translateY(-14px);}',
      '#' + ID + ' .rf-text{display:flex;flex-direction:column;align-items:flex-start;',
      'justify-content:center;line-height:1.15;white-space:nowrap;opacity:0;transition:opacity .35s ease .15s;}',
      '#' + ID + ' .rf-dot.rf-expand .rf-text{opacity:1;}',
      '#' + ID + ' .rf-title{color:#fff;font-weight:700;font-size:var(--rf-fs);letter-spacing:.3px;',
      'text-shadow:0 1px 2px rgba(0,0,0,.25);}',
      '#' + ID + ' .rf-author{color:rgba(255,255,255,.82);font-weight:500;font-size:var(--rf-fs-sm);}',
      '@media (prefers-reduced-motion:reduce){',
      '#' + ID + ' .rf-dot{transition:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ---------- 按当前视口刷新尺寸变量 ----------
  function updateSizes() {
    var root = document.getElementById(ID);
    if (!root) return;
    var h = Math.max(40, Math.min(dim(0.052), 60));  // 胶囊高 ~ 40~60px
    var fs = Math.max(13, Math.min(dim(0.0185), 18));   // 标题字号 13~18px（封顶防大屏过大）
    var fsSm = Math.round(fs * 0.78);       // 作者字号
    // 先按内容估算宽度：用测量 span 取文字实际宽度
    var dot = root.querySelector('.rf-dot');
    var titleEl = root.querySelector('.rf-title');
    var authorEl = root.querySelector('.rf-author');
    var title = '商汤小浣熊参赛作品', author = '作者 · 软软的小窝';
    if (titleEl) titleEl.textContent = title;
    if (authorEl) authorEl.textContent = author;
    var measure = document.getElementById(ID + '-measure');
    if (!measure) {
      measure = document.createElement('div');
      measure.id = ID + '-measure';
      measure.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;';
      measure.style.fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';
      measure.innerHTML = '<span class="m-t" style="font-weight:700;font-size:' + fs + 'px">' + title + '</span>';
      document.body.appendChild(measure);
    } else {
      measure.querySelector('.m-t').style.fontSize = fs + 'px';
      measure.querySelector('.m-t').textContent = title;
    }
    var txtW = measure.querySelector('.m-t').getBoundingClientRect().width || 0;
    var pad = 32, gap = 8, authorW = Math.ceil(txtW * 0.82);
    var contentW = Math.max(txtW, authorW) + pad;
    var maxW = Math.min(window.innerWidth * 0.9, dim(0.46)); // 大屏也不超短边46%
    var w = Math.max(180, Math.min(Math.round(contentW), Math.max(180, Math.round(maxW))));
    root.style.setProperty('--rf-w', w + 'px');
    root.style.setProperty('--rf-h', h + 'px');
    root.style.setProperty('--rf-fs', fs + 'px');
    root.style.setProperty('--rf-fs-sm', fsSm + 'px');
  }

  function build() {
    if (document.getElementById(ID)) return;
    injectStyle();
    var root = document.createElement('div');
    root.id = ID;
    root.innerHTML = '<div class="rf-dot"><div class="rf-text"><span class="rf-title"></span>'
                  + '<span class="rf-author"></span></div></div>';
    document.body.appendChild(root);
    updateSizes();
    var dot = root.querySelector('.rf-dot');
    // 掉落入场
    requestAnimationFrame(function () {
      dot.classList.add('rf-in');
      // 展开为灵动岛
      setTimeout(function () { dot.classList.add('rf-expand'); }, 520);
      // 5 秒后缩小消失
      setTimeout(function () { dot.classList.remove('rf-expand'); dot.classList.add('rf-shrink'); }, 5520);
      // 动画结束清理
      setTimeout(function () {
        try {
          root.parentNode && root.parentNode.removeChild(root);
          var m = document.getElementById(ID + '-measure'); m && m.parentNode.removeChild(m);
          var st = document.getElementById(STYLE_ID); st && st.parentNode.removeChild(st);
        } catch (e) {}
      }, 6200);
    });
  }

  function init() {
    if (document.body) build();
    else document.addEventListener('DOMContentLoaded', build, { once: true });
  }
  init();
})();
