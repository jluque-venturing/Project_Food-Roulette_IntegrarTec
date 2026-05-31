# SPEC — Food Roulette (Grupo 8)

## Estado actual del proyecto

Ya existe una base funcional:

- `index.html` — página de inicio con navbar, hero, buscador de ingredientes con tags, filtros tipo chip (Fast, Vegetarian, TACC-FREE, Saving), quick tags y sección de resultados.
- `css/style.css` — paleta de colores definida como variables CSS, base responsive con media queries.
- `pages/roulette.html` — dos prototipos visuales de ruleta (básico y estilo casino profesional), sin lógica JS.
- `css/roulette.css` — estilos del prototipo profesional (anillo de madera, banda dorada, aguja, base).
- `js/script.js` — vacío, pendiente de implementar.

El navbar de `index.html` está en inglés. El equipo decidirá más adelante qué navbar conservar comparando con el del compañero.

---

## Objetivo

Completar la aplicación web Food Roulette: una ruleta interactiva que sugiere recetas según parámetros configurables por el usuario, deployada en GitHub Pages, sin backend.

---

## Restricciones técnicas

- Solo HTML5, CSS3, JavaScript Vanilla (ES6+).
- Sin frameworks frontend ni CSS (no React, no Vue, no Bootstrap, no Tailwind).
- Sin backend ni base de datos.
- Persistencia: `localStorage`, `sessionStorage`, archivos JSON estáticos.
- Deploy: GitHub Pages.

---

## Paleta de colores

Ya definida en `css/style.css` como variables CSS. No cambiar los nombres de las variables:

```css
--primary:    #D64545;   /* Rojo — botones principales, acción */
--accent:     #F28C28;   /* Naranja — destacados, tags */
--secondary:  #E0A100;   /* Amarillo oro — filtros, iconos */
--background: #FFF4E6;   /* Crema — fondo general */
--text:       #4A2C24;   /* Marrón oscuro — textura de lectura */
```

La ruleta puede usar colores más vibrantes y divertidos, pero deben ser compatibles con esta paleta.

---

## Estructura de archivos final esperada

```
/index.html
/pages/roulette.html

/css/
  style.css          (ya existe — estilos globales y paleta)
  roulette.css       (ya existe — estilos visuales de la ruleta)

/js/
  script.js          (lógica de index.html — ingredientes, filtros, resultados)
  roulette.js        (lógica de la ruleta — giro, segmentos, modal de resultado)
  storage.js         (módulo de abstracción sobre localStorage)
  api.js             (llamadas a APIs externas)
  filters.js         (lógica de filtrado de recetas)

/data/
  recipes.json       (recetas base del proyecto, incluidas en el repo)
  ingredients.json   (ingredientes base del proyecto)

/assets/
  sounds/            (sonido de giro, opcional)
```

---

## Módulos JS

### `storage.js`

Módulo que abstrae toda interacción con `localStorage`. Exportar funciones:

```js
getRecipes()         // devuelve array: [...recipesFromJSON, ...localRecipes]
saveLocalRecipe(r)   // guarda receta en localStorage
getFilters()         // recupera últimos filtros usados
saveFilters(f)       // persiste filtros actuales
getHistory()         // historial de ruletas giradas
saveToHistory(item)  // agrega resultado al historial
```

### `api.js`

Llamadas a APIs externas. API principal: **TheMealDB** (`https://www.themealdb.com/api/json/v1/1/`).

- No requiere API key para uso básico.
- Endpoints útiles:
  - `filter.php?c=Seafood` — filtrar por categoría
  - `filter.php?i=chicken` — filtrar por ingrediente
  - `lookup.php?i=52772` — detalle de una receta
  - `categories.php` — lista de categorías

Función principal:
```js
fetchRecipesByIngredient(ingredient)
fetchRecipeDetail(id)
fetchCategories()
```

### `filters.js`

Recibe el array completo de recetas y los filtros activos, devuelve recetas filtradas.

