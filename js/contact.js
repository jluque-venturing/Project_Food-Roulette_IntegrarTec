import { initChrome } from './ui.js';
import { initLang } from './lang.js';
import { t } from './translator/translator.js';

// Navbar + footer + modal de login + tema + auth (todo compartido desde ui.js)
initChrome({ active: 'contact' });
initLang();

// ── Formulario de contacto ───────────────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(t("Thank you for your message! We'll get back to you soon."));
        form.reset();
    });
}
