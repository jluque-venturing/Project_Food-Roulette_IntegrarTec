import { getLang, setLang, loadDictionary, translatePage } from './translator/translator.js';

async function initLang(onAfterTranslate = null) {
  await loadDictionary();
  translatePage();
  onAfterTranslate?.();
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.textContent = getLang() === 'en' ? 'ES' : 'EN';
  btn.addEventListener('click', async () => {
    const next = getLang() === 'en' ? 'es' : 'en';
    setLang(next);
    await loadDictionary();
    translatePage();
    onAfterTranslate?.();
    btn.textContent = next === 'en' ? 'ES' : 'EN';
  });
}

export { initLang };