Filtros disponibles:
- `vegan` (boolean)
- `vegetarian` (boolean)
- `glutenFree` (boolean)
- `maxTime` (número en minutos)
- `mealType` (string: "breakfast" | "lunch" | "dinner" | "dessert" | "any")
- `includeIngredients` (array de strings)
- `excludeIngredients` (array de strings)

### `roulette.js`

Toda la lógica de la ruleta. Ver sección dedicada abajo.

### `script.js`

Lógica de `index.html`:
- Agregar/eliminar ingredientes como tags.
- Activar/desactivar filtros chip.
- Buscar recetas y renderizar en la grilla.

---

## Datos

### `data/recipes.json`

Array de objetos con esta forma:

```json
[
  {
    "id": "local-001",
    "name": "Pasta al pesto",
    "type": "lunch",
    "vegan": true,
    "vegetarian": true,
    "glutenFree": false,
    "ingredients": ["pasta", "albahaca", "ajo", "aceite de oliva", "piñones"],
    "time": 20,
    "difficulty": "easy",
    "image": "https://...",
    "steps": ["Hervir pasta...", "Mezclar albahaca..."],
    "source": "local"
  }
]
```

Incluir al menos 15 recetas reales en el JSON base del repositorio.

### `data/ingredients.json`

Array simple de strings con nombres de ingredientes (al menos 50), usado para el buscador y sugerencias rápidas de la página de inicio.

---

## Página de inicio (`index.html`) — completar con JS

La estructura HTML ya existe. Implementar en `script.js`:

1. **Agregar ingrediente** — al hacer clic en "+ Add" o presionar Enter en el input, crear un tag visual (ya existe el `<template id="ingredient-tag-template">`).
2. **Eliminar ingrediente** — botón "X" en cada tag.
3. **Quick tags** — al hacer clic en un quick tag, agregar ese ingrediente automáticamente.
4. **Buscar recetas** — al hacer clic en "Find Recipes", combinar ingredientes ingresados + filtros activos, llamar a `filters.js` con el pool de recetas (`storage.getRecipes()`), renderizar resultados en `#recipes-grid` usando `<template id="recipe-template">`.
5. **Enlace a la ruleta** — el botón de resultados "Show more" puede abrir el modal de receta o redirigir a `pages/roulette.html`.

---

## Página de ruleta (`pages/roulette.html`) — implementar completamente

### Visual de la ruleta

Usar como base el prototipo profesional ya existente (`.pro-roulette-section`). Adaptar `.pro-wheel-face` para que los segmentos sean dinámicos: generados por JS con `conic-gradient` según la cantidad de recetas/opciones del filtro.

Los colores de los segmentos deben ser vibrantes y variados (no solo negro y rojo como el prototipo casino).

### Panel de configuración

A la derecha (desktop) o arriba (mobile) de la ruleta, agregar un panel con:

| Control | Tipo | Descripción |
|---|---|---|
| Tipo de comida | Select | Any / Vegan / Vegetarian / Gluten-free |
| Tipo de plato | Select | Any / Breakfast / Lunch / Dinner / Dessert |
| Tiempo máximo | Slider + número | En minutos (0 = sin límite) |
| Ingredientes requeridos | Input + tags | Igual que en index |
| Ingredientes excluidos | Input + tags | Idem |
| Cantidad de opciones | Número (1-12) | Cuántos segmentos muestra la ruleta |

Al cambiar cualquier filtro, recalcular los segmentos de la ruleta en tiempo real.

### Lógica de giro

```js
// Algoritmo base
function spin() {
  const randomDegrees = 1440 + Math.floor(Math.random() * 360); // mínimo 4 vueltas
  const duration = 4000; // ms
  wheel.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
  wheel.style.transform = `rotate(${currentRotation + randomDegrees}deg)`;
  currentRotation += randomDegrees;
  setTimeout(showResult, duration);
}
```

El resultado se calcula según el ángulo final respecto al puntero (que está fijo arriba).

### Botón de giro

- Texto: "¡Girar!" (o icono de flecha circular).
- Atajo de teclado: `Space`.
- Mientras gira: deshabilitar el botón, agregar clase `.spinning` a la ruleta.

