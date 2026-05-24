import { getRecipes, getIngredients, saveLocalRecipe } from './storage.js';
import { applyFilters } from './filters.js';

// ── Estado ───────────────────────────────────────────────────────

const ingredientTags = new Set();
let allRecipes  = [];
let ingredients = [];

// ── Referencias al DOM ───────────────────────────────────────────

const input          = document.getElementById('ingredient-input');
const addBtn         = document.getElementById('ingredient-btn');
const tagsList       = document.getElementById('tags-container');
const tagTemplate    = document.getElementById('ingredient-tag-template');
const searchBtn      = document.getElementById('search-btn');
const recipesGrid    = document.getElementById('recipes-grid');
const recipeTemplate = document.getElementById('recipe-template');
const resultsSection = document.getElementById('results-section');

// ── Inicialización ───────────────────────────────────────────────

async function init() {
  [allRecipes, ingredients] = await Promise.all([getRecipes(), getIngredients()]);
  setupIngredientInput();
  setupFilterChips();
  setupQuickTags();
  setupSearch();
  checkSharedRecipe();
}

// ── Autocomplete ─────────────────────────────────────────────────

function createAutocomplete(inputEl, itemsList) {
  const wrapper = inputEl.parentElement;
  wrapper.style.position = 'relative';

  const dropdown = document.createElement('ul');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;
  wrapper.appendChild(dropdown);

  let activeIdx = -1;

  function render(query) {
    const q = query.toLowerCase().trim();
    if (!q) { hide(); return; }

    const matches = itemsList
      .filter(item => item.toLowerCase().includes(q))
      .sort((a, b) => {
        const aS = a.toLowerCase().startsWith(q) ? 0 : 1;
        const bS = b.toLowerCase().startsWith(q) ? 0 : 1;
        return aS - bS || a.localeCompare(b);
      })
      .slice(0, 8);

    if (!matches.length) { hide(); return; }

    dropdown.innerHTML = '';
    activeIdx = -1;

    matches.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.setAttribute('role', 'option');

      // Highlight sin innerHTML
      const idx = item.toLowerCase().indexOf(q);
      if (idx !== -1) {
        li.appendChild(document.createTextNode(item.slice(0, idx)));
        const mark = document.createElement('mark');
        mark.className   = 'autocomplete-match';
        mark.textContent = item.slice(idx, idx + q.length);
        li.appendChild(mark);
        li.appendChild(document.createTextNode(item.slice(idx + q.length)));
      } else {
        li.textContent = item;
      }

      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = item;
        hide();
        inputEl.dispatchEvent(new Event('autocomplete-select', { bubbles: true }));
      });

      dropdown.appendChild(li);
    });

    dropdown.hidden = false;
  }

  function setActive(idx) {
    const items = [...dropdown.querySelectorAll('.autocomplete-item')];
    items.forEach((li, i) => li.classList.toggle('active', i === idx));
    if (idx >= 0 && idx < items.length) inputEl.value = items[idx].textContent;
  }

  function hide() {
    dropdown.hidden = true;
    activeIdx = -1;
  }

  inputEl.addEventListener('input',  () => render(inputEl.value));
  inputEl.addEventListener('focus',  () => { if (inputEl.value) render(inputEl.value); });
  inputEl.addEventListener('blur',   () => setTimeout(hide, 160));
  inputEl.addEventListener('keydown', (e) => {
    const items = [...dropdown.querySelectorAll('.autocomplete-item')];
    if (dropdown.hidden || !items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % items.length;
      setActive(activeIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + items.length) % items.length;
      setActive(activeIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hide();
    }
  });
}

// ── Sistema de tags de ingredientes ─────────────────────────────

function addIngredient(value) {
  const v = value.trim().toLowerCase();
  if (!v || ingredientTags.has(v)) return;
  ingredientTags.add(v);
  renderTag(v);
  if (input) input.value = '';
  input?.focus();
}

function removeIngredient(v) {
  ingredientTags.delete(v);
}

function renderTag(v) {
  const fragment = tagTemplate.content.cloneNode(true);
  const li = fragment.querySelector('li');
  li.setAttribute('data-value', v);
  li.querySelector('.tag-text').textContent = v;

  const removeBtn = li.querySelector('.remove-btn');
  removeBtn.setAttribute('aria-label', `Remove ${v}`);
  removeBtn.addEventListener('click', () => {
    removeIngredient(v);
    li.remove();
  });

  tagsList.appendChild(fragment);
}

function setupIngredientInput() {
  // Autocomplete sobre el input principal de ingredientes
  if (ingredients.length > 0) {
    createAutocomplete(input, ingredients);
    input.addEventListener('autocomplete-select', () => {
      addIngredient(input.value);
    });
  }

  addBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    addIngredient(input.value);
  });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addIngredient(input.value); }
  });
}

