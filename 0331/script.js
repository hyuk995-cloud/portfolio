
/* NAV */
const siteNav = document.getElementById('siteNav');
const navLinks = document.getElementById('navLinks');
navLinks.addEventListener('mouseenter', () => siteNav.classList.add('is-dark'));
navLinks.addEventListener('mouseleave', () => siteNav.classList.remove('is-dark'));

/* DRAWER */
function toggleDrawer() {
  const open = document.getElementById('drawer').classList.contains('open');
  document.getElementById('drawer').classList.toggle('open', !open);
  document.getElementById('drawerBg').classList.toggle('on', !open);
  document.getElementById('hamBtn').classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerBg').classList.remove('on');
  document.getElementById('hamBtn').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* RES TABS */
function selTab(el) {
  document.querySelectorAll('.res-tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
}

/* GUEST */
let aN = 2, cN = 0;
function togGuest(e) {
  e.stopPropagation();
  document.getElementById('guestDrop').classList.toggle('on');
}
function adj(type, d) {
  if (type === 'a') { aN = Math.max(1, Math.min(8, aN + d)); document.getElementById('aN').textContent = aN; }
  else { cN = Math.max(0, Math.min(6, cN + d)); document.getElementById('cN').textContent = cN; }
  let t = '성인 ' + aN + '명'; if (cN) t += ', 어린이 ' + cN + '명';
  document.getElementById('guestVal').textContent = t;
}
document.addEventListener('click', () => document.getElementById('guestDrop').classList.remove('on'));

/* CALENDAR */
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
let base = { y: 0, m: 0 }, selIn = null, selOut = null, picking = false;

function openCal() {
  const now = new Date();
  base = { y: now.getFullYear(), m: now.getMonth() };
  renderCal();
  document.getElementById('calOv').classList.add('on');
}
function closeCal() { document.getElementById('calOv').classList.remove('on'); }
function shiftM(d) {
  base.m += d;
  if (base.m > 11) { base.m = 0; base.y++; }
  if (base.m < 0) { base.m = 11; base.y--; }
  renderCal();
}
function renderCal() {
  let m2 = base.m + 1, y2 = base.y;
  if (m2 > 11) { m2 = 0; y2++; }
  document.getElementById('m1t').textContent = base.y + '년 ' + MONS[base.m];
  document.getElementById('m2t').textContent = y2 + '년 ' + MONS[m2];
  buildGrid('g1', base.y, base.m);
  buildGrid('g2', y2, m2);
  updInfo();
}
function buildGrid(id, y, m) {
  const el = document.getElementById(id); el.innerHTML = '';
  DAYS.forEach(d => { const n = document.createElement('div'); n.className = 'cal-dn'; n.textContent = d; el.appendChild(n); });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(y, m, 1).getDay();
  const dmax = new Date(y, m + 1, 0).getDate();
  for (let i = 0; i < first; i++) { const n = document.createElement('div'); n.className = 'cal-d emp'; el.appendChild(n); }
  for (let d = 1; d <= dmax; d++) {
    const date = new Date(y, m, d);
    const n = document.createElement('div'); n.className = 'cal-d'; n.textContent = d;
    if (date < today) { n.classList.add('dis'); }
    else {
      if (date.toDateString() === today.toDateString()) n.classList.add('today');
      if (selIn && date.toDateString() === selIn.toDateString()) n.classList.add('rs');
      if (selOut && date.toDateString() === selOut.toDateString()) n.classList.add('re');
      if (selIn && selOut && date > selIn && date < selOut) n.classList.add('inr');
      n.addEventListener('click', () => pickDay(date));
    }
    el.appendChild(n);
  }
}
function pickDay(date) {
  if (!selIn || (selIn && selOut)) { selIn = date; selOut = null; picking = true; }
  else if (picking) { if (date <= selIn) { selIn = date; selOut = null; } else { selOut = date; picking = false; } }
  renderCal();
}
function fmtD(d) { return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); }
function updInfo() {
  const el = document.getElementById('calInfo');
  if (!selIn) { el.textContent = '체크인 날짜를 선택해주세요'; return; }
  if (!selOut) { el.textContent = '체크인: ' + fmtD(selIn) + ' — 체크아웃 날짜를 선택해주세요'; return; }
  el.textContent = fmtD(selIn) + ' → ' + fmtD(selOut) + '  (' + Math.round((selOut - selIn) / 86400000) + '박)';
}
function confirmD() {
  if (selIn) document.getElementById('ciVal').textContent = fmtD(selIn);
  if (selOut) document.getElementById('coVal').textContent = fmtD(selOut);
  closeCal();
}

/* SLIDER FACTORY */
function makeSlider(trackId, dotsId, total) {
  let idx = 0;
  const track = document.getElementById(trackId);
  const dotsEl = document.getElementById(dotsId);
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 's-dot' + (i === 0 ? ' on' : '');
    dot.addEventListener('click', () => go(i));
    dotsEl.appendChild(dot);
  }
  function go(n) {
    idx = ((n % total) + total) % total;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    dotsEl.querySelectorAll('.s-dot').forEach((d, i) => d.classList.toggle('on', i === idx));
  }
  return (d) => go(idx + d);
}
const pkgS = makeSlider('pkgT', 'pkgD', 2);
const bqS = makeSlider('bqT', 'bqD', 3);
const rstS = makeSlider('rstT', 'rstD', 2);

/* POOL TABS */
function switchPool(idx, el) {
  document.querySelectorAll('.pool-tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  [0, 1, 2].forEach(i => document.getElementById('pp' + i).classList.toggle('on', i === idx));
}

/* SCROLL REVEAL */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.rev').forEach(el => ro.observe(el));
