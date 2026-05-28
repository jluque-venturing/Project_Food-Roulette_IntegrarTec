import { initTheme, toggleTheme } from './theme.js';
import { initLang } from './lang.js';
import { t } from './translator/translator.js';
import { logout, getCurrentUser, login, register } from './auth.js';

initTheme();
initLang();

const themeToggle = document.getElementById('theme-toggle');
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');
const loginOpenBtn = document.getElementById('login-open-btn');
const logoutBtn = document.getElementById('logout-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const authModal = document.getElementById('auth-modal');
const authCloseBtn = document.getElementById('auth-close-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = toggleTheme();
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

if (loginOpenBtn) {
    loginOpenBtn.addEventListener('click', () => {
        authModal.hidden = false;
    });
}
if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
        authModal.hidden = true;
    });
}
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.hidden = true;
    });
}

document.querySelectorAll('.auth-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.auth-tab').forEach(el => el.hidden = true);
        document.getElementById(`${tab}-tab`).hidden = false;
        document.getElementById(`${tab}-message`).textContent = '';
    });
});

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const result = login(username, password);
        if (result.success) {
            loginMessage.textContent = '✓ ' + result.message;
            loginMessage.classList.remove('error');
            setTimeout(() => {
                authModal.hidden = true;
                loginForm.reset();
                updateUserUI();
            }, 500);
        } else {
            loginMessage.textContent = '✗ ' + result.error;
            loginMessage.classList.add('error');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        if (password !== confirm) {
            registerMessage.textContent = `✗ ${t('Passwords do not match')}`;
            registerMessage.classList.add('error');
            return;
        }
        const result = register(username, password);
        if (result.success) {
            registerMessage.textContent = '✓ ' + result.message;
            registerMessage.classList.remove('error');
            setTimeout(() => {
                document.querySelectorAll('.auth-tab').forEach(el => el.hidden = true);
                document.getElementById('login-tab').hidden = false;
                registerForm.reset();
            }, 500);
        } else {
            registerMessage.textContent = '✗ ' + result.error;
            registerMessage.classList.add('error');
        }
    });
}

if (userBtn) {
    userBtn.addEventListener('click', () => {
        userDropdown.hidden = !userDropdown.hidden;
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout();
        updateUserUI();
        userDropdown.hidden = true;
    });
}
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        userDropdown.hidden = true;
    }
});

function updateUserUI() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        loginOpenBtn.hidden = true;
        favoritesBtn.hidden = true;
        logoutBtn.hidden = false;
        userBtn.textContent = '👤 ' + currentUser;
    } else {
        loginOpenBtn.hidden = false;
        favoritesBtn.hidden = true;
        logoutBtn.hidden = true;
        userBtn.textContent = '👤';
    }
}

updateUserUI();
