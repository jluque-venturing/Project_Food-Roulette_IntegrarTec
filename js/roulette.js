import { getRecipes, getIngredients, getFilters, saveFilters, saveToHistory } from './storage.js';
import { initLang } from './lang.js';
import { t } from './translator/translator.js';
import { initChrome } from './ui.js';
import { createAutocomplete } from './autocomplete.js';
import { applyFilters } from './filters.js';

// Inyecta navbar + footer + modal de login y cablea tema/auth (una sola llamada)
initChrome({ active: 'roulette' });
initLang();

// ── Colores de los segmentos (tonos vibrantes, comida) ───────────
const SEGMENT_COLORS = [
  '#D64545', '#F28C28', '#E0A100', '#5A9E6A',
  '#9B59B6', '#E84393', '#27AE60', '#2980B9',
  '#E67E22', '#16A085', '#8E44AD', '#C0392B',
];

// (navbar, footer, modal de login y cableado tema/auth los maneja initChrome arriba)

// ── Clase RouletteWheel ──────────────────────────────────────────

class RouletteWheel {
  constructor(canvas) {
    this.canvas      = canvas;
    this.ctx         = canvas.getContext('2d');
    this.segments    = [];
    this.angle       = 0;
    this.spinning    = false;
    this.onSpinEnd   = null;
    this.dpr         = 1;
    this.logicalSize = 400;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const parent = this.canvas.parentElement;
    const dpr    = window.devicePixelRatio || 1;
    const size   = Math.min(parent?.clientWidth || 400, 400);

    // Escalar el canvas por DPR para evitar texto borroso en pantallas retina
    this.dpr         = dpr;
    this.logicalSize = size;
    this.canvas.width  = Math.round(size * dpr);
    this.canvas.height = Math.round(size * dpr);
    this.canvas.style.width  = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.ctx.scale(dpr, dpr);

    this.cx     = size / 2;
    this.cy     = size / 2;
    this.outerR = size / 2 - 6;
    this.segR   = this.outerR - 16;
    this.draw();
  }

  setSegments(segments) {
    this.segments = [...segments];
    this.draw();
  }

  draw() {
    const { ctx, logicalSize, cx, cy, outerR, segR, angle } = this;
    // clearRect en coordenadas lógicas (el DPR ya está aplicado con scale)
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // Anillo exterior decorativo
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = '#3A1F12';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#E0A100';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#3A1F12';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.segments.length === 0) {
      this._drawEmpty();
      return;
    }

    const n   = this.segments.length;
    const arc = (2 * Math.PI) / n;

    this.segments.forEach((seg, i) => {
      const startA = -Math.PI / 2 + angle + i * arc;
      const endA   = startA + arc;

      // Relleno del segmento
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, segR, startA, endA);
      ctx.closePath();
      ctx.fillStyle   = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Texto del segmento
      const midA     = startA + arc / 2;
      const fontSize = n <= 6 ? 17 : n <= 9 ? 13 : 11;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midA);
      ctx.textAlign   = 'right';
      ctx.font        = `bold ${fontSize}px Segoe UI, system-ui, sans-serif`;
      ctx.fillStyle   = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur  = 4;

      // Truncar por ancho de píxeles reales para que el texto nunca toque el hub
      // availWidth = distancia desde el borde del segmento hasta el hub + padding
      const availWidth = segR - 10 - 27 - 8;
      let label = t(seg.name);
      if (ctx.measureText(label).width > availWidth) {
        while (label.length > 1 && ctx.measureText(label + '…').width > availWidth) {
          label = label.slice(0, -1);
        }
        label += '…';
      }

