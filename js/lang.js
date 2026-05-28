import { getLang, setLang, loadDictionary, translatePage } from './translator/translator.js';

async function toggleLang() {
  const next = getLang() === 'en' ? 'es' : 'en';
  setLang(next);
  await loadDictionary();
  translatePage();
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = next === 'en' ? 'ES' : 'EN';
}

function initLang() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.textContent = getLang() === 'en' ? 'ES' : 'EN';
  btn.addEventListener('click', toggleLang);
}

export { initLang };
