// Integración con TheMealDB (https://www.themealdb.com/)
// API pública, no requiere key para uso básico v1

const BASE = 'https://www.themealdb.com/api/json/v1/1';

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[api] Fetch error:', err.message);
    return null;
  }
}

async function fetchRecipesByIngredient(ingredient) {
  const data = await safeFetch(`${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
  return data?.meals || [];
}

async function fetchRecipesByCategory(category) {
  const data = await safeFetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  return data?.meals || [];
}

async function fetchRecipeDetail(id) {
  const data = await safeFetch(`${BASE}/lookup.php?i=${id}`);
  return data?.meals?.[0] || null;
}

async function fetchCategories() {
  const data = await safeFetch(`${BASE}/categories.php`);
  return data?.categories || [];
}

// Buscar receta por nombre (devuelve el primer resultado o null)
async function searchByName(name) {
  const data = await safeFetch(`${BASE}/search.php?s=${encodeURIComponent(name)}`);
  return data?.meals?.[0] || null;
}

// Convierte el formato de TheMealDB al formato interno de la app
function mapMealToRecipe(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing?.trim()) ingredients.push(ing.trim());
  }

  const vegCategories = ['Vegetarian', 'Vegan'];
  const isVeg = vegCategories.includes(meal.strCategory);

  return {
    id: `api-${meal.idMeal}`,
    name: meal.strMeal,
    type: meal.strCategory?.toLowerCase() || 'any',
    vegan: false,
    vegetarian: isVeg,
    glutenFree: false,
    budget: false,
    ingredients,
    time: 30,
    difficulty: 'medium',
    image: meal.strMealThumb || '',
    emoji: '🍽️',
    steps: meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((s) => s.trim())
      : [],
    source: 'api',
  };
}

export {
  fetchRecipesByIngredient,
  fetchRecipesByCategory,
  fetchRecipeDetail,
  fetchCategories,
  searchByName,
  mapMealToRecipe,
};
