// Filtrado puro de recetas — sin efectos secundarios ni dependencias

function applyFilters(recipes, filters = {}) {
  return recipes.filter((r) => {
    if (filters.vegan && !r.vegan) return false;
    if (filters.vegetarian && !r.vegetarian) return false;
    if (filters.glutenFree && !r.glutenFree) return false;
    if (filters.budget && !r.budget) return false;
    if (filters.fast && r.time > 30) return false;
    if (filters.maxTime && filters.maxTime > 0 && r.time > filters.maxTime) return false;

    if (filters.mealType && filters.mealType !== 'any' && r.type !== filters.mealType) {
      return false;
    }

    if (filters.includeIngredients?.length) {
      const allPresent = filters.includeIngredients.every((ing) =>
        r.ingredients.some((ri) => ri.toLowerCase().includes(ing.toLowerCase()))
      );
      if (!allPresent) return false;
    }

    if (filters.excludeIngredients?.length) {
      const anyBlocked = filters.excludeIngredients.some((ing) =>
        r.ingredients.some((ri) => ri.toLowerCase().includes(ing.toLowerCase()))
      );
      if (anyBlocked) return false;
    }

    return true;
  });
}

export { applyFilters };
