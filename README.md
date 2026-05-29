# Food Roulette 🍽️

> Primer Proyecto Integrador · Módulo de Web Estática · IntegrarTEC 2026 — **Grupo 8**

## Descripción

**Food Roulette** es una aplicación web que ayuda a decidir qué comer según los
ingredientes disponibles, el tiempo y la dificultad. La recomendación es 
provista por una ruleta interactiva que considera los filtros del usuario
(ingredientes incluidos/excluidos, tipo de dieta, tipo de plato y tiempo máximo)
para sugerir recetas acordes.

## Integrantes

- Alex Sanchez (GitHub: Alex-Elian-Sanchez)
- Jonatan Luque (GitHub: jluque-venturing)
- Samuel Balderrama (GitHub: askasbalderrama-gif)

## Idea elegida

**Idea 8 — Food Roulette** (Gastronomía y utilidad diaria).
Desafío obligatorio cumplido: la recomendación considera ingredientes
disponibles, tiempo y dificultad, no es un sorteo al azar.

## Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** propio (Flexbox, Grid, media queries, transiciones y animaciones)
- **JavaScript vanilla** (ES6+, módulos `import`/`export`)
- **Canvas API** para la ruleta
- **localStorage** para persistencia

> Sin frameworks ni librerías de UI (no React, Vue, Bootstrap, Tailwind, etc.).

## Funcionalidades principales

- **Ruleta de recetas** dibujada con Canvas, con animación y resultado según filtros.
- **Sistema de filtros** en tiempo real: dieta, tipo de plato, tiempo máximo,
  ingredientes a incluir/excluir y cantidad de segmentos.
- **Búsqueda por ingredientes** con autocompletado y tags (incluir/excluir).
- **Favoritos con `localStorage`** (requiere iniciar sesión).
- **Página de detalle de receta** con pasos, tags de características e imagen.
- **Autenticación local** (registro / login / logout) con `localStorage`.
- **Modo claro/oscuro** persistente.
- **Traducción Español / Inglés** en toda la interfaz.
- **Historial de ruletas giradas** en `localStorage`.

## Links

- **Repositorio:** https://github.com/jluque-venturing/Project_Food-Roulette_IntegrarTec
- **Deploy:** _(pendiente)_      <!-- Falta el link al deploy cuando lo hagamos -->

## Instrucciones básicas de uso

Es un sitio estático, no requiere instalación ni dependencias.

1. Abrir el sitio desde el **link del deploy**, o localmente con un servidor estático
   (por ejemplo, la extensión **Live Server** de VS Code — abrir `index.html`).
2. En el **Inicio**, escribir los ingredientes disponibles y aplicar filtros para
   buscar recetas.
3. En la **Ruleta**, configurar los filtros y girar para obtener una recomendación.
4. Desde el resultado se puede **ver la receta completa** o **guardarla en favoritos**
   (requiere crear una cuenta / iniciar sesión).
5. Usar los botones de la barra superior para cambiar **idioma** y **tema claro/oscuro**.

> Nota: al abrir los archivos directamente con `file://` algunas funciones que usan
> `fetch` (carga de recetas) pueden no funcionar; usar siempre un servidor estático.

## Estructura del proyecto

```
Project_Food-Roulette_Group8/
├── index.html              # Inicio: búsqueda por ingredientes, filtros y resultados
├── pages/
│   ├── roulette.html       # Ruleta (Canvas) + modal de resultado
│   ├── recipe.html         # Detalle de la receta seleccionada
│   ├── about-us.html       # Sobre nosotros
│   └── contact.html        # Contacto
├── css/
│   ├── style.css           # Estilos globales + paleta + modo oscuro
│   ├── roulette.css        # Estilos de la ruleta
│   ├── recipe.css          # Estilos de la página de detalle
│   └── contact.css         # Estilos de contacto
├── js/
│   ├── script.js           # Lógica de index.html
│   ├── roulette.js         # Ruleta, filtros y modal
│   ├── recipe.js           # Página de detalle de receta
│   ├── filters.js          # Filtrado de recetas
│   ├── storage.js          # Abstracción de localStorage
│   ├── auth.js             # Registro / login / favoritos
│   ├── ui.js               # Inicialización de tema y autenticación
│   ├── theme.js            # Modo claro/oscuro
│   ├── lang.js             # Toggle de idioma
│   └── translator/         # Motor de traducción + diccionarios (en / es)
├── data/
│   ├── recipes.json        # Pool de recetas
│   └── ingredients.json    # Lista de ingredientes para sugerencias
└── README.md
```

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizaron herramientas de IA como apoyo.
El detalle se encuentra en el **Informe de uso de IA**.

<!-- Anexar link a un doc de google, docx de drive, archivo .md de github o 
alguno que documente el uso de la IA en este proyecto cuando lo tengamos -->
