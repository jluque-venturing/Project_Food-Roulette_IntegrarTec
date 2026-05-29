// ── Página de detalle de receta ──────────────────────────────────
// Lee la receta seleccionada desde sessionStorage (guardada por la ruleta)
// y arma el encabezado, la imagen, los tags y los pasos.

import { getLang, setLang, loadDictionary, translatePage, t } from './translator/translator.js';
import { initThemeUI, initAuthUI } from './ui.js';
import { injectAuthModal } from './auth-modal.js';
import { addFavorite, removeFavorite, isFavorite, getCurrentUser } from './auth.js';

const SELECTED_KEY = 'fr_selected_recipe';

// Capitaliza la primera letra (para mapear 'breakfast' → 'Breakfast', etc.)
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function getSelectedRecipe() {
  try {
    return JSON.parse(sessionStorage.getItem(SELECTED_KEY) || 'null');
  } catch {
    return null;
  }
}

// Color del encabezado según el tipo / orientación de la receta.
// Tonos elegidos para que el título en blanco mantenga contraste AA (≥3:1).
function heroColor(recipe) {
  if (recipe.type === 'dessert') return '#A0623D'; // marrón / caramelo
  if (recipe.vegan)              return '#4E8C5C'; // verde
  if (recipe.vegetarian)         return '#C76E16'; // naranja
  return '#D64545';                                // rojo (omnívora)
}

// Construye la lista de tags de características rápidas
function buildTags(recipe) {
  const tags = [];

  // Momento del día / tipo de plato
  if (recipe.type) {
    tags.push({ cls: 'badge--tipo', text: t(cap(recipe.type)) });
  }

  // Orientación hacia qué personas
  if (recipe.vegan)           tags.push({ cls: 'badge--vegan', text: t('Vegan') });
  else if (recipe.vegetarian) tags.push({ cls: 'badge--veg',   text: t('Vegetarian') });
  else                        tags.push({ cls: 'badge--omni',  text: t('Omnivore') });

  if (recipe.glutenFree) tags.push({ cls: 'badge--gluten', text: t('Gluten-free') });
  if (recipe.budget)     tags.push({ cls: 'badge--budget', text: t('Budget') });

  // Tiempo y velocidad
  if (recipe.time) {
    tags.push({ cls: 'badge--tiempo', text: `⏱ ${recipe.time} ${t('min')}` });
    if (recipe.time <= 20) tags.push({ cls: 'badge--fast', text: t('Fast') });
  }

  if (recipe.difficulty) tags.push({ cls: 'badge--dif', text: t(recipe.difficulty) });

  return tags;
}

// Renderiza todo el contenido derivado de la receta (se vuelve a llamar al cambiar idioma)
function renderRecipe(recipe) {
  // Título + color del encabezado
  const titleEl = document.getElementById('recipe-title');
  if (titleEl) titleEl.textContent = t(recipe.name);

  const hero = document.getElementById('recipe-hero');
  if (hero) hero.style.background = heroColor(recipe);

  // Imagen o emoji
  const visual = document.getElementById('recipe-visual');
  if (visual) {
    visual.textContent = '';
    if (recipe.image) {
      const img = document.createElement('img');
      img.src = recipe.image;
      img.alt = t(recipe.name);
      img.onerror = () => {
        visual.textContent = '';
        const span = document.createElement('span');
        span.className = 'recipe-aside__emoji';
        span.textContent = recipe.emoji || '🍽️';
        span.setAttribute('aria-hidden', 'true');
        visual.appendChild(span);
      };
      visual.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.className = 'recipe-aside__emoji';
      span.textContent = recipe.emoji || '🍽️';
      span.setAttribute('aria-hidden', 'true');
      visual.appendChild(span);
    }
  }

  // Tags
  const tagsEl = document.getElementById('recipe-tags');
  if (tagsEl) {
    tagsEl.textContent = '';
    buildTags(recipe).forEach(({ cls, text }) => {
      const li = document.createElement('li');
      li.className = `badge ${cls}`;
      li.textContent = text;
      tagsEl.appendChild(li);
    });
  }

  // Pasos
  const stepsEl = document.getElementById('recipe-steps');
  if (stepsEl) {
    stepsEl.textContent = '';
    (recipe.steps || []).forEach((step) => {
      const li = document.createElement('li');
      li.textContent = t(step);
      stepsEl.appendChild(li);
    });
  }
}

// Estado vacío: no hay receta seleccionada
function renderEmpty() {
  const page = document.getElementById('recipe-page');
  if (!page) return;
  page.innerHTML = '';

  const wrap = document.createElement('section');
  wrap.className = 'recipe-empty';

  const h1 = document.createElement('h1');
  h1.textContent = t('No recipe selected yet.');

  const p = document.createElement('p');
  p.textContent = t('Spin the wheel to discover a recipe!');

  const link = document.createElement('a');
  link.href = 'roulette.html';
  link.className = 'btn btn--primary';
  link.textContent = t('Go to the roulette');

  wrap.append(h1, p, link);
  page.appendChild(wrap);
}

// ── Botón de favoritos ────────────────────────────────────────────

function refreshFavButton(recipe) {
  const btn = document.getElementById('recipe-fav-btn');
  if (!btn) return;
  const fav = isFavorite(recipe.id);
  btn.textContent = fav ? '❤️' : '♡';
  btn.classList.toggle('is-favorite', fav);
}

function setupFavButton(recipe) {
  const btn = document.getElementById('recipe-fav-btn');
  if (!btn) return;
  refreshFavButton(recipe);

  btn.addEventListener('click', () => {
    if (!getCurrentUser()) {
      alert(t('Please login to save favorites'));
      document.getElementById('login-open-btn')?.click();
      return;
    }
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      const result = addFavorite(recipe);
      if (!result.success) { alert(result.error); return; }
    }
    refreshFavButton(recipe);
  });
}

// ── Idioma ────────────────────────────────────────────────────────

let activeRecipe = null;

async function applyLang() {
  await loadDictionary();
  translatePage();                       // textos estáticos (nav, encabezados)
  if (activeRecipe) renderRecipe(activeRecipe); // contenido dinámico
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = getLang() === 'en' ? 'ES' : 'EN';
}

function setupLangToggle() {
  const btn = document.getElementById('lang-toggle');
  btn?.addEventListener('click', async () => {
    setLang(getLang() === 'en' ? 'es' : 'en');
    await applyLang();
  });
}

// ── Menú de usuario (nav) ─────────────────────────────────────────

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
  // Refrescar el corazón por si cambió el estado de login
  if (activeRecipe) refreshFavButton(activeRecipe);
}

// ── Arranque ──────────────────────────────────────────────────────

async function init() {
  injectAuthModal();   // inyecta el modal de login/registro
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

  setupLangToggle();

  activeRecipe = getSelectedRecipe();

  await loadDictionary();

  if (!activeRecipe) {
    translatePage();
    renderEmpty();
    updateUserUI();
    return;
  }

  translatePage();
  renderRecipe(activeRecipe);
  setupFavButton(activeRecipe);
  updateUserUI();

  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = getLang() === 'en' ? 'ES' : 'EN';
}

document.addEventListener('DOMContentLoaded', init);
