// Site motion, after apple-design-motion: critically damped springs (no bounce on chrome),
// interruptible (WAAPI cancels and restarts from the current frame), transform/opacity only
// (accordion height is the one tolerated exception). Tokens mirror --spring-* in style.css.
export const SPRING = 'linear(0, 0.032, 0.106, 0.2, 0.301, 0.4, 0.491, 0.573, 0.645, 0.708, 0.76, 0.805, 0.841, 0.872, 0.897, 0.917, 0.934, 0.947, 0.958, 0.967, 0.973, 0.979, 0.983, 0.987, 1)';
export const EXIT = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const DUR = { overlay: 380, exit: 220, small: 200, page: 180 };
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => matchMedia('(max-width: 860px)').matches;

// Cancel running animations without committing styles (commitStyles + fill: forwards left the
// dialog stuck at opacity 0 on the next open). Returns the current visual state so a new
// animation can start from it (interruptible).
export function stop(el) {
  const cs = getComputedStyle(el);
  const now = { opacity: cs.opacity, transform: cs.transform === 'none' ? 'none' : cs.transform };
  el.getAnimations().forEach((a) => a.cancel());
  el.style.removeProperty('opacity'); el.style.removeProperty('transform');
  return now;
}
export function clear(...els) { els.forEach((el) => { el.getAnimations().forEach((a) => a.cancel()); el.style.removeProperty('opacity'); el.style.removeProperty('transform'); }); }

export const motion = {
  overlayIn(dialog, backdrop, from) {
    const was = stop(dialog), bwas = stop(backdrop);
    const mid = was.opacity !== '1' && dialog.closest('.closing'); // reopened while closing: continue from here
    backdrop.animate([{ opacity: mid ? bwas.opacity : 0 }, { opacity: 1 }], { duration: DUR.small, easing: 'ease-out' });
    if (mid) return dialog.animate([was, { opacity: 1, transform: 'none' }], { duration: DUR.small + 60, easing: SPRING });
    if (reduce()) return dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR.small, easing: 'ease-out' });
    if (mobile()) return dialog.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: DUR.overlay, easing: SPRING });
    // grow from the clicked card: origin at the card centre, start slightly small
    const d = dialog.getBoundingClientRect();
    if (from) {
      const r = from.getBoundingClientRect();
      dialog.style.transformOrigin = `${r.left + r.width / 2 - d.left}px ${r.top + r.height / 2 - d.top}px`;
    } else dialog.style.transformOrigin = 'center';
    return dialog.animate([{ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'none' }], { duration: DUR.overlay, easing: SPRING });
  },
  overlayOut(dialog, backdrop) {
    const was = stop(dialog); stop(backdrop);
    const o = { duration: reduce() ? 120 : DUR.exit, easing: EXIT, fill: 'forwards' };
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], o);
    const kf = reduce() ? [{ opacity: 1 }, { opacity: 0 }]
      : mobile() ? [{ transform: 'none' }, { transform: 'translateY(100%)' }]
      : [{ opacity: was.opacity, transform: was.transform }, { opacity: 0, transform: 'scale(0.97)' }];
    return dialog.animate(kf, o).finished;
  },
  swap(body) {
    if (reduce()) return;
    body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR.small, easing: 'ease-out' });
  },
  // Route change: content fades and rises 8px on the spring; tiles stagger 30ms (max 12).
  page(main) {
    if (reduce()) { main.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR.page, easing: 'ease-out' }); return; }
    main.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: SPRING });
    [...main.querySelectorAll('.entries > *, .grid > *, .pal-grid > *, .fonts > *, .diag-grid > *')].slice(0, 12).forEach((el, i) => {
      el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 60 + i * 30, easing: SPRING, fill: 'backwards' });
    });
  },
  // Small "done" pop for copied labels (Copy for AI, Copy all, swatches).
  pop(el) {
    if (!el || reduce()) return;
    el.animate([{ transform: 'scale(0.92)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 180, easing: SPRING });
  },
};

// Accordion: animate <details> height open and closed. Interruptible: a second click mid-flight reverses.
document.addEventListener('click', (e) => {
  const sum = e.target.closest('details.group-block > summary, details.more > summary');
  if (!sum || reduce()) return;
  const det = sum.parentElement;
  e.preventDefault();
  const start = det.getBoundingClientRect().height;
  const closing = det.open && !det.dataset.closing;
  stop(det);
  if (closing) {
    det.dataset.closing = 1;
    const end = sum.getBoundingClientRect().height + parseFloat(getComputedStyle(det).paddingTop) + parseFloat(getComputedStyle(det).paddingBottom);
    det.style.overflow = 'hidden';
    const a = det.animate([{ height: start + 'px' }, { height: end + 'px' }], { duration: 180, easing: EXIT });
    [...det.children].filter((c) => c !== sum).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out', fill: 'forwards' }));
    a.onfinish = () => { det.open = false; delete det.dataset.closing; det.style.overflow = ''; [...det.children].forEach((c) => c.getAnimations().forEach((x) => x.cancel())); };
    a.oncancel = () => { delete det.dataset.closing; det.style.overflow = ''; };
  } else {
    delete det.dataset.closing;
    det.open = true;
    const end = det.getBoundingClientRect().height;
    det.style.overflow = 'hidden';
    const a = det.animate([{ height: start + 'px' }, { height: end + 'px' }], { duration: 300, easing: SPRING });
    a.onfinish = a.oncancel = () => { det.style.overflow = ''; };
    [...det.children].filter((c) => c !== sum).forEach((c) => c.animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 40, easing: SPRING, fill: 'backwards' }));
  }
});
