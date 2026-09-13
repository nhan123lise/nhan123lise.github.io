// Active-section nav state, open-row wash sizing, mobile navigation dialog. No other JS by design.
(() => {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"], .nav-sheet a[href^="#"]')];
  const sections = [...document.querySelectorAll('main > section[id]')]; // #home (hero) clears the state
  const last = sections[sections.length - 1];

  const setCurrent = (id) => {
    for (const a of links) {
      if (a.hash === `#${id}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  };

  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

  // Sections crossing the upper-middle band; the last one in DOM order wins.
  const inBand = new Set();
  const update = () => {
    if (atBottom()) return setCurrent(last.id);
    const current = sections.filter((s) => inBand.has(s)).pop();
    if (current) setCurrent(current.id);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target);
      update();
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
  window.addEventListener('scroll', () => atBottom() && setCurrent(last.id), { passive: true });

  // Open rows: --band = summary + first evidence block height, so the wash covers exactly that.
  const bandRows = document.querySelectorAll('.xp-item, .rs-item--ccu');
  const sizeBands = () => bandRows.forEach((d) => {
    if (!d.open) return;
    const end = d.querySelector('.xp-evidence, .rs-approach') || d.querySelector('summary');
    d.style.setProperty('--band', `${end.getBoundingClientRect().bottom - d.getBoundingClientRect().top}px`);
  });
  const bandObserver = new ResizeObserver(sizeBands);
  bandRows.forEach((d) => bandObserver.observe(d));

  const dialog = document.querySelector('.nav-sheet');
  const trigger = document.querySelector('.menu-button');
  if (!dialog || !trigger) return;

  trigger.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.nav-sheet__close').addEventListener('click', () => dialog.close());
  // Escape / close button: the browser restores focus to the trigger on close.

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) return dialog.close(); // backdrop click
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    dialog.close(); // first: close() restores focus to the trigger synchronously
    history.pushState(null, '', link.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView();
  });
})();
