/* ============================================================
   HYPERCAR.SITE · v3 交互
   导航实底 / 光标 / 卡片左右入场 / 数字滚动 / 滚动指示
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;

  /* 导航底色 */
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    if (window.pageYOffset > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 自定义光标 */
  var cursor = document.querySelector('.cursor');
  if (cursor && !coarse && !reduced) {
    var cx = -100, cy = -100, tx = -100, ty = -100, raf = null;
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('is-on');
      if (raf === null) {
        raf = requestAnimationFrame(function loop() {
          cx += (tx - cx) * 0.25;
          cy += (ty - cy) * 0.25;
          cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
          if (Math.abs(cx - tx) < 0.4 && Math.abs(cy - ty) < 0.4) { raf = null; return; }
          raf = requestAnimationFrame(loop);
        });
      }
    });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); });
    document.querySelectorAll('a, .door').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hot'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hot'); });
    });
  }

  /* 卡片入场(交替左右滑入) */
  var doors = document.querySelectorAll('.door');
  var doorIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        doorIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  doors.forEach(function (d) { doorIO.observe(d); });

  /* 数字滚动 */
  function animateNum(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (!target || reduced) return;
    var t0 = null, dur = 1500;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var numIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.querySelectorAll('[data-count]').forEach(animateNum);
        numIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  doors.forEach(function (d) { numIO.observe(d); });

  /* 首屏兜底:加载后立即为视口内的卡片触发入场与数字滚动
     (保证首屏卡片不依赖 IntersectionObserver 的首帧时机) */
  function revealInViewport() {
    doors.forEach(function (d) {
      if (d.classList.contains('is-in')) return;
      var r = d.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        d.classList.add('is-in');
        d.querySelectorAll('[data-count]').forEach(animateNum);
        doorIO.unobserve(d);
        numIO.unobserve(d);
      }
    });
  }
  window.addEventListener('load', function () { setTimeout(revealInViewport, 150); });

  /* 滚动指示淡出 */
  var scrollHint = document.querySelector('.hero__scroll');
  if (scrollHint) {
    window.addEventListener('scroll', function () {
      scrollHint.classList.toggle('is-gone', window.pageYOffset > 60);
    }, { passive: true });
  }
})();
