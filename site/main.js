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

  // Print: open every disclosure so collapsed content prints, then restore.
  const printOpened = [];
  window.addEventListener('beforeprint', () => document.querySelectorAll('details:not([open])').forEach((d) => { printOpened.push(d); d.open = true; }));
  window.addEventListener('afterprint', () => printOpened.splice(0).forEach((d) => { d.open = false; }));

  const dialog = document.querySelector('.nav-sheet');
  const trigger = document.querySelector('.menu-button');
  if (!dialog || !trigger) return;

  trigger.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.nav-sheet__close').addEventListener('click', () => dialog.close());
  // Escape / close button: the browser restores focus to the trigger on close.
  // WebKit: clicked buttons aren't focused, so nothing is restored. Its own focus-fallback-to-body
  // lands a frame after 'close' fires, so wait two rAFs before checking (measured: still stale after 0/1).
  dialog.addEventListener('close', () => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (document.activeElement === document.body) trigger.focus();
  })));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      // Backdrop only: clicks on the sheet's own padding also target the dialog.
      const r = dialog.getBoundingClientRect();
      const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
      if (outside) dialog.close();
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    dialog.close(); // first: close() restores focus to the trigger synchronously
    history.pushState(null, '', link.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView();
  });
})();
