import { initTheme as themeInit, toggleTheme } from './theme.js';
import { login, register, logout, getCurrentUser, getFavorites } from './auth.js';
import { t } from './translator/translator.js';

// Inicializa el control del tema usando un elemento toggle (botón)
export function initThemeUI({ toggleEl } = {}) {
  // Asegurar que el estado del tema esté sincronizado
  themeInit();

  if (!toggleEl) return;

  toggleEl.addEventListener('click', () => {
    const theme = toggleTheme();
    toggleEl.textContent = theme === 'dark' ? '☀️' : '🌙';
  });

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  toggleEl.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// Inicializa la UI de autenticación. Recibe referencias a elementos y callbacks para actualizar UI locales.
export function initAuthUI({
  loginOpenBtn,
  authModal,
  authCloseBtn,
  loginForm,
  registerForm,
  loginMessage,
  registerMessage,
  userBtn,
  userDropdown,
  logoutBtn,
  favoritesBtn,
  favoritesModal,
  favoritesCloseBtn,
  updateUserUI,
  renderFavorites,
} = {}) {
  function clearAuthMessages() {
    if (loginMessage)    { loginMessage.textContent = '';    loginMessage.classList.remove('error'); }
    if (registerMessage) { registerMessage.textContent = ''; registerMessage.classList.remove('error'); }
  }

  // Modal open/close con manejo de foco (diálogo accesible)
  let authPrevFocus = null;

  // Elementos enfocables visibles dentro del modal (excluye la pestaña oculta)
  function authFocusables() {
    if (!authModal) return [];
    return [...authModal.querySelectorAll('button, input, select, textarea, [href]')]
      .filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function openAuthModal() {
    if (!authModal) return;
    authPrevFocus = document.activeElement;   // recordar quién abrió
    authModal.hidden = false;
    clearAuthMessages();
    authFocusables()[0]?.focus();             // mover el foco al modal
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.hidden = true;
    clearAuthMessages();
    authPrevFocus?.focus?.();                 // devolver el foco al disparador
  }

  loginOpenBtn?.addEventListener('click', openAuthModal);
  authCloseBtn?.addEventListener('click', closeAuthModal);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Focus trap + Escape para cerrar
  authModal?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeAuthModal(); return; }
    if (e.key !== 'Tab') return;
    const f = authFocusables();
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Tab switching
  document.querySelectorAll('.auth-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.auth-tab').forEach(t => t.hidden = true);
      const el = document.getElementById(`${tab}-tab`);
      if (el) { el.hidden = false; el.querySelector('input')?.focus(); }
      const msg = document.getElementById(`${tab}-message`);
      if (msg) msg.textContent = '';
    });
  });

  // Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameEl = loginForm.querySelector('#login-username');
    const passwordEl = loginForm.querySelector('#login-password');
    const username = usernameEl?.value;
    const password = passwordEl?.value;

    const result = login(username, password);
    if (result.success) {
      if (loginMessage) {
        loginMessage.textContent = '✓ ' + result.message;
        loginMessage.classList.remove('error');
      }
      setTimeout(() => {
        if (authModal) authModal.hidden = true;
        loginForm.reset();
        clearAuthMessages();
        updateUserUI?.();
      }, 500);
    } else {
      if (loginMessage) {
        loginMessage.textContent = '✗ ' + result.error;
        loginMessage.classList.add('error');
      }
    }
  });

  // Register
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameEl = registerForm.querySelector('#register-username');
    const passwordEl = registerForm.querySelector('#register-password');
    const confirmEl = registerForm.querySelector('#register-confirm');
    const username = usernameEl?.value;
    const password = passwordEl?.value;
    const confirm = confirmEl?.value;

    if (password !== confirm) {
      if (registerMessage) {
        registerMessage.textContent = `✗ ${t('Passwords do not match')}`;
        registerMessage.classList.add('error');
      }
      return;
    }

    const result = register(username, password);
    if (result.success) {
      if (registerMessage) {
        registerMessage.textContent = '✓ ' + result.message;
        registerMessage.classList.remove('error');
      }
      setTimeout(() => {
        document.querySelectorAll('.auth-tab').forEach(t => t.hidden = true);
        const loginTab = document.getElementById('login-tab');
        if (loginTab) loginTab.hidden = false;
        registerForm.reset();
      }, 500);
    } else {
      if (registerMessage) {
        registerMessage.textContent = '✗ ' + result.error;
        registerMessage.classList.add('error');
      }
    }
  });

  // User menu toggle
  userBtn?.addEventListener('click', () => {
    if (userDropdown) userDropdown.hidden = !userDropdown.hidden;
  });

  logoutBtn?.addEventListener('click', () => {
    logout();
    updateUserUI?.();
    if (userDropdown) userDropdown.hidden = true;
  });

  // Favorites modal
  favoritesBtn?.addEventListener('click', () => {
    if (favoritesModal) {
      favoritesModal.hidden = false;
      renderFavorites?.();
    }
  });
  favoritesCloseBtn?.addEventListener('click', () => { if (favoritesModal) favoritesModal.hidden = true; });
  favoritesModal?.addEventListener('click', (e) => { if (e.target === favoritesModal) favoritesModal.hidden = true; });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu') && userDropdown) userDropdown.hidden = true;
  });
}
