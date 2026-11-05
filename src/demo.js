// Live motion demos for the overlay: curve plot + a box that plays the easing. Transform/opacity only.
const bez = (x1, y1, x2, y2) => (x) => {
  // solve x(t) = x by Newton, return y(t)
  let t = x;
  for (let i = 0; i < 8; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
    const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
    if (Math.abs(d) < 1e-6) break;
    t = Math.min(1, Math.max(0, t - cx / d));
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
};
const NAMED = { ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1], linear: [0, 0, 1, 1] };
export function fn(ease) {
  if (NAMED[ease]) return bez(...NAMED[ease]);
  let m = ease.match(/cubic-bezier\(([^)]+)\)/);
  if (m) return bez(...m[1].split(',').map(Number));
  m = ease.match(/linear\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map(Number);
    return (x) => { const f = x * (p.length - 1), i = Math.floor(f); return i >= p.length - 1 ? p[p.length - 1] : p[i] + (p[i + 1] - p[i]) * (f - i); };
  }
  return (x) => x;
}

export function curveSvg(ease, cls = '', vs) {
  const W = 100, H = 100, pad = 10;
  const path = (e) => {
    const f = fn(e); let d = '';
    for (let i = 0; i <= 60; i++) { const x = i / 60; d += `${i ? 'L' : 'M'}${(pad + x * (W - 2 * pad)).toFixed(1)} ${(H - pad - f(x) * (H - 2 * pad)).toFixed(1)}`; }
    return d;
  };
  return `<svg class="curve ${cls}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <path class="c-axis" d="M${pad} ${pad}V${H - pad}H${W - pad}"/>
    ${vs ? `<path class="c-vs" d="${path(vs)}"/>` : ''}<path class="c-main" d="${path(ease)}"/></svg>`;
}

const lane = (d, cls) => `<div class="lane ${cls}"><span class="ball"></span></div><p class="lane-l meta">${d.label} · ${d.ms} ms</p>`;

export function demoHtml(d) {
  return `<div class="demo" data-demo='${JSON.stringify(d).replace(/'/g, '&#39;')}'>
    ${curveSvg(d.ease, 'big', d.vs?.ease)}
    <div class="lanes">${lane(d, 'a')}${d.vs ? lane(d.vs, 'b') : ''}
      <div class="demo-bar"><button class="pill-btn dark play">Play</button>
      <code class="meta ease-v">${d.ease.startsWith('linear(') ? 'linear() spring' : d.ease}</code></div></div>
  </div>`;
}

export function wireDemo(root) {
  const el = root.querySelector('.demo');
  if (!el) return;
  const d = JSON.parse(el.dataset.demo);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = (ball, x) => {
    const w = ball.parentElement.clientWidth - ball.offsetWidth;
    // reduced motion: show the timing as an opacity ramp instead of travel
    const kf = reduce ? [{ opacity: 0.2 }, { opacity: 1 }] : [{ transform: 'translateX(0)' }, { transform: `translateX(${w}px)` }];
    ball.getAnimations().forEach((a) => a.cancel());
    ball.animate(kf, { duration: x.ms, easing: x.ease, fill: 'forwards' });
  };
  const play = () => { run(el.querySelector('.a .ball'), d); if (d.vs) run(el.querySelector('.b .ball'), d.vs); };
  el.querySelector('.play').addEventListener('click', play);
  setTimeout(play, 250);
}
