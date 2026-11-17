// 강연례 소개 페이지 동작 — 외부 라이브러리 없이 기본 JavaScript만 사용
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) 휴대폰 햄버거 메뉴 열고 닫기
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  // 2) 이메일 주소를 화면에서 조합 (스팸 수집 줄이기)
  document.querySelectorAll('.js-email').forEach(function (el) {
    var address = el.dataset.user + '@' + el.dataset.domain;
    el.setAttribute('href', 'mailto:' + address);
    if (el.classList.contains('js-email-text')) el.textContent = address;
  });

  // 3) 푸터 연도 자동 표시
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // 4) 숫자 올라가기
  function countUp(el) {
    var target = parseInt(el.dataset.target, 10);
    if (reduceMotion) { el.textContent = target.toLocaleString('ko-KR'); return; }
    var duration = 800;
    var start = null;
    function step(time) {
      if (!start) start = time;
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
      if (progress < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  // 5) 스크롤하면 서서히 나타나기 (+ 숫자 시작)
  var items = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.count').forEach(countUp);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    counters.forEach(function (el) { el.textContent = Number(el.dataset.target).toLocaleString('ko-KR'); });
  }

  // 6) 한 줄 소개 글자 타이핑 효과
  var typing = document.querySelector('.typing');
  if (typing && !reduceMotion) {
    var text = typing.dataset.text;
    var i = 0;
    typing.textContent = '';
    typing.classList.add('is-typing');
    var timer = setInterval(function () {
      i += 1;
      typing.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(function () { typing.classList.remove('is-typing'); }, 1200);
      }
    }, 70);
  }
});
