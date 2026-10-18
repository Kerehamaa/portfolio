// portfolio.kerehama.nz site script: cursor glow, star map menu, theme toggle.

// Cursor glow follow
const glow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});

// Hide on touch devices
if ('ontouchstart' in window) {
  if (glow) glow.style.display = 'none';
}

const btn = document.querySelector('.starmap-toggle');
const panel = document.getElementById('starmap-panel');
const btnIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><line x1="6" y1="6" x2="18" y2="6"/><line x1="6" y1="6" x2="12" y2="18"/><line x1="18" y1="6" x2="18" y2="18"/></svg>`;
const closeIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
function closePanel() {
  panel?.classList.remove('open');
  btn?.setAttribute('aria-expanded', 'false');
  if (btn) btn.innerHTML = btnIcon;
}

btn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = panel.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
  btn.innerHTML = open ? closeIcon : btnIcon;
});

// Close panel on outside click
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.closest('.starmap-wrapper')) {
    closePanel();
  }
});

// Close panel when any link inside is clicked
panel?.addEventListener('click', (e) => {
  const target = e.target;
  const link = target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    closePanel();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else {
    // External link: just close the panel, let the browser handle navigation
    closePanel();
  }
});

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.add('theme-transitioning');

  if (newTheme === 'light') {
    themeToggle.classList.add('contracting');
    setTimeout(() => { root.setAttribute('data-theme', newTheme); }, 100);
    setTimeout(() => {
      themeToggle.classList.remove('contracting');
      setTimeout(() => { document.body.classList.remove('theme-transitioning'); }, 500);
    }, 600);
  } else {
    themeToggle.classList.add('expanding');
    setTimeout(() => {
      root.setAttribute('data-theme', newTheme);
      setTimeout(() => {
        themeToggle.classList.remove('expanding');
        setTimeout(() => { document.body.classList.remove('theme-transitioning'); }, 500);
      }, 500);
    }, 200);
  }
  localStorage.setItem('theme', newTheme);
});

var year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