### Modal de resultado

Cuando la ruleta frena, mostrar un modal con:

- Overlay translúcido sobre toda la pantalla.
- Imagen de la receta (grande).
- Texto: "¡La comida del día es..." + nombre en grande.
- Ingredientes principales (lista).
- Tiempo de preparación.
- Botones: "Ver receta completa" / "Volver a girar".

Animación de entrada: escala desde 0 a 1 con `transform: scale()` + `opacity`.

Atajo para cerrar: `Esc`.

---

## Compartir recetas sin backend

### Estrategia: URL compartible

Al crear una receta local, el usuario puede generar un enlace. La receta se serializa con `JSON.stringify`, se codifica con `btoa()` y se agrega como query param:

```
https://[usuario].github.io/food-roulette/?recipe=BASE64_AQUI
```

Quien recibe el link, al abrir la página, lee el param con `URLSearchParams`, decodifica y pregunta "¿Querés guardar esta receta?". Si acepta, se guarda en su `localStorage`.

Esto permite compartir sin backend. Las recetas del repo (`data/recipes.json`) son el contenido base que todos ven.

### Recetas del repo como "recetas globales"

Si el equipo quiere agregar recetas al pool global, se hace via Pull Request al archivo `data/recipes.json`. Documentar el proceso en el README.

---

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Space` | Girar la ruleta |
| `Esc` | Cerrar modal |
| `R` | Volver a girar (desde el modal) |
| `F` | Enfocar panel de filtros |
| `Enter` | Agregar ingrediente en el input |

Implementar con `document.addEventListener('keydown', ...)` en `roulette.js`.

---

## Responsive Design

Enfoque mobile-first. Breakpoints en `style.css`:

- `< 768px` (mobile): ruleta centrada, panel de configuración debajo.
- `768px – 1024px` (tablet): ruleta más grande, panel al lado.
- `> 1024px` (desktop): layout de dos columnas, panel fijo a la derecha.

---

## Accesibilidad (a11y)

- Todo elemento interactivo debe ser alcanzable por `Tab`.
- Focus visible en todos los controles (no quitar `outline`, personalizar con color de paleta).
- Botón de ruleta: `aria-label="Girar la ruleta"`.
- Modal: manejar `focus trap` — el foco no puede salir del modal mientras esté abierto.
- `aria-live="polite"` en el área de resultado para lectores de pantalla.
- Soporte `prefers-reduced-motion`: si el usuario lo tiene activado, reducir la animación de giro.

---

## Animaciones

Solo CSS y JS Vanilla. No usar librerías de animación.

- Ruleta girando: `transform: rotate()` con `transition` cubic-bezier.
- Modal de resultado: `transform: scale(0) → scale(1)` + `opacity: 0 → 1`.
- Tags de ingredientes: fade-in al agregar, fade-out al eliminar.
- Hover en botones: `transition: background 0.2s ease`.
- La ruleta puede tener un efecto de "brillo" o glow cuando termina de girar.

---

## Seguridad

- No usar `innerHTML` para insertar datos del usuario directamente. Usar `textContent` o el mecanismo de `<template>` ya en uso.
- Sanitizar cualquier input antes de mostrarlo.
- No ejecutar código proveniente del query param `?recipe=`.

---

## Lo que NO debe hacerse

- No usar bases de datos.
- No instalar dependencias npm (ni `package.json`).
- No escribir código de servidor.
- No requerir login para usar la app.
- No romper el navbar existente de `index.html` (puede mejorarse pero no eliminarse antes de compararlo con el del compañero).

---

## Prioridad de implementación

1. `storage.js` + `data/recipes.json` con recetas reales.
2. `script.js` — lógica completa de `index.html` (ingredientes, filtros, resultados).
3. `roulette.js` — ruleta funcional con segmentos dinámicos, giro, modal de resultado.
4. `filters.js` — sistema de filtros conectado a la ruleta.
5. `api.js` — integración con TheMealDB para enriquecer el pool de recetas.
6. Atajos de teclado y a11y completa.
7. Funcionalidad de compartir recetas (URL compartible).
