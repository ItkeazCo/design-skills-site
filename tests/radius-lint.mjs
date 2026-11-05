// Fails if app CSS/JS/JSX sets a radius that isn't a --r-* var (or 0 / max()/calc() of --r-* vars).
// Vendored Graphite CSS (src/graphite/) is the source of the tokens and is exempt.
import fs from 'fs'; import path from 'path';
const files = []; const walk = (d) => fs.readdirSync(d).forEach((f) => { const p = path.join(d, f); if (p.includes('graphite')) return; fs.statSync(p).isDirectory() ? walk(p) : /\.(css|js|jsx)$/.test(p) && files.push(p); });
walk(new URL('../src', import.meta.url).pathname);
const bad = [];
for (const f of files) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
  if (/^\s*--r-/.test(l)) return;
  for (const m of l.matchAll(/(border(?:-[a-z]+)*-radius|borderRadius)\s*[:=]\s*([^;}"']+)/g)) {
    const v = m[2].trim();
    if (/^0(px)?$/.test(v)) continue;
    const stripped = v.replace(/var\(--r-[a-z]+\)/g, '').replace(/var\(--[a-z-]+\)/g, (x) => (/--r-|--inset|--gap|--focus/.test(x) ? '' : x));
    if (/\d/.test(stripped.replace(/max\(0px,?/g, '').replace(/\b0(px)?\b/g, '').replace(/calc\(|[-+*/() ,]/g, '')) || /var\(--radius/.test(v)) bad.push(`${path.basename(f)}:${i + 1} ${m[0]}`);
  }
});
console.log(bad.length ? 'RADIUS LINT FAIL\n' + bad.join('\n') : 'RADIUS LINT OK (' + files.length + ' files)');
process.exit(bad.length ? 1 : 0);