      ctx.fillText(label, segR - 10, fontSize / 3);
      ctx.restore();
    });

    // Hub central con degradado
    const grad = ctx.createRadialGradient(cx - 8, cy - 8, 3, cx, cy, 27);
    grad.addColorStop(0,   '#FFF4E6');
    grad.addColorStop(0.4, '#E0A100');
    grad.addColorStop(1,   '#4A2C24');
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fillStyle   = grad;
    ctx.fill();
    ctx.strokeStyle = '#E0A100';
    ctx.lineWidth   = 3;
    ctx.stroke();
  }

  _drawEmpty() {
    const { ctx, cx, cy, segR } = this;
    ctx.beginPath();
    ctx.arc(cx, cy, segR, 0, Math.PI * 2);
    ctx.fillStyle = '#F5E8D8';
    ctx.fill();
    ctx.fillStyle = '#4A2C24';
    ctx.textAlign = 'center';
    ctx.font      = '15px Segoe UI, system-ui, sans-serif';
    ctx.fillText(t('Apply filters to'), cx, cy - 10);
    ctx.fillText(t('see options'), cx, cy + 14);
  }

  spin() {
    if (this.spinning || this.segments.length === 0) return;
    this.spinning = true;

    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spins    = reduced ? 0.5 : 5 + Math.random() * 5;
    const total    = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = reduced ? 500 : 4000;
    const start    = this.angle;
    const t0       = performance.now();

    const tick = (now) => {
      const t     = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.angle  = start + total * eased;
      this.draw();
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        this.spinning = false;
        this.onSpinEnd?.(this._winner());
      }
    };

    requestAnimationFrame(tick);
  }

  _winner() {
    const n          = this.segments.length;
    const arc        = (2 * Math.PI) / n;
    const normalized = ((-this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return this.segments[Math.floor(normalized / arc) % n];
  }
}

// (createAutocomplete ahora se importa desde js/autocomplete.js)

// ── Gestor de tags ───────────────────────────────────────────────

function createTagManager(listEl, inputEl, addBtnEl, ingredientsList = []) {
  const tags = new Set();

  if (ingredientsList.length > 0) {
    createAutocomplete(inputEl, ingredientsList);
    inputEl.addEventListener('autocomplete-select', () => {
      if (inputEl.value.trim()) add(inputEl.value);
    });
  }

  function add(value) {
    const v = value.trim().toLowerCase();
    if (!v || tags.has(v)) return;
    tags.add(v);

    const li   = document.createElement('li');
    li.className = 'ingredient-tag';
    li.setAttribute('data-value', v);

    const span = document.createElement('span');
    span.className = 'tag-text';
    span.setAttribute('data-translate', v);
    span.textContent = t(v);

    const btn = document.createElement('button');
    btn.className   = 'remove-btn';
    btn.textContent = '×';
    btn.setAttribute('aria-label', `${t('Remove')} ${t(v)}`);
    btn.addEventListener('click', () => { tags.delete(v); li.remove(); });

    li.append(span, btn);
    listEl.appendChild(li);
    if (inputEl) inputEl.value = '';
  }

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add(inputEl.value); }
  });
  addBtnEl?.addEventListener('click', () => add(inputEl?.value || ''));

  return { getTags: () => [...tags], add };
}

// ── UI Controller ────────────────────────────────────────────────

let wheel;
let allRecipes  = [];
let ingredients = [];
let includeMgr;
let excludeMgr;

async function init() {
  [allRecipes, ingredients] = await Promise.all([getRecipes(), getIngredients()]);

  wheel = new RouletteWheel(document.getElementById('roulette-canvas'));
  wheel.onSpinEnd = showResult;

  includeMgr = createTagManager(
    document.getElementById('include-tags'),
    document.getElementById('include-input'),
    document.getElementById('include-add-btn'),
    ingredients
  );
  excludeMgr = createTagManager(
    document.getElementById('exclude-tags'),
    document.getElementById('exclude-input'),
    document.getElementById('exclude-add-btn'),
    ingredients
  );

  setupFilters();
  setupSpinBtn();
  setupModal();
  setupKeyboard();
  restoreFilters();
  updateWheel();
}

function readFilters() {
  return {
    vegan:              document.getElementById('diet-type')?.value === 'vegan',
    vegetarian:         ['vegan', 'vegetarian'].includes(document.getElementById('diet-type')?.value),
    glutenFree:         document.getElementById('diet-type')?.value === 'glutenFree',
    mealType:           document.getElementById('meal-type')?.value || 'any',
    maxTime:            parseInt(document.getElementById('max-time')?.value) || null,
    includeIngredients: includeMgr?.getTags() || [],
    excludeIngredients: excludeMgr?.getTags() || [],
    count:              parseInt(document.getElementById('options-count')?.value) || 8,
  };
}

function updateWheel() {
  const filters = readFilters();
  saveFilters(filters);

  let matches = applyFilters(allRecipes, filters);

  // Fisher-Yates shuffle para que cada giro sea diferente
  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]];
  }
  matches = matches.slice(0, filters.count);

  wheel.setSegments(matches);
  updateStatus(matches.length);
}

function updateStatus(count) {
  const hintEl  = document.getElementById('roulette-hint');
  const countEl = document.getElementById('roulette-count');
  if (count === 0) {
    if (hintEl)  hintEl.textContent  = t('Try relaxing the filters.');
    if (countEl) countEl.textContent = t('No recipes match.');
  } else {
    if (hintEl)  hintEl.textContent  = t('Ready to spin!');
    const label = count === 1 ? 'recipe on the wheel' : 'recipes on the wheel';
    if (countEl) countEl.textContent = `${count} ${t(label)}`;
  }
}

