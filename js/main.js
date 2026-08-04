/* ============================================================
   HYPERCAR.SITE · 交互
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;

  /* 导航底色 */
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 40) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }, { passive: true });

  /* 光标 */
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

  /* 卡片入场(下方上浮) */
  var doors = document.querySelectorAll('.door');
  var doorIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        doorIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });
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
})();
