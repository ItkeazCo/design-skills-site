// details.js calls toast(msg); the React <ToastHost> renders Graphite's Toast.
const subs = new Set();
export const onToast = (f) => { subs.add(f); return () => subs.delete(f); };
export const toast = (msg) => subs.forEach((f) => f(msg));
