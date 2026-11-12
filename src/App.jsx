import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { Button, IconButton, Input, Kbd, SegmentedControl, Toast, Icon } from './graphite/react/index.js';
import { skills, categories } from './skills/index.js';
import { motion, clear } from './motion.js';
import { details, loadFont } from './render.js';
import * as overlay from './overlay.js';
import { onToast } from './toastbus.js';
import { markdown } from './markdown.js';
import { home, overview, section, toMarkdown, short } from './pages.js';
import { UiPage } from './ui.jsx';
import { copy } from './details.js';
import story from '../docs/STORY.md?raw';

// Routes: #/  ·  #/<skill>  ·  #/<skill>/<section>  ·  #/story  ·  #/ui  (+ ?p=<detail id>)
const parse = () => location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
const basePath = () => location.hash.split('?')[0] || '#/';
const param = () => new URLSearchParams(location.hash.split('?')[1] || '').get('p');
const text = (o) => JSON.stringify(o).toLowerCase();

function useHash() {
  const [h, set] = useState(location.hash);
  useEffect(() => { const f = () => set(location.hash); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return h;
}

function openDetail(set, i, from) {
  const list = details[set];
  if (!list || !list[i]) return;
  overlay.open(list, i, {
    onChange: (it) => history.replaceState(null, '', `${basePath()}?p=${it.id}`),
    onClose: () => history.replaceState(null, '', basePath()),
    from,
  });
}
function openFromHash() {
  const id = param();
  if (!id) { overlay.close(true); return; }
  for (const [set, list] of Object.entries(details)) {
    const i = list.findIndex((x) => x.id === id);
    if (i > -1) return openDetail(set, i);
  }
}

// ---------- Theme ----------
function useTheme() {
  const [t, set] = useState(() => localStorage.getItem('theme') || document.documentElement.dataset.theme || 'auto');
  useEffect(() => {
    if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t;
    localStorage.setItem('theme', t);
  }, [t]);
  return [t, set];
}
const THEMES = [{ value: 'auto', label: 'Auto' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }];

// ---------- Top bar: logo · centred search · More options (Radix Popover, Graphite styling) ----------
function Topbar({ q, setQ, slug, navOpen, setNavOpen, theme, setTheme }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const k = (e) => {
      if (overlay.isOpen()) return;
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) { e.preventDefault(); ref.current?.focus(); }
      if (e.key === 'Escape' && document.activeElement === ref.current) { setQ(''); ref.current.blur(); }
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [setQ]);
  const go = (h) => () => { setOpen(false); location.hash = h; };
  return (
    <header className="topbar">
      <a className="brand" href="#/">Design skills</a>
      <div className="top-search" onPointerDown={(e) => { if (e.target !== ref.current) { e.preventDefault(); ref.current?.focus(); } }}>
        <Input ref={ref} type="search" aria-label="Search skills" placeholder="Search" autoComplete="off" icon="search"
          value={q} onChange={(e) => setQ(e.target.value)} suffix={<Kbd>/</Kbd>} />
      </div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button type="button" className="gt-iconbtn gt-iconbtn--md more-btn" aria-label="More options"><Icon name="menu" size={20} /></button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="more-menu" align="end" sideOffset={8} aria-label="More options">
            <button className="mi" aria-current={!slug ? 'page' : undefined} onClick={go('#/')}>Library</button>
            <button className="mi" aria-current={slug === 'story' ? 'page' : undefined} onClick={go('#/story')}>About</button>
            <button className="mi" aria-current={slug === 'ui' ? 'page' : undefined} onClick={go('#/ui')}>UI</button>
            <button className="mi mi-skills" aria-expanded={navOpen} aria-controls="tree" onClick={() => { setNavOpen(!navOpen); setOpen(false); }}>Skills <span className="meta">{navOpen ? 'Hide' : 'Show'}</span></button>
            <div className="sep" role="separator" />
            <div className="mi-theme"><span className="lab" id="theme-lab">Mode</span>
              <SegmentedControl className="theme-seg" label="Mode" size="md" options={THEMES} value={theme} onChange={setTheme} />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </header>
  );
}

// Sections stay mounted so the open and close can move. Closed ones are inert.
function Leaves({ open, children }) {
  const ref = useRef(null);
  useLayoutEffect(() => { if (ref.current) ref.current.inert = !open; }, [open]);
  return (
    <div ref={ref} className={'leaves' + (open ? ' is-open' : '')}>
      <div className="leaves-in">{children}</div>
    </div>
  );
}

// ---------- Sidebar tree ----------
function Tree({ q, slug, sec, open, toggle }) {
  const term = q.trim().toLowerCase();
  const cats = categories.map((c) => {
    const items = skills.filter((s) => s.category === c).map((s) => {
      const secs = s.sections.filter((x) => !term || text(x).includes(term));
      if (term && !secs.length && !text(s).includes(term)) return null;
      const expanded = !!term || open.has(s.slug);
      const here = s.slug === slug;
      return (
        <div className="branch" key={s.slug}>
          <div className="node-row">
            <a className={`node skill ${here && !sec ? 'current' : ''} ${here ? 'in' : ''}`} aria-current={here && !sec ? 'page' : undefined} href={`#/${s.slug}`}>
              <span className="dot" style={{ background: s.accent }} /><span>{short(s)}</span>
            </a>
            <IconButton className="toggle" size="sm" icon={expanded ? 'minus' : 'plus'} aria-expanded={expanded}
              label={`${expanded ? 'Hide' : 'Show'} ${s.title} sections`} onClick={() => toggle(s.slug)} />
          </div>
          <Leaves open={expanded}>
            {secs.map((x) => (
              <a key={x.id} className={`node leaf ${here && sec === x.id ? 'current' : ''}`} aria-current={here && sec === x.id ? 'page' : undefined} href={`#/${s.slug}/${x.id}`} title={x.short ? x.title : undefined}>{short(x)}</a>
            ))}
          </Leaves>
        </div>
      );
    }).filter(Boolean);
    return items.length ? <div className="cat" key={c}><h2 className="cat-h">{c}</h2>{items}</div> : null;
  }).filter(Boolean);
  // One marker that slides between items (instead of a per-item bar).
  const navRef = useRef(null), mark = useRef(null);
  useLayoutEffect(() => {
    const nav = navRef.current, m = mark.current; if (!nav || !m) return;
    const place = () => {
      const cur = nav.querySelector('.leaves.is-open .leaf.current');
      if (!cur) { m.style.opacity = 0; return; }
      const n = nav.getBoundingClientRect(), r = cur.getBoundingClientRect(), g = cur.parentElement.getBoundingClientRect();
      const first = m.style.opacity !== '1';
      if (first) m.style.transition = 'none';
      m.style.transform = `translate(${g.left - n.left}px, ${r.top - n.top + 8}px)`;
      m.style.height = `${r.height - 16}px`; m.style.opacity = 1;
      if (first) { m.getBoundingClientRect(); m.style.transition = ''; }
    };
    place();
    const onEnd = (e) => { if (e.target.classList?.contains('leaves')) place(); };
    nav.addEventListener('transitionend', onEnd);
    return () => nav.removeEventListener('transitionend', onEnd);
  });
  return <nav id="tree" ref={navRef} aria-label="Skills"><span className="tree-marker" ref={mark} aria-hidden="true" />{cats.length ? cats : <p className="empty">No matches</p>}</nav>;
}

// ---------- Main content (data-driven HTML) ----------
function Main({ hash }) {
  const ref = useRef(null);
  const lastBase = useRef(null);
  const isUi = hash.split('|')[0].replace(/^#\/?/, '').split('/')[0] === 'ui';
  useLayoutEffect(() => {
    if (isUi) return;
    if (basePath() === lastBase.current) { openFromHash(); return; }
    lastBase.current = basePath();
    overlay.close(true);
    const [slug, sec] = parse();
    const s = skills.find((k) => k.slug === slug);
    const main = ref.current;
    main.style.setProperty('--skill', s ? s.accent : 'transparent');
    if (slug === 'story') main.innerHTML = `<article class="story">${markdown(story)}</article>`;
    else if (!s) main.innerHTML = home();
    else { const x = s.sections.find((k) => k.id === sec); main.innerHTML = x ? section(s, x) : overview(s); }
    window.scrollTo(0, 0);
    motion.page(main);
    openFromHash();
  }, [hash, isUi]);
  useEffect(() => {
    if (isUi) return;
    const main = ref.current;
    let scrub = null;
    const place = (e) => {
      const box = scrub.getBoundingClientRect();
      if (!box.width) return;
      const p = Math.min(100, Math.max(0, Math.round(((e.clientX - box.left) / box.width) * 100)));
      scrub.style.setProperty('--p', String(p));
      const range = scrub.querySelector('.cmp-range');
      if (range) range.value = String(p);
    };
    const down = (e) => {
      const cmp = e.target.closest?.('.cmp');
      if (!cmp || (e.pointerType === 'mouse' && e.button !== 0)) return;
      scrub = cmp;
      cmp.classList.add('is-scrub');
      e.preventDefault();
      place(e);
    };
    const move = (e) => { if (scrub) place(e); };
    const up = () => { if (!scrub) return; scrub.classList.remove('is-scrub'); scrub = null; };
    const click = (e) => {
      if (e.target.closest('.cmp')) { e.preventDefault(); return; }
      const mp = e.target.closest('.mini-play');
      if (mp) {
        const ball = mp.parentElement.querySelector('.mini-ball'), lane = ball.parentElement;
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        ball.getAnimations().forEach((a) => a.cancel());
        ball.animate(reduce ? [{ opacity: 0.2 }, { opacity: 1 }] : [{ transform: 'translateX(0)' }, { transform: `translateX(${lane.clientWidth - ball.offsetWidth}px)` }], { duration: +mp.dataset.ms, easing: mp.dataset.ease, fill: 'forwards' });
        return;
      }
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        const bar = tab.closest('[role="tablist"]');
        const root = bar.parentElement;
        bar.querySelectorAll('[data-tab]').forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-on', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        root.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
        return;
      }
      const ai = e.target.closest('[data-ai]');
      if (ai) { copy(toMarkdown(ai.dataset.ai), ai); return; }
      const b = e.target.closest('.opens');
      if (b) openDetail(b.dataset.set, +b.dataset.i, b);
    };
    const peek = (e) => { const f = e.target.closest?.('.font'); if (f && !f.dataset.loaded) { f.dataset.loaded = 1; const n = f.querySelector('[data-font]'); loadFont(n.dataset.font, n); } };
    const change = (e) => { if (e.target.matches('.check input')) e.target.closest('.check').classList.toggle('done', e.target.checked); };
    const onRange = (e) => { const r = e.target; if (!r.classList?.contains('cmp-range')) return; r.parentElement.style.setProperty('--p', r.value); };
    main.addEventListener('click', click); main.addEventListener('mouseover', peek); main.addEventListener('focusin', peek); main.addEventListener('change', change); main.addEventListener('input', onRange);
    main.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    return () => { main.removeEventListener('click', click); main.removeEventListener('mouseover', peek); main.removeEventListener('focusin', peek); main.removeEventListener('change', change); main.removeEventListener('input', onRange); main.removeEventListener('pointerdown', down); removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  }, [isUi]);
  if (isUi) return <UiPage />;
  return <main id="main" ref={ref} />;
}

// ---------- Detail overlay: Radix Dialog (focus trap, aria) styled as Graphite Dialog ----------
function Overlay() {
  const [st, setSt] = useState(overlay.get());
  const [closing, setClosing] = useState(false);
  const dialog = useRef(null), scrim = useRef(null), body = useRef(null);
  useEffect(() => overlay.subscribe((s, c) => { setSt(s); setClosing(c); }), []);
  const shown = useRef(null), wasOpen = useRef(false);
  // Radix Portal mounts the content one commit later, so track the node to run the entry animation.
  const [node, setNode] = useState(null);
  const dialogRef = useCallback((n) => { dialog.current = n; setNode(n); }, []);
  if (st) shown.current = st;
  const cur = st || (closing ? shown.current : null);
  const it = cur?.list[cur.i];

  useLayoutEffect(() => {
    if (!st || !dialog.current) { wasOpen.current = false; return; }
    // Animate on the first frame the dialog is shown. (st.first alone was lost when the
    // hash-sync re-open batched into the same render, so the grow never ran.)
    const entering = !wasOpen.current || st.first; wasOpen.current = true;
    if (entering) motion.overlayIn(dialog.current, scrim.current, st.from);
    else if (st.swap) motion.swap(body.current);
    dialog.current.scrollTop = 0;
    it.onMount?.(dialog.current);
    st.onChange?.(it);
    dialog.current.querySelector(".ov-nav [aria-label=Close]")?.focus({ preventScroll: true });
  }, [st, node]);
  useEffect(() => {
    if (!closing || !dialog.current) return;
    const d = dialog.current, b = scrim.current;
    motion.overlayOut(d, b).then(() => { clear(d, b); d.style.removeProperty('transform-origin'); overlay.done(); }, () => {});
  }, [closing]);
  useEffect(() => {
    document.body.classList.toggle('ov-open', !!st);
    if (!st) return;
    const k = (e) => {
      if (e.target.matches?.('input,textarea')) return;
      if (e.key === 'ArrowLeft') overlay.go(-1);
      if (e.key === 'ArrowRight') overlay.go(1);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [!!st]);
  if (!cur) return null;
  const { list, i } = cur;
  const rel = (it.related || list.map((_, j) => j).filter((j) => j !== i).sort((a, b) => Math.abs(a - i) - Math.abs(b - i)).slice(0, 5)).slice(0, 6);
  return (
    <Dialog.Root open={!!st} onOpenChange={(o) => { if (!o) overlay.close(); }} modal>
      <Dialog.Portal forceMount>
        <div className={'ov-root' + (closing && !st ? ' closing' : '')}>
          <Dialog.Overlay forceMount ref={scrim} className="ov-backdrop" />
          <Dialog.Content forceMount ref={dialogRef} className="ov-dialog gt-dialog" aria-describedby={undefined}
            onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}
            onClick={(e) => { if (e.target.closest('a[href^="#/"]')) overlay.close(true); }}>
            <header className="ov-bar gt-dialog__head">
              <Dialog.Title className="ov-title gt-dialog__title">{it.title}</Dialog.Title>
              <div className={'ov-nav' + (list.length < 2 ? ' single' : '')}>
                <IconButton icon="arrow-left" label="Previous" disabled={i === 0} onClick={() => overlay.go(-1)} />
                <IconButton icon="arrow-right" label="Next" disabled={i === list.length - 1} onClick={() => overlay.go(1)} />
                <IconButton icon="x" label="Close" onClick={() => overlay.close()} />
              </div>
            </header>
            {it.actions ? <div className="ov-acts" dangerouslySetInnerHTML={{ __html: it.actions }} /> : null}
            <div className="ov-body" ref={body} dangerouslySetInnerHTML={{ __html: it.html }} />
            {rel.length ? (
              <section className="ov-rel" aria-label="Related">
                <h3 className="ov-h">Related</h3>
                <div className="rel-row">
                  {rel.map((j) => (
                    <button key={list[j].id} className="rel" onClick={() => overlay.to(j)}>
                      <span dangerouslySetInnerHTML={{ __html: list[j].thumb || '' }} /><span>{list[j].title}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ---------- Toast host: Graphite Toast, one at a time, past tense copy ----------
function ToastHost() {
  const [msg, setMsg] = useState(null);
  const [show, setShow] = useState(false);
  const t = useRef();
  useEffect(() => onToast((m) => { setMsg(m); setShow(true); clearTimeout(t.current); t.current = setTimeout(() => setShow(false), 1600); }), []);
  return <div className={'toast-host' + (show ? ' show' : '')} aria-live="polite">{msg ? <Toast>{msg}</Toast> : null}</div>;
}

const GATE_KEY = 'ds-gate';
const entered = () => { try { return localStorage.getItem(GATE_KEY) === '1'; } catch { return false; } };

function Gate({ onEnter }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (code.trim() === '9686') {
      try { localStorage.setItem(GATE_KEY, '1'); } catch { /* private mode still enters this visit */ }
      onEnter();
    } else setError('That code is not right.');
  };
  return (
    <main className="gate">
      <form onSubmit={submit}>
        <h1>Design skills</h1>
        <p className="lede">Enter the code to continue.</p>
        <Input label="Code" value={code} error={error} inputMode="numeric" autoComplete="off" autoFocus onChange={(e) => { setCode(e.target.value); if (error) setError(''); }} />
        <Button type="submit" variant="primary" size="md">Enter</Button>
      </form>
    </main>
  );
}

export function App() {
  const [allowed, setAllowed] = useState(entered);
  const hash = useHash();
  const [slug, sec] = parse();
  const [q, setQ] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const [open, setOpen] = useState(() => new Set(slug ? [slug] : []));
  const lastSlug = useRef(slug);
  useEffect(() => {
    setNavOpen(false);
    if (slug && slug !== lastSlug.current && skills.some((s) => s.slug === slug)) setOpen(new Set([slug]));
    lastSlug.current = slug;
  }, [hash]);
  useEffect(() => { document.body.classList.toggle('nav-open', navOpen); }, [navOpen]);
  const toggle = useCallback((s) => setOpen((o) => { const n = new Set(o); n.has(s) ? n.delete(s) : n.add(s); return n; }), []);
  if (!allowed) return <Gate onEnter={() => setAllowed(true)} />;
  return (
    <>
      <Topbar {...{ q, setQ, slug, navOpen, setNavOpen, theme, setTheme }} />
      <aside className="sidebar">
        <Tree {...{ q, slug, sec, open, toggle }} />
        <SegmentedControl className="side-theme" label="Theme" size="md" options={THEMES} value={theme} onChange={setTheme} />
      </aside>
      <Main hash={hash.split('?')[0] + '|' + hash} />
      <Overlay />
      <ToastHost />
    </>
  );
}
