// ── Componente: barra de navegación y pie de página (compartidos) ─
// El mismo <header>/<nav> y <footer> estaban copiados en las 5 páginas.
// Ahora se inyectan desde acá. La página activa se marca con aria-current.

const LINKS = [
  { key: 'home',     href: 'index.html',          label: 'Home' },
  { key: 'roulette', href: 'pages/roulette.html', label: 'Roulette' },
  { key: 'about',    href: 'pages/about-us.html', label: 'About us' },
  { key: 'contact',  href: 'pages/contact.html',  label: 'Contact' },
];

// Prefijo de ruta: '' desde la raíz (index), '../' desde /pages/.
// Las rutas se guardan relativas a la raíz; '../' + 'pages/x.html' resuelve bien.
function basePath() {
  return location.pathname.includes('/pages/') ? '../' : '';
}

/**
 * Inyecta el <header> con la navegación al principio del <body>.
 * @param {{ active?: 'home'|'roulette'|'about'|'contact'|'' }} opts
 */
export function injectNavbar({ active = '' } = {}) {
  if (document.querySelector('.header')) return; // ya existe
  const base = basePath();

  const links = LINKS.map(({ key, href, label }) => {
    const current = key === active ? ' aria-current="page"' : '';
    return `<li><a href="${base}${href}"${current} data-translate>${label}</a></li>`;
  }).join('\n          ');

  const html = `
  <header class="header">
    <nav class="navbar" aria-label="Main navigation">
      <a href="${base}index.html" class="nav-brand">Food Roulette</a>
      <ul class="nav-links">
          ${links}
      </ul>
      <div class="nav-controls">
        <button class="theme-toggle" id="theme-toggle" title="Toggle dark mode" data-translate-title="Toggle dark mode">🌙</button>
        <button class="lang-toggle" id="lang-toggle" title="Change language" data-translate-title="Change language">ES</button>
        <div class="user-menu">
          <button class="user-btn" id="user-btn" title="User account" data-translate-title="User account">👤</button>
          <div class="user-dropdown" id="user-dropdown" hidden>
            <button class="user-menu-item" id="login-open-btn" data-translate>Login</button>
            <button class="user-menu-item" id="favorites-btn" hidden data-translate>❤️ Favorites</button>
            <button class="user-menu-item" id="logout-btn" hidden data-translate>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  </header>`;

  document.body.insertAdjacentHTML('afterbegin', html);
}

/** Inyecta el <footer> al final del <body>. */
export function injectFooter() {
  if (document.querySelector('.site-footer')) return; // ya existe
  const html = `
  <footer class="site-footer">
    <p data-translate>Made with love and lots of ingredients · Food Roulette 2026</p>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
