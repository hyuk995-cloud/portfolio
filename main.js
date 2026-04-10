document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const totop = document.getElementById('totop');
  const btn = document.getElementById('navBtn');
  const mob = document.getElementById('mobileNav');

  /* 1. 스크롤 시 상단바 및 Top 버튼 제어 */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    totop.classList.toggle('show', y > 400);
  });

  /* 2. 모바일 메뉴 토글 */
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    mob.classList.toggle('open');
  });

  /* 메뉴 클릭 시 닫기 */
  mob.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      mob.classList.remove('open');
    });
  });

  /* 3. 스크롤 페이드인 효과 (Intersection Observer) */
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* 4. Top 버튼 클릭 시 상단 이동 */
  totop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});