// ── Filtros chip ─────────────────────────────────────────────────

function setupFilterChips() {
  document.querySelectorAll('.filter-chip input[type="checkbox"]').forEach((cb) => {
    if (cb.checked) cb.closest('.filter-chip')?.classList.add('active');
    cb.addEventListener('change', () => {
      cb.closest('.filter-chip')?.classList.toggle('active', cb.checked);
    });
  });
}

// ── Quick tags ───────────────────────────────────────────────────

function setupQuickTags() {
  document.querySelectorAll('.quick-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.replace(/^\S+\s/, '').trim().toLowerCase();
      addIngredient(text);
    });
  });
}

// ── Búsqueda y resultados ────────────────────────────────────────

function readActiveFilters() {
  const filters = { includeIngredients: [...ingredientTags] };

  document.querySelectorAll('.filter-chip input[type="checkbox"]').forEach((cb) => {
    if (!cb.checked) return;
    const label = cb.closest('.filter-chip')?.textContent.trim().toLowerCase() || '';
    if (label.includes('vegetarian')) filters.vegetarian = true;
    if (label.includes('tacc') || label.includes('gluten')) filters.glutenFree = true;
    if (label.includes('fast')) filters.fast = true;
    if (label.includes('saving') || label.includes('budget')) filters.budget = true;
  });

  return filters;
}

function setupSearch() {
  searchBtn?.addEventListener('click', performSearch);
}

function performSearch() {
  const filters = readActiveFilters();
  const results = applyFilters(allRecipes, filters);
  renderResults(results);
  resultsSection?.scrollIntoView({ behavior: 'smooth' });
}

function renderResults(recipes) {
  if (!recipesGrid || !recipeTemplate) return;
  recipesGrid.innerHTML = '';

  if (recipes.length === 0) {
    const msg = document.createElement('p');
    msg.className   = 'no-results';
    msg.textContent = 'No recipes found. Try different ingredients or filters.';
    recipesGrid.appendChild(msg);
    return;
  }

  recipes.forEach((recipe) => {
    const fragment = recipeTemplate.content.cloneNode(true);
    const article  = fragment.querySelector('article');

    article.querySelector('.recipe-title').textContent = recipe.name;
    article.querySelector('.recipe-description').textContent =
      `${recipe.emoji || '🍽️'} ${recipe.time} min · ${recipe.difficulty}`;

    article.querySelector('.recipe-btn').addEventListener('click', () =>
      toggleDetails(article, recipe)
    );

    recipesGrid.appendChild(fragment);
  });
}

function toggleDetails(article, recipe) {
  const existing = article.querySelector('.recipe-details');
  if (existing) {
    existing.remove();
    article.querySelector('.recipe-btn').textContent = 'Show more';
    return;
  }

  const div = document.createElement('div');
  div.className = 'recipe-details';

  if (recipe.image) {
    const img = document.createElement('img');
    img.src       = recipe.image;
    img.alt       = recipe.name;
    img.className = 'recipe-image';
    div.appendChild(img);
  }

  const ingTitle = document.createElement('p');
  ingTitle.className   = 'recipe-details__label';
  ingTitle.textContent = 'Ingredients:';
  div.appendChild(ingTitle);

  const ul = document.createElement('ul');
  ul.className = 'recipe-details__list';
  recipe.ingredients.forEach((ing) => {
    const li = document.createElement('li');
    li.textContent = ing;
    ul.appendChild(li);
  });
  div.appendChild(ul);

  if (recipe.steps?.length) {
    const stepsTitle = document.createElement('p');
    stepsTitle.className   = 'recipe-details__label';
    stepsTitle.textContent = 'Steps:';
    div.appendChild(stepsTitle);

    const ol = document.createElement('ol');
    ol.className = 'recipe-details__steps';
    recipe.steps.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    });
    div.appendChild(ol);
  }

  article.appendChild(div);
  article.querySelector('.recipe-btn').textContent = 'Show less';
}

// ── Receta compartida por URL ────────────────────────────────────

function checkSharedRecipe() {
  const params  = new URLSearchParams(window.location.search);
  const encoded = params.get('recipe');
  if (!encoded) return;

  try {
    const recipe = JSON.parse(atob(encoded));
    if (!recipe.id || !recipe.name || !Array.isArray(recipe.ingredients)) return;

    if (window.confirm(`You received a shared recipe: "${recipe.name}". Save it?`)) {
      saveLocalRecipe(recipe);
      alert(`"${recipe.name}" saved!`);
    }
  } catch {
    // Parámetro inválido — ignorar
  }

  window.history.replaceState({}, '', window.location.pathname);
}

// ── Arranque ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
