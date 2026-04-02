// ─── Polyfill chrome.* ↔ browser.* ──────
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  globalThis.browser = chrome
} else if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
  globalThis.chrome = browser
}