function setupFilters() {
  ['diet-type', 'meal-type', 'options-count'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', updateWheel);
  });

  const maxTimeEl = document.getElementById('max-time');
  maxTimeEl?.addEventListener('input', () => {
    const val = parseInt(maxTimeEl.value) || 0;
    const lbl = document.getElementById('max-time-label');
    if (lbl) lbl.textContent = val === 0 ? t('No limit') : `${val} ${t('min')}`;
  });
  maxTimeEl?.addEventListener('change', updateWheel);

  const countEl = document.getElementById('options-count');
  countEl?.addEventListener('input', () => {
    const lbl = document.getElementById('options-count-label');
    if (lbl) lbl.textContent = countEl.value;
  });

  document.getElementById('apply-filters-btn')?.addEventListener('click', updateWheel);
}

function restoreFilters() {
  const saved = getFilters();
  if (!saved || !Object.keys(saved).length) return;

  if (saved.vegan)           setSelect('diet-type', 'vegan');
  else if (saved.vegetarian) setSelect('diet-type', 'vegetarian');
  else if (saved.glutenFree) setSelect('diet-type', 'glutenFree');

  if (saved.mealType) setSelect('meal-type', saved.mealType);

  if (saved.maxTime) {
    const el = document.getElementById('max-time');
    if (el) { el.value = saved.maxTime; el.dispatchEvent(new Event('input')); }
  }
  if (saved.count) {
    const el = document.getElementById('options-count');
    if (el) { el.value = saved.count; el.dispatchEvent(new Event('input')); }
  }
}

function setSelect(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

// ── Botón de giro ────────────────────────────────────────────────

function setupSpinBtn() {
  document.getElementById('spin-btn')?.addEventListener('click', triggerSpin);
}

function triggerSpin() {
  if (wheel.spinning || wheel.segments.length === 0) return;
  const btn = document.getElementById('spin-btn');
  if (btn) { btn.disabled = true; btn.classList.add('spinning'); }
  document.getElementById('wheel-container')?.classList.add('spinning');
  wheel.spin();
}

// ── Modal de resultado ───────────────────────────────────────────

let prevFocus = null;
let currentRecipe = null;

function showResult(recipe) {
  const btn = document.getElementById('spin-btn');
  if (btn) { btn.disabled = false; btn.classList.remove('spinning'); }
  document.getElementById('wheel-container')?.classList.remove('spinning');

  currentRecipe = recipe;
  saveToHistory(recipe);

  document.getElementById('result-name').textContent = t(recipe.name);
  document.getElementById('result-time').textContent =
    recipe.time ? `⏱ ${recipe.time} ${t('minutes')}` : '';

  const img     = document.getElementById('result-image');
  const emojiEl = document.getElementById('result-emoji-display');
  emojiEl.textContent = recipe.emoji || '🍽️';

  if (recipe.image) {
    img.src    = recipe.image;
    img.alt    = recipe.name;
    img.hidden = false;
    emojiEl.hidden = true;
  } else {
    // Sin imagen: mostrar el emoji
    img.hidden     = true;
    emojiEl.hidden = false;
  }

  const ingList = document.getElementById('result-ingredients');
  ingList.innerHTML = '';
  recipe.ingredients.slice(0, 8).forEach((ing) => {
    const li = document.createElement('li');
    li.textContent = t(ing);
    ingList.appendChild(li);
  });

  const modal = document.getElementById('result-modal');
  prevFocus = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add('active'));
  });
  document.getElementById('close-modal-btn')?.focus();
}

function closeModal() {
  const modal = document.getElementById('result-modal');
  modal.classList.remove('active');
  modal.addEventListener('transitionend', () => { modal.hidden = true; }, { once: true });
  prevFocus?.focus();
}

function setupModal() {
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);
  document.getElementById('spin-again-btn')?.addEventListener('click', () => {
    closeModal();
    setTimeout(triggerSpin, 350);
  });

  // Ver receta completa: guarda la receta y navega a la página de detalle
  document.getElementById('view-recipe-btn')?.addEventListener('click', () => {
    if (!currentRecipe) return;
    sessionStorage.setItem('fr_selected_recipe', JSON.stringify(currentRecipe));
    window.location.href = 'recipe.html';
  });

  // Focus trap dentro del modal
  document.getElementById('result-modal')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...document.getElementById('result-modal').querySelectorAll(
      'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
    )];
    const first = focusable[0];
    const last  = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}

// ── Atajos de teclado ────────────────────────────────────────────

function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    const modal     = document.getElementById('result-modal');
    const modalOpen = !modal?.hidden;
    const inInput   = ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName);

    if (e.key === 'Escape' && modalOpen) {
      e.preventDefault();
      closeModal();
      return;
    }

    if (inInput || modalOpen) return;

    if (e.key === ' ') {
      e.preventDefault();
      triggerSpin();
    }
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      document.getElementById('diet-type')?.focus();
    }
  });
}

// ── Arranque ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
