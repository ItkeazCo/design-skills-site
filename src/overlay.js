// Overlay store: the imperative API the page code uses (open/close/isOpen).
// The UI is the React <Overlay> (Radix Dialog + Graphite), which subscribes here.
let state = null, closing = false;
const subs = new Set();
const emit = () => subs.forEach((f) => f(state, closing));
export const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
export const get = () => state;
export function open(list, i, { onChange, onClose, from } = {}) {
  const first = !state || closing;
  closing = false;
  state = { list, i, onChange, onClose, from: from || document.activeElement?.closest?.('.opens'), first, lastFocus: first ? document.activeElement : state.lastFocus };
  emit();
}
export function go(d) {
  if (!state) return;
  const n = state.i + d;
  if (n < 0 || n >= state.list.length) return;
  state = { ...state, i: n, first: false, swap: true }; emit();
}
export function to(i) { if (state) { state = { ...state, i, first: false, swap: true }; emit(); } }
// silent: route change, no animation and no onClose callback
export function close(silent) {
  if (!state) return;
  const s = state;
  state = null; closing = !silent;
  emit();
  if (!silent) s.onClose?.();
  if (s.lastFocus && document.contains(s.lastFocus)) s.lastFocus.focus({ preventScroll: true });
}
export function done() { closing = false; emit(); }
export const isOpen = () => !!state;
