// ====== 여기만 수정하면 내용이 바뀝니다 ======
const PROFILE = {
  roles: ['프론트엔드 개발자', 'UI 디자인 애호가', '꾸준히 성장하는 사람'],
  email: 'hello@example.com',
};

const SKILLS = [
  { name: 'HTML5', icon: '🌐' },
  { name: 'CSS3', icon: '🎨' },
  { name: 'JavaScript', icon: '⚡' },
  { name: 'Tailwind CSS', icon: '💨' },
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Git / GitHub', icon: '🐙' },
  { name: 'Figma', icon: '✏️' },
];

const PROJECTS = [
  {
    title: '할 일 관리 앱',
    description: '드래그 앤 드롭과 로컬 저장을 지원하는 간단한 할 일 관리 웹앱.',
    tags: ['JavaScript', 'CSS'],
    emoji: '✅',
    github: 'https://github.com/',
    demo: '#',
  },
  {
    title: '날씨 대시보드',
    description: '공개 API로 도시별 날씨를 보여주는 반응형 대시보드.',
    tags: ['HTML', 'Tailwind', 'API'],
    emoji: '⛅',
    github: 'https://github.com/',
    demo: '#',
  },
  {
    title: '개인 블로그',
    description: '마크다운으로 글을 쓰고 다크모드를 지원하는 정적 블로그.',
    tags: ['React', 'Markdown'],
    emoji: '📝',
    github: 'https://github.com/',
    demo: '#',
  },
];
// ============================================

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// 텍스트는 항상 textContent로 넣어 XSS를 방지
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderSkills() {
  const list = $('#skills-list');
  SKILLS.forEach(({ name, icon }) => {
    const li = el('li', 'card reveal flex items-center gap-3 p-4 font-medium');
    li.append(el('span', 'text-2xl', icon), el('span', '', name));
    list.append(li);
  });
}

function renderProjects() {
  const grid = $('#projects-grid');
  PROJECTS.forEach((p) => {
    const card = el('article', 'card reveal overflow-hidden');
    const thumb = el('div', 'flex h-40 items-center justify-center bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-6xl', p.emoji);
    const body = el('div', 'space-y-3 p-6');
    body.append(el('h3', 'text-xl font-bold text-slate-900 dark:text-white', p.title), el('p', 'text-sm leading-relaxed', p.description));

    const tags = el('div', 'flex flex-wrap gap-2');
    p.tags.forEach((t) => tags.append(el('span', 'rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-indigo-300', t)));

    const links = el('div', 'flex gap-4 pt-2 text-sm font-semibold');
    [['GitHub', p.github], ['Demo', p.demo]].forEach(([label, href]) => {
      const a = el('a', 'text-brand-600 hover:underline dark:text-indigo-300', label + ' →');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      links.append(a);
    });

    body.append(tags, links);
    card.append(thumb, body);
    grid.append(card);
  });
}

// 타이핑 효과
function typing() {
  const target = $('#typing');
  let r = 0, c = 0, deleting = false;
  (function tick() {
    const word = PROFILE.roles[r];
    c += deleting ? -1 : 1;
    target.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1500; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % PROFILE.roles.length; delay = 400; }
    setTimeout(tick, delay);
  })();
}

// 다크모드
function setupTheme() {
  $('#theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });
}

// 모바일 메뉴
function setupMenu() {
  const btn = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const set = (open) => {
    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(menu.classList.contains('hidden')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
}

// 스크롤: 네비 배경, 등장 애니메이션, 활성 섹션
function setupScroll() {
  const nav = $('#navbar');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((n) => revealObs.observe(n));

  const links = $$('.nav-link');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionObs.observe(s));
}

// 문의 폼 → mailto
function setupForm() {
  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const subject = encodeURIComponent(`[프로필 사이트] ${d.get('name')}님의 문의`);
    const body = encodeURIComponent(`${d.get('message')}\n\n보낸 사람: ${d.get('name')} (${d.get('email')})`);
    location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  renderSkills();
  renderProjects();
  typing();
  setupTheme();
  setupMenu();
  setupForm();
  setupScroll(); // 동적 요소 렌더링 이후에 관찰 시작
});
