// Abstracción sobre localStorage — punto central de persistencia

const KEYS = {
  LOCAL_RECIPES: 'fr_local_recipes',
  FILTERS: 'fr_filters',
  HISTORY: 'fr_history',
};

// Usa import.meta.url para que el path a /data funcione
// independientemente de qué HTML carga este módulo
const DATA_BASE = new URL('../data/', import.meta.url).href;

async function fetchJSON(file) {
  try {
    const res = await fetch(DATA_BASE + file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[storage] Could not load ${file}:`, err.message);
    return [];
  }
}

function getLocalRecipes() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LOCAL_RECIPES) || '[]');
  } catch {
    return [];
  }
}

async function getRecipes() {
  const [base, local] = await Promise.all([
    fetchJSON('recipes.json'),
    Promise.resolve(getLocalRecipes()),
  ]);
  return [...base, ...local];
}

async function getIngredients() {
  return fetchJSON('ingredients.json');
}

function saveLocalRecipe(recipe) {
  const recipes = getLocalRecipes();
  recipes.push({ ...recipe, source: 'local' });
  localStorage.setItem(KEYS.LOCAL_RECIPES, JSON.stringify(recipes));
}

function getFilters() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.FILTERS) || '{}');
  } catch {
    return {};
  }
}

function saveFilters(filters) {
  localStorage.setItem(KEYS.FILTERS, JSON.stringify(filters));
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
  } catch {
    return [];
  }
}

function saveToHistory(item) {
  const history = getHistory();
  history.unshift({ ...item, spinDate: new Date().toISOString() });
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
}

export {
  getRecipes,
  getIngredients,
  saveLocalRecipe,
  getFilters,
  saveFilters,
  getHistory,
  saveToHistory,
};
