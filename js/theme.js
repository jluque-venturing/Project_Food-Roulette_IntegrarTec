// ── Gestión de Tema (Light/Dark Mode) ────────────────

const THEME_KEY = 'fr_theme';

/**
 * Obtiene el tema actual (light o dark)
 */
function getTheme() {
  // Verificar preferencia guardada
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  
  // Verificar preferencia del sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Establece el tema y lo guarda
 */
function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return;
  
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  // Actualizar meta theme-color si existe
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
  }
}

/**
 * Alterna entre light y dark mode
 */
function toggleTheme() {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

/**
 * Inicializa el tema al cargar la página
 */
function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}

/**
 * Escucha cambios en preferencia del sistema
 */
function watchSystemTheme() {
  if (!window.matchMedia) return;
  
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', (e) => {
    // Solo cambiar si el usuario no ha guardado preferencia
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export {
  getTheme,
  setTheme,
  toggleTheme,
  initTheme,
  watchSystemTheme,
};
