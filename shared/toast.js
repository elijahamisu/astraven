// Global notice toasts. Any page's .alert-banner (error/success) is mirrored as a
// toast pinned to the top of the screen, so messages are seen even when the
// banner is scrolled out of view. Also: window.showToast(msg, type).
const STYLE_ID = 'astra-toast-style';

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    #astraToastWrap { position: fixed; top: 12px; left: 50%; transform: translateX(-50%); z-index: 100000;
      width: min(92vw, 460px); display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
    .astra-toast { pointer-events: auto; display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
      border-radius: 12px; font: 600 0.9rem/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,0.18); animation: astraToastIn .25s ease-out; }
    .astra-toast.error { background: #FDE8E8; color: #B42318; border: 1px solid #F04438; }
    .astra-toast.success { background: #E6F8EF; color: #067647; border: 1px solid #12B76A; }
    .astra-toast.info { background: #FFF8E1; color: #7A5B00; border: 1px solid #D4A72C; }
    .astra-toast span { flex: 1; }
    .astra-toast button { background: none; border: 0; font-size: 1.1rem; line-height: 1; color: inherit; cursor: pointer; padding: 0 2px; }
    @keyframes astraToastIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(s);
}

function wrap() {
  let w = document.getElementById('astraToastWrap');
  if (!w) { w = document.createElement('div'); w.id = 'astraToastWrap'; w.setAttribute('role', 'status'); w.setAttribute('aria-live', 'assertive'); document.body.appendChild(w); }
  return w;
}

export function showToast(message, type = 'error', ms = 6000) {
  if (!message || typeof document === 'undefined' || !document.body) return;
  ensureStyle();
  const w = wrap();
  [...w.children].forEach((c) => { if (c.dataset.msg === message) c.remove(); });
  const t = document.createElement('div');
  t.className = `astra-toast ${type}`;
  t.dataset.msg = message;
  const span = document.createElement('span');
  span.textContent = message;
  const close = document.createElement('button');
  close.type = 'button'; close.setAttribute('aria-label', 'Dismiss'); close.textContent = '×';
  close.onclick = () => t.remove();
  t.append(span, close);
  w.appendChild(t);
  while (w.children.length > 3) w.firstChild.remove();
  setTimeout(() => t.remove(), type === 'error' ? Math.max(ms, 8000) : ms);
}

function bannerType(el) {
  if (el.classList.contains('error')) return 'error';
  if (el.classList.contains('success')) return 'success';
  return null;
}

function check(el) {
  const type = bannerType(el);
  const text = (el.textContent || '').trim();
  if (!type || !text || getComputedStyle(el).display === 'none') return;
  const key = type + '|' + text;
  if (el.__astraLast === key) return;
  el.__astraLast = key;
  showToast(text, type);
}

function watchBanners() {
  const seen = new WeakSet();
  const hook = (el) => {
    if (seen.has(el)) return;
    seen.add(el);
    new MutationObserver((muts) => {
      const contentChanged = muts.some((m) => m.type !== 'attributes' || m.attributeName === 'class');
      const type = bannerType(el);
      const text = (el.textContent || '').trim();
      if (!type || !text) { el.__astraLast = null; return; }
      if (contentChanged) {
        // A new message was set: make sure an old inline display:none doesn't hide it.
        if (el.style.display === 'none') el.style.display = '';
        el.__astraLast = null;
      }
      check(el);
    })
      .observe(el, { attributes: true, attributeFilter: ['class', 'style'], childList: true, characterData: true, subtree: true });
  };
  const scan = () => document.querySelectorAll('.alert-banner, [id$="alertBanner"], [id$="AlertBanner"]').forEach(hook);
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.showToast = showToast;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchBanners);
  else watchBanners();
}
