const LANG_KEY = 'lang';
const DEFAULT_LANG = 'en';

// Language codes must be lowercase
const AVAILABLE_LANGS = ['en', 'es'];

let dictionary = {};

// Remembers each element's original (English) aria-label so it can be
// re-translated on language switch without losing the original key.
const ariaOriginals = new WeakMap();

export function getLang() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

export function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
}

export async function loadDictionary() {
    const lang = getLang();
    if (lang === 'en') {
        dictionary = {};
        return;
    }
    if (AVAILABLE_LANGS.includes(lang.toLowerCase())) {
        const module = await import(`./translations/${lang}.js`);
        dictionary = module.default;
    }
}

export function t(key) {
    return dictionary[key] ?? key;
}

export function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        let key = element.getAttribute('data-translate');
        if (!key) {
            key = element.hasAttribute('placeholder')
                ? element.placeholder
                : element.textContent.trim();
            element.setAttribute('data-translate', key);
        }
        if (element.hasAttribute('placeholder')) {
            element.placeholder = t(key);
        } else {
            element.textContent = t(key);
        }
    });

    document.querySelectorAll('[data-translate-title]').forEach(element => {
        let key = element.getAttribute('data-translate-title');
        if (!key) {
            key = element.title;
            element.setAttribute('data-translate-title', key);
        }
        element.title = t(key);
    });

    // Automatically translate every aria-label, caching the original key.
    document.querySelectorAll('[aria-label]').forEach(element => {
        let key = ariaOriginals.get(element);
        if (key === undefined) {
            key = element.getAttribute('aria-label');
            ariaOriginals.set(element, key);
        }
        element.setAttribute('aria-label', t(key));
    });
}