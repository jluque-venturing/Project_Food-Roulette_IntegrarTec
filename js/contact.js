import { initTheme, toggleTheme } from './theme.js';
import { initLang } from './lang.js';
import { t } from './translator/translator.js';
initLang();
import { logout, getCurrentUser, login, register } from './auth.js';

// Inicializar tema
initTheme();

// Referencias del DOM
const themeToggle = document.getElementById('theme-toggle');
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');
const loginOpenBtn = document.getElementById('login-open-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const logoutBtn = document.getElementById('logout-btn');
const authModal = document.getElementById('auth-modal');
const authCloseBtn = document.getElementById('auth-close-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

// Setup tema
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = toggleTheme();
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// Setup autenticación
function setupAuth() {
    // Modal login/register
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

    // Tab switching
    document.querySelectorAll('.auth-tab-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.auth-tab').forEach(t => t.hidden = true);
            document.getElementById(`${tab}-tab`).hidden = false;
            document.getElementById(`${tab}-message`).textContent = '';
        });
    });

    // Login form
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

    // Register form
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (password !== confirm) {
                registerMessage.textContent = '✗ Passwords do not match';
                registerMessage.classList.add('error');
                return;
            }
            
            const result = register(username, password);
            if (result.success) {
                registerMessage.textContent = '✓ ' + result.message;
                registerMessage.classList.remove('error');
                setTimeout(() => {
                    document.querySelectorAll('.auth-tab').forEach(t => t.hidden = true);
                    document.getElementById('login-tab').hidden = false;
                    registerForm.reset();
                }, 500);
            } else {
                registerMessage.textContent = '✗ ' + result.error;
                registerMessage.classList.add('error');
            }
        });
    }

    // User menu
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

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userDropdown.hidden = true;
        }
    });
}

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

// Setup formulario de contacto
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('Thank you for your message! We\'ll get back to you soon.'));
        form.reset();
    });
}

// Inicializar
setupAuth();
updateUserUI();