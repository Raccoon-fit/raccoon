(function () {
  'use strict';
  if (window.__RACCOON_FIT_ISLAND__) return;
  window.__RACCOON_FIT_ISLAND__ = true;

  var ID = 'rf-island-root';
  var STYLE_ID = 'rf-island-style';

  // ---------- 动态样式（简洁 clamp/rem 方案，字号更大、胶囊比例更像灵动岛） ----------
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '#' + ID + '{position:fixed;top:16px;left:50%;transform:translateX(-50%);',
      'z-index:2147483600;display:flex;justify-content:center;align-items:flex-start;',
      'pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",',
      '"PingFang SC","Microsoft YaHei",sans-serif;}',
      // 小球：适中 32px，渐变温暖
      '#' + ID + ' .rf-dot{width:32px;height:32px;border-radius:50%;',
      'background:radial-gradient(circle at 30% 28%,#ffd9a0,#ff8a3d 55%,#e85d2f);',
      'box-shadow:0 6px 18px rgba(232,93,47,.35),0 0 0 2px rgba(255,255,255,.25) inset,',
      '0 0 12px rgba(255,160,90,.6);transition:width .55s cubic-bezier(.5,-0.2,.35,1.2),',
      'height .55s cubic-bezier(.5,-0.2,.35,1.2),border-radius .55s cubic-bezier(.5,-0.2,.35,1.2),',
      'opacity .45s ease;opacity:0;transform:translateY(-30px);}',
      '#' + ID + ' .rf-dot.rf-in{opacity:1;transform:translateY(0);}',
      // 展开：胶囊扁长，像真灵动岛；字号 clamp 自然缩放，字更大
      '#' + ID + ' .rf-dot.rf-expand{display:flex;align-items:center;justify-content:center;',
      'gap:9px;padding:0 20px;width:var(--rf-w);height:var(--rf-h);',
      'border-radius:calc(var(--rf-h)/2);}',
      '#' + ID + ' .rf-dot.rf-shrink{width:32px;height:32px;border-radius:50%;padding:0;',
      'opacity:0;transform:translateY(-14px);}',
      '#' + ID + ' .rf-text{display:flex;flex-direction:column;align-items:flex-start;',
      'justify-content:center;line-height:1.18;white-space:nowrap;opacity:0;transition:opacity .35s ease .15s;}',
      '#' + ID + ' .rf-dot.rf-expand .rf-text{opacity:1;}',
      // 字号 clamp：下限够大保证可读，上限受控；比例自然
      '#' + ID + ' .rf-title{color:#fff;font-weight:700;font-size:var(--rf-fs);letter-spacing:.3px;',
      'text-shadow:0 1px 2px rgba(0,0,0,.25);}',
      '#' + ID + ' .rf-author{color:rgba(255,255,255,.82);font-weight:500;font-size:var(--rf-fs-sm);}',
      '@media (prefers-reduced-motion:reduce){',
      '#' + ID + ' .rf-dot{transition:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ---------- 尺寸：简洁自然，clamp 由 CSS 变量承载，JS 只算宽度 ----------
  function updateSizes() {
    var root = document.getElementById(ID);
    if (!root) return;
    // 胶囊高：36~52px，随视口自然放大，灵动岛扁长感
    var h = Math.round(Math.max(36, Math.min(window.innerWidth * 0.034, 52)));
    // 标题字号：15~19px，比之前更大更醒目
    var fs = Math.round(Math.max(15, Math.min(window.innerWidth * 0.0135, 19)));
    var fsSm = Math.round(fs * 0.78);
    var dot = root.querySelector('.rf-dot');
    var titleEl = root.querySelector('.rf-title');
    var authorEl = root.querySelector('.rf-author');
    var title = '商汤小浣熊参赛作品', author = '作者 · 软软的小窝';
    if (titleEl) titleEl.textContent = title;
    if (authorEl) authorEl.textContent = author;
    // 测量文字实际宽度，胶囊随内容自适应
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
    var pad = 40, authorW = Math.ceil(txtW * 0.82);
    var contentW = Math.max(txtW, authorW) + pad;
    var maxW = Math.min(window.innerWidth * 0.88, 340); // 大屏封顶 340，保持灵动岛比例
    var w = Math.max(170, Math.min(Math.round(contentW), Math.max(170, Math.round(maxW))));
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
    requestAnimationFrame(function () {
      dot.classList.add('rf-in');
      setTimeout(function () { dot.classList.add('rf-expand'); }, 520);
      setTimeout(function () { dot.classList.remove('rf-expand'); dot.classList.add('rf-shrink'); }, 5520);
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
