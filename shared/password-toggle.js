// Adds a 👁️ show/hide button to every password field on the page.
function enhance(input) {
  if (input.dataset.pwToggle) return;
  input.dataset.pwToggle = '1';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;width:100%;';
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);
  input.style.paddingRight = '48px';
  input.style.width = '100%';
  input.style.boxSizing = 'border-box';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Show password');
  btn.textContent = '👁️';
  btn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;font-size:1.15rem;line-height:1;cursor:pointer;padding:6px;opacity:.75;';
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁️';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    input.focus();
  });
  wrap.appendChild(btn);
}

function scan() { document.querySelectorAll('input[type="password"]:not([data-pw-toggle])').forEach(enhance); }

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
}
