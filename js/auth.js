// ── Gestión de Autenticación (Login/Registro) ────────────────

const KEYS = {
  USERS: 'fr_users',           // Usuarios registrados
  CURRENT_USER: 'fr_current_user', // Usuario logueado
};

/**
 * Obtiene todos los usuarios registrados
 */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  } catch {
    return {};
  }
}

/**
 * Obtiene el usuario actualmente logueado
 */
function getCurrentUser() {
  return localStorage.getItem(KEYS.CURRENT_USER);
}

/**
 * Obtiene los datos del usuario logueado
 */
function getCurrentUserData() {
  const username = getCurrentUser();
  if (!username) return null;
  return getUsers()[username] || null;
}

/**
 * Registra un nuevo usuario
 */
function register(username, password) {
  const users = getUsers();
  
  // Validaciones básicas
  if (!username || !password) {
    return { success: false, error: 'Username and password required' };
  }
  
  if (username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  
  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters' };
  }
  
  if (users[username]) {
    return { success: false, error: 'User already exists' };
  }
  
  // Crear usuario
  users[username] = {
    password: btoa(password), // Simple encoding (no usar en producción)
    favorites: [],
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return { success: true, message: 'User registered successfully' };
}

/**
 * Inicia sesión de un usuario
 */
function login(username, password) {
  const users = getUsers();
  
  if (!username || !password) {
    return { success: false, error: 'Username and password required' };
  }
  
  const user = users[username];
  if (!user || user.password !== btoa(password)) {
    return { success: false, error: 'Invalid username or password' };
  }
  
  localStorage.setItem(KEYS.CURRENT_USER, username);
  return { success: true, message: 'Logged in successfully' };
}

/**
 * Cierra sesión
 */
function logout() {
  localStorage.removeItem(KEYS.CURRENT_USER);
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Agrega una receta a favoritos del usuario logueado
 */
function addFavorite(recipe) {
  const username = getCurrentUser();
  if (!username) {
    return { success: false, error: 'Must be logged in' };
  }
  
  const users = getUsers();
  const user = users[username];
  
  if (!user.favorites) user.favorites = [];
  
  // Evitar duplicados
  if (user.favorites.some(fav => fav.id === recipe.id)) {
    return { success: false, error: 'Recipe already in favorites' };
  }
  
  user.favorites.push(recipe);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return { success: true, message: 'Added to favorites' };
}

/**
 * Elimina una receta de favoritos
 */
function removeFavorite(recipeId) {
  const username = getCurrentUser();
  if (!username) {
    return { success: false, error: 'Must be logged in' };
  }
  
  const users = getUsers();
  const user = users[username];
  
  user.favorites = user.favorites.filter(fav => fav.id !== recipeId);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return { success: true, message: 'Removed from favorites' };
}

/**
 * Obtiene los favoritos del usuario logueado
 */
function getFavorites() {
  const user = getCurrentUserData();
  return user?.favorites || [];
}

/**
 * Verifica si una receta está en favoritos
 */
function isFavorite(recipeId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === recipeId);
}

export {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentUserData,
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
};
