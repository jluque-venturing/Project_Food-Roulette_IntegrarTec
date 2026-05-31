import { getRecipes, getIngredients, saveLocalRecipe } from './storage.js';
import { applyFilters } from './filters.js';
import { getCurrentUser, addFavorite, removeFavorite, getFavorites, isFavorite } from './auth.js';
import { initChrome, showToast } from './ui.js';
import { createAutocomplete } from './autocomplete.js';
import { initLang } from './lang.js';
import { t } from './translator/translator.js';

// Inyecta navbar + footer + modal de login y cablea tema/auth (una sola llamada)
const { updateUserUI } = initChrome({ active: 'home', showFavorites: true, renderFavorites });
initLang();

// ── Estado ───────────────────────────────────────────────────────

const ingredientTags = new Set();
let allRecipes = [];
let ingredients = [];

// ── Referencias al DOM ───────────────────────────────────────────

const input = document.getElementById('ingredient-input');
const addBtn = document.getElementById('ingredient-btn');
const tagsList = document.getElementById('tags-container');
const tagTemplate = document.getElementById('ingredient-tag-template');
const searchBtn = document.getElementById('search-btn');
const recipesGrid = document.getElementById('recipes-grid');
const recipeTemplate = document.getElementById('recipe-template');
const resultsSection = document.getElementById('results-section');

// Favoritos: grid dentro del modal de favoritos (propio del index)
const favoritesGrid = document.getElementById('favorites-grid');

// ── Inicialización ───────────────────────────────────────────────

async function init() {
    [allRecipes, ingredients] = await Promise.all([getRecipes(), getIngredients()]);
    setupIngredientInput();
    setupFilterChips();
    setupQuickTags();
    setupSearch();
    checkSharedRecipe();
    updateUserUI();
}

// (createAutocomplete ahora se importa desde js/autocomplete.js)

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
    removeBtn.setAttribute('aria-label', `${t('Remove')} ${v}`);
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

// updateUserUI viene de initChrome (centralizado en js/ui.js).

function renderFavorites() {
    const favorites = getFavorites();
    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'no-results';
        msg.textContent = t('No favorite recipes yet. Add some from your searches!');
        favoritesGrid.appendChild(msg);
        return;
    }

    favorites.forEach((recipe) => {
        const fragment = recipeTemplate.content.cloneNode(true);
        const article = fragment.querySelector('article');

        article.querySelector('.recipe-title').textContent = recipe.name;
        article.querySelector('.recipe-description').textContent =
            `${recipe.emoji || '🍽️'} ${recipe.time} min · ${recipe.difficulty}`;

        const favoriteBtn = article.querySelector('.favorite-btn');
        favoriteBtn.textContent = '❤️';
        favoriteBtn.title = t('Add to favorites');
        favoriteBtn.addEventListener('click', () => {
            removeFavorite(recipe.id);
            renderFavorites();
        });

        const favRecipeBtn = article.querySelector('.recipe-btn');
        favRecipeBtn.textContent = t('View full recipe');
        favRecipeBtn.addEventListener('click', () => {
            sessionStorage.setItem('fr_selected_recipe', JSON.stringify(recipe));
            window.location.href = 'pages/recipe.html';
        });

        favoritesGrid.appendChild(fragment);
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
        msg.className = 'no-results';
        msg.textContent = t('No recipes found. Try different ingredients or filters.');
        recipesGrid.appendChild(msg);
        return;
    }

    recipes.forEach((recipe) => {
        const fragment = recipeTemplate.content.cloneNode(true);
        const article = fragment.querySelector('article');

        article.querySelector('.recipe-title').textContent = t(recipe.name);
        article.querySelector('.recipe-description').textContent =
            `${recipe.emoji || '🍽️'} ${recipe.time} ${t('min')} · ${t(recipe.difficulty)}`;

        const recipeBtn = article.querySelector('.recipe-btn');
        recipeBtn.textContent = t('Show more');
        recipeBtn.addEventListener('click', () =>
            toggleDetails(article, recipe)
        );

        // Botón de favoritos
        const favoriteBtn = article.querySelector('.favorite-btn');
        const setFavLabel = (fav) => {
            const label = fav ? t('Remove from favorites') : t('Add to favorites');
            favoriteBtn.title = label;
            favoriteBtn.setAttribute('aria-label', label);
        };
        favoriteBtn.textContent = isFavorite(recipe.id) ? '❤️' : '♡';
        setFavLabel(isFavorite(recipe.id));
        favoriteBtn.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast(t('Please login to save favorites'));
                document.getElementById('login-open-btn')?.click();
                return;
            }

            if (isFavorite(recipe.id)) {
                removeFavorite(recipe.id);
                favoriteBtn.textContent = '♡';
                setFavLabel(false);
            } else {
                const result = addFavorite(recipe);
                if (result.success) {
                    favoriteBtn.textContent = '❤️';
                    setFavLabel(true);
                } else {
                    showToast(result.error);
                }
            }
        });

        recipesGrid.appendChild(fragment);
    });
}

function toggleDetails(article, recipe) {
    const existing = article.querySelector('.recipe-details');
    if (existing) {
        existing.remove();
        article.querySelector('.recipe-btn').textContent = t('Show more');
        return;
    }

    const div = document.createElement('div');
    div.className = 'recipe-details';

    if (recipe.image) {
        const img = document.createElement('img');
        img.src = recipe.image;
        img.alt = t(recipe.name);
        img.className = 'recipe-image';
        div.appendChild(img);
    }

    const ingTitle = document.createElement('p');
    ingTitle.className = 'recipe-details__label';
    ingTitle.textContent = t('Ingredients:');
    div.appendChild(ingTitle);

    const ul = document.createElement('ul');
    ul.className = 'recipe-details__list';
    recipe.ingredients.forEach((ing) => {
        const li = document.createElement('li');
        li.textContent = t(ing);
        ul.appendChild(li);
    });
    div.appendChild(ul);

    if (recipe.steps?.length) {
        const stepsTitle = document.createElement('p');
        stepsTitle.className = 'recipe-details__label';
        stepsTitle.textContent = t('Steps:');
        div.appendChild(stepsTitle);

        const ol = document.createElement('ol');
        ol.className = 'recipe-details__steps';
        recipe.steps.forEach((step) => {
            const li = document.createElement('li');
            li.textContent = t(step);
            ol.appendChild(li);
        });
        div.appendChild(ol);
    }

    article.appendChild(div);
    article.querySelector('.recipe-btn').textContent = t('Show less');
}

// ── Receta compartida por URL ────────────────────────────────────

function checkSharedRecipe() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('recipe');
    if (!encoded) return;

    try {
        const recipe = JSON.parse(atob(encoded));
        if (!recipe.id || !recipe.name || !Array.isArray(recipe.ingredients)) return;

        if (window.confirm(`${t('You received a shared recipe:')} "${recipe.name}". ${t('Save it?')}`)) {
            saveLocalRecipe(recipe);
            showToast(`"${recipe.name}" ${t('saved!')}`);
        }
    } catch {
        // Parámetro inválido — ignorar
    }

    window.history.replaceState({}, '', window.location.pathname);
}

// ── Arranque ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
