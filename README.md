# Food Roulette 🍽️

**Primer Proyecto Integrador · Módulo de Desarrollo Web Estático · IntegrarTEC 2026**  
**Grupo 8**

---

## Descripción del Proyecto

**Food Roulette** es una aplicación web interactiva que ayuda a los usuarios en la selección de recetas personalizadas. Mediante una interfaz intuitiva con ruleta interactiva, el sistema recomienda platos considerando múltiples criterios: ingredientes disponibles, tiempo de preparación, nivel de dificultad y preferencias dietéticas.

El enfoque diferenciador de la aplicación es que la recomendación no se basa en un sorteo aleatorio, sino en un algoritmo de filtrado que analiza inteligentemente los parámetros del usuario para sugerir recetas pertinentes.

---

## Equipo de Desarrollo

 - Alex Sanchez | Github [Alex-Elian-Sanchez](https://github.com/Alex-Elian-Sanchez) 
- Jonatan Luque | Github [jluque-venturing](https://github.com/jluque-venturing) 
- Samuel Balderrama | Github [askasbalderrama-gif](https://github.com/askasbalderrama-gif) 

---

## Objetivo

Desarrollar una herramienta funcional y accesible que resuelva el desafío cotidiano de decidir qué cocinar, integrando gestión de ingredientes, preferencias personales y restricciones de tiempo. La solución implementa un sistema inteligente de recomendación que **cumple con el desafío obligatorio**: la sugerencia de recetas considera ingredientes, tiempo y dificultad, no es aleatoria.

## Stack Tecnológico

La aplicación se desarrolló siguiendo los requisitos del proyecto con tecnologías base web:

**HTML5**  Estructura semántica y accesible del contenido 
**CSS3**  Diseño responsivo con Flexbox, Grid, media queries, transiciones y animaciones personalizadas 
**JavaScript (ES6+)**  Lógica de aplicación vanilla con módulos `import`/`export` 
**Canvas API**  Renderizado y animación de la ruleta interactiva 
**localStorage API**  Persistencia de datos (favoritos, historial, preferencias) 

**Restricciones del Proyecto:**  
No se utilizan frameworks UI, librerías de estilos externas (Bootstrap, Tailwind) ni componentes de terceros (React, Vue, etc.). El CSS y JavaScript son completamente personalizados.

## Funcionalidades Principales

### Gestión de Ingredientes y Búsqueda
- **Búsqueda inteligente** de ingredientes con autocompletado en tiempo real
- **Sistema de etiquetas** para incluir/excluir ingredientes
- **Filtrado avanzado** con múltiples criterios simultáneos

### Motor de Recomendación
- **Ruleta interactiva** dibujada con Canvas, con animación fluida
- **Algoritmo de filtrado** que considera: dieta, tipo de plato, tiempo máximo, ingredientes disponibles
- **Cantidad de segmentos configurable** en la ruleta

### Gestión de Recetas
- **Página de detalle** con pasos de preparación, imágenes e información nutricional
- **Sistema de favoritos** con persistencia mediante `localStorage`
- **Historial de ruletas giradas** en `localStorage`

### Autenticación y Personalización
- **Sistema de autenticación local** (registro, login, logout)
- **Gestión de favoritos** vinculada a cuenta de usuario
- **Modo claro/oscuro** con persistencia de preferencias
- **Soporte multiidioma** (Español e Inglés) en toda la interfaz

### Experiencia de Usuario
- Interfaz responsiva y adaptable a diferentes dispositivos
- Transiciones y animaciones fluidas
- Acceso inmediato sin necesidad de instalación

## Enlaces

| **Repositorio**  [GitHub - Project_Food-Roulette_IntegrarTec](https://github.com/jluque-venturing/Project_Food-Roulette_IntegrarTec) 
| **Deploy** _(En desarrollo)_

## Guía de Uso

### Requisitos
- Navegador web moderno con soporte para:
  - HTML5 Canvas
  - localStorage API
  - ES6+ JavaScript
  - CSS Grid y Flexbox

### Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jluque-venturing/Project_Food-Roulette_IntegrarTec.git
   cd Project_Food-Roulette_IntegrarTec
   ```

2. **Ejecutar un servidor local** (obligatorio para funciones de `fetch`):
   - **Opción A:** Usar **Live Server** en VS Code
     - Instalar la extensión "Live Server"
     - Clic derecho en `index.html` → "Open with Live Server"
   - **Opción B:** Usar Python
     ```bash
     python -m http.server 8000
     # Luego acceder a http://localhost:8000
     ```
   - **Opción C:** Usar Node.js (con `http-server`)
     ```bash
     npx http-server
     ```

3. **Acceder a la aplicación** desde el navegador

>  **Importante:** No abrir los archivos directamente con `file://` en el navegador, ya que las llamadas `fetch` para cargar recetas no funcionarán. Utilizar siempre un servidor local.

### Flujo de Usuario

1. **Página de Inicio**
   - Escribir ingredientes disponibles en el buscador
   - Aplicar filtros
   - Ver recetas recomendadas
   - Guardar recetas en favoritos (requiere cuenta de usuario)

2. **Ruleta de Recomendación**
   - Configurar preferencias y filtros
   - Girar la ruleta para obtener recomendación personalizada

3. **Detalle de Receta**
   - Consultar ingredientes, pasos de preparación e información adicional
   - Marcar como favorita o compartir

4. **Personalización**
   - Cambiar idioma (Español ↔ Inglés)
   - Activar/desactivar modo oscuro
   - Crear cuenta y gestionar favoritos

##  Estructura del Proyecto

```
Project_Food-Roulette_IntegrarTec/
│
├── index.html                      # Página de inicio: búsqueda y filtrados
├── README.md                       # Documentación del proyecto
│
├── pages/                          # Vistas HTML
│   ├── roulette.html              # Interfaz de la ruleta interactiva
│   ├── recipe.html                # Detalle completo de receta
│   ├── about-us.html              # Información del equipo
│   └── contact.html               # Formulario de contacto
│
├── css/                            # Estilos
│   ├── style.css                  # Estilos globales, paleta de colores, modo oscuro
│   ├── roulette.css               # Estilos específicos de la ruleta
│   ├── recipe.css                 # Estilos de la página de receta
│   └── contact.css                # Estilos del formulario de contacto
│
├── js/                             # Lógica de aplicación
│   ├── script.js                  # Lógica principal de index.html
│   ├── roulette.js                # Lógica de ruleta, filtros y modal de resultado
│   ├── recipe.js                  # Lógica de página de detalle
│   ├── filters.js                 # Motor de filtrado de recetas
│   ├── storage.js                 # Abstracción de localStorage
│   ├── auth.js                    # Gestión de autenticación y favoritos
│   ├── ui.js                      # Inicialización de UI y autenticación
│   ├── theme.js                   # Control de modo claro/oscuro
│   ├── lang.js                    # Control de idioma
│   ├── navbar.js                  # Funcionalidad de barra de navegación
│   ├── autocomplete.js            # Sistema de autocompletado
│   ├── contact.js                 # Lógica de formulario de contacto
│   └── translator/                # Motor de traducción
│       ├── translator.js          # Lógica de traducción
│       └── translations/          # Diccionarios de idiomas
│           ├── es.js              # Traducciones al Español
│           └── en.js              # Traducciones al Inglés
│
├── data/                           # Datos estáticos
│   ├── recipes.json               # Base de datos de recetas
│   └── ingredients.json           # Lista de ingredientes para autocompletado
│
└── [otros archivos]               # Recursos adicionales según sea necesario
```


##  Características Técnicas Destacadas

### Algoritmo de Filtrado Inteligente
- Evaluación simultánea de múltiples criterios (ingredientes, dieta, tiempo, dificultad)
- Recorrido eficiente de la base de datos JSON
- Sugerencias personalizadas basadas en las preferencias del usuario

### Ruleta Interactiva con Canvas
- Renderizado dinámico basado en cantidad de recetas disponibles
- Animación de rotación con easing personalizado
- Cálculo preciso de ángulos para determinar resultado

### Sistema de Traducción Multiidioma
- Arquitectura modular para adicionar nuevos idiomas
- Traducción en tiempo real sin recargar la aplicación
- Soporte para plurales y textos contextuales

### Persistencia de Datos
- Sincronización automática entre pestañas/ventanas del navegador
- Versionado implícito de datos para evitar conflictos
- Fallback automático en caso de datos corruptos

---

## Consideraciones de Diseño y UX

- **Paleta de colores:** Cálida y acogedora, inspirada en gastronomía (naranjas, verdes, azules)
- **Tipografía:** Legible y moderna para máxima accesibilidad
- **Responsividad:** Adaptable a dispositivos móviles, tablets y escritorio
- **Accesibilidad:** Navegación clara, contraste adecuado, HTML semántico WCAG
- **Performance:** Carga instantánea sin dependencias externas, optimizado para conexiones lentes
- **Animaciones:** Suave y significativa, mejora UX sin distraer

---

##  Notas de Desarrollo

- **Control de versiones:** Git + GitHub con commits descriptivos
- **Estándar de código:** ES6+ moderno, nomenclatura consistente, comentarios explicativos
- **Testing:** Validado en navegadores modernos (Chrome, Firefox, Edge, Safari)
- **Compatibilidad:** HTML5, CSS3, JavaScript ES6+ estándar (sin polyfills)
- **Optimización:** Minimización de código y assets para producción (pendiente deploy)

---

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizaron herramientas de IA como apoyo.
El detalle completo se encuentra en el [Informe de uso de IA (IA_HISTORY.md)](IA_HISTORY.md).

---


## Agradecimientos

Agradecemos a los docentes y tutores de IntegrarTEC por la orientación y apoyo en el desarrollo de este proyecto integrador.