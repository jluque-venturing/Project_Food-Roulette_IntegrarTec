### Lo que le pedí a la IA

1. Actúa como experto en desarrollo web. ¿Cuál es la ubicación más óptima y eficiente dentro del <body> para colocar elementos <template> de HTML5, considerando el flujo de renderizado y el uso de JS para inyección dinámica?"

2. "Quiero crear en base al index.html un archivo javascript que aplique la lógica que se solicita en los comentarios, es decir agregar ingredientes de forma dinámica y recetas como los utilizados en roulette"

3. - Me gustaria que cuente con un login que sea opcional pero que al loggearse se puedan guardar recetas favoritas

4. - Puedes corregir el fallo de que siempre aparece logout y login juntos

5. - Agregá un modo oscuro que sea visible en cada pagina HTML con ícono de sol y Luna que cambien según que modo se encuentre la pagina

6. - Quiero que acomodes el modo oscuro para todos los html, así como el estilo agregado en el navbar, y que el contraste en el modo oscuro cumpla con los estándares WCAG, tratar de mantener todo con etiquetas semanticas

### Análisis del resultado obtenido


1. Resultado del primer prompt:
   - La IA recomendó colocarlos fuera del flujo principal del documento, idealmente antes del cierre de </body>, para mejorar el rendimiento y facilitar la inyección dinámica.

2. Resultado del segundo prompt:
   - Se crearon funciones para cargar ingredientes y recetas desde la estructura de datos del proyecto.
   - Se añadió lógica JS para renderizar ingredientes y recetas en el DOM, de forma similar al comportamiento de la página roulette.

3. Resultado del tercer prompt:
    - Se planteó un sistema de autenticación opcional basado en almacenamiento local para que el usuario pueda guardar recetas favoritas.

4. Resultado del cuarto prompt:
    - Se identificó y corrigió el problema del navbar mostrando ambos botones "login" y "logout" simultáneamente.

5. Resultado del quinto prompt:
   - Se incorporó un selector de modo oscuro con íconos de sol y luna.

6. Resultado del sexto prompt:
   - Se aplicaron ajustes de estilo en todas las páginas y en el navbar, cuidando que el contraste cumpla con WCAG para mejorar la legibilidad.


### Qué debí corregir manualmente y por qué


1. En este caso no tuve que corregir nada manualmente porque esta parte del código la desarrolle de forma manual para que la IA tenga una estructura especifica definida evitando así tener que hacer ajustes adicionales

2. Mucha de la lógica utilizada reescribia código que ya estaba en otra parte del proyecto por lo que tuve que abstraer dicha lógica en archivos separados e importarla

3. Los colores de los elementos que creó ya no cumplian con el contraste mínimo necesario para que se divise fácilmente.
Esta adición no funcionaba en la pagina Roulette.html

4. Los elementos utilizados para representar inicio de sesion y cierre de sesion, se veian de manera simultanea solo si el usuario se loggeaba, por lo que tuve que ocultarlo según el estado en que se encontraba.

5. El modo oscuro no funcionaba dentro de la página roulette.html por lo que junto con el login tuve que abstraer dicha lógica en archivos independientes para luego importalo donde correspondan, en este caso en cada pagina html. Además que muchos cambios de colores tuvieron que ser ajustados para que cumplan con el mínimo de contraste para cumplir con los estándares WCAG

6. En este caso no tuve que corregir nada, devolvió justo lo que estaba esperando en el momento

## Reflexión final

- Es esencial revisar manualmente los resultados para evitar que la IA introduzca contenido irrelevante o estructure mal el archivo.
- La mejor aportación es la capacidad humana de revisar, corregir y dar contexto técnico preciso a lo generado por la IA.
