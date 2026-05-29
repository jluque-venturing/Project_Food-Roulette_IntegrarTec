import { initThemeUI, initAuthUI } from './ui.js';
import { initLang } from './lang.js';
import { injectAuthModal } from './auth-modal.js';
import { getCurrentUser } from './auth.js';

// El modal de login/registro se inyecta una sola vez (componente compartido)
injectAuthModal();
initLang();

function updateUserUI() {
    const currentUser = getCurrentUser();
    const loginOpenBtn = document.getElementById('login-open-btn');
    const favoritesBtn = document.getElementById('favorites-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userBtn = document.getElementById('user-btn');

    if (currentUser) {
        if (loginOpenBtn) loginOpenBtn.hidden = true;
        if (favoritesBtn) favoritesBtn.hidden = true;
        if (logoutBtn) logoutBtn.hidden = false;
        if (userBtn) userBtn.textContent = '👤 ' + currentUser;
    } else {
        if (loginOpenBtn) loginOpenBtn.hidden = false;
        if (favoritesBtn) favoritesBtn.hidden = true;
        if (logoutBtn) logoutBtn.hidden = true;
        if (userBtn) userBtn.textContent = '👤';
    }
}

initThemeUI({ toggleEl: document.getElementById('theme-toggle') });
initAuthUI({
    loginOpenBtn: document.getElementById('login-open-btn'),
    authModal: document.getElementById('auth-modal'),
    authCloseBtn: document.getElementById('auth-close-btn'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    loginMessage: document.getElementById('login-message'),
    registerMessage: document.getElementById('register-message'),
    userBtn: document.getElementById('user-btn'),
    userDropdown: document.getElementById('user-dropdown'),
    logoutBtn: document.getElementById('logout-btn'),
    favoritesBtn: document.getElementById('favorites-btn'),
    updateUserUI,
    renderFavorites: null,
});
updateUserUI();
