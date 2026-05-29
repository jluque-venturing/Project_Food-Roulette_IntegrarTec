// ── Componente: Modal de Login/Registro ──────────────────────────
// Única fuente de verdad del HTML del modal de autenticación.
// Antes este bloque estaba copiado en las 5 páginas; ahora se inyecta
// una sola vez desde acá. El cableado (abrir/cerrar, focus trap, login,
// registro) vive en `initAuthUI` de `js/ui.js`.

const AUTH_MODAL_HTML = `
  <div class="modal" id="auth-modal" role="dialog" aria-modal="true"
       aria-labelledby="auth-modal-title" hidden>
    <div class="modal-content">
      <button class="modal-close" id="auth-close-btn" aria-label="Close">✕</button>

      <div class="auth-container">
        <!-- Pestaña de Login -->
        <div class="auth-tab" id="login-tab" data-tab="login">
          <h2 id="auth-modal-title" data-translate>Login</h2>
          <form id="login-form">
            <label for="login-username" class="sr-only" data-translate>Username</label>
            <input type="text" placeholder="Username" id="login-username" required data-translate />
            <label for="login-password" class="sr-only" data-translate>Password</label>
            <input type="password" placeholder="Password" id="login-password" required data-translate />
            <button type="submit" class="btn btn--primary" data-translate>Sign In</button>
          </form>
          <p class="auth-switch">Don't have an account? <button type="button" class="auth-tab-btn" data-tab="register">Register</button></p>
          <div class="auth-message" id="login-message" role="alert"></div>
        </div>

        <!-- Pestaña de Registro -->
        <div class="auth-tab" id="register-tab" data-tab="register" hidden>
          <h2 data-translate>Register</h2>
          <form id="register-form">
            <label for="register-username" class="sr-only" data-translate>Username</label>
            <input type="text" placeholder="Username" id="register-username" required data-translate />
            <label for="register-password" class="sr-only" data-translate>Password</label>
            <input type="password" placeholder="Password" id="register-password" required data-translate />
            <label for="register-confirm" class="sr-only" data-translate>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" id="register-confirm" required data-translate />
            <button type="submit" class="btn btn--primary" data-translate>Create Account</button>
          </form>
          <p class="auth-switch">Already have an account? <button type="button" class="auth-tab-btn" data-tab="login">Login</button></p>
          <div class="auth-message" id="register-message" role="alert"></div>
        </div>
      </div>
    </div>
  </div>
`;

/**
 * Inyecta el modal de login/registro al final del <body> (si no existe ya).
 * Debe llamarse antes de `initAuthUI`. Los <script type="module"> corren
 * diferidos (con el DOM ya parseado), así que document.body siempre existe.
 */
export function injectAuthModal() {
  if (document.getElementById('auth-modal')) return; // ya inyectado
  document.body.insertAdjacentHTML('beforeend', AUTH_MODAL_HTML);
}
