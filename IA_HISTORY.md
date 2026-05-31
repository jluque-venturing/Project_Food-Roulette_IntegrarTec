## Alex Sanchez
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


## Jonatan Luque
### ¿Qué herramientas de IA utilicé?

- Agente Claude Code
  - Chat
  - Agentes y sub-agentes
  - Skill
- Chat ChatGPT

### ¿Para qué las utilicé?

- Chat de Claude Code para consultar cómo se escribían algunas funciones o estructuras de cada lenguaje que no lograba recordar con exactitud. También para preguntarle si algo que yo quería y que tenía una idea de cómo hacerlo era viable o no.
- Agentes y sub-agentes de Claude Code para hacer cosas difíciles o extensas, además de mejorar algunas porciones de código que no había escrito correctamente o restaba agregarle comentarios.
- Skill de Claude Code [`maestro-semantica`](skill-employed/maestro-semantica.md) creada por mí utilizada para revisar el proyecto en su totalidad en busca de errores de semática y a11y, ordenándolos por orden de dificultad y prioridad para luego poder ser revisados y corregidos por el desarrollador.
- ChatGPT en casi el total de los casos fue para traducir cosas de español a inglés que yo no podía traducir o que había escrito en inglés y quería asegurarme de que estén bien.

### ¿Qué partes del proyecto fueron asistidas por IA?

Sinceramente no hay archivos donde la IA no haya hecho alguna asistencia, exceptuando este mismo. 
Por ejemplo, el traductor y sus archivos relacionados fueron mayormente hechos por mí y corregidos posteriomente en detalles por la IA.
En cambio, la página de la ruleta, sus scripts y sus estilos fueron hechos en su mayoría en primera instancia por la IA por medio de un spec que comparto en la próxima sección.

### ¿Qué prompts o consultas me resultaron mas útiles?

#### Prompt para comparar mi trabajo vs el de la IA
- Contexto: Luego de estar 3 horas haciendo una ruleta a mano y dejarla funcional, la vi y me parecía magnífica. 
Pensé que la IA no podía superarme, que haría algo más básico o que se deformaría al intentar girar, por lo tanto escribí el siguiente prompt:

```
ya hice mi propia ruleta, que esta en el section llamado ruleta. ahora quiero que debajo crees tu un section y   
hagas una ruleta, que sea de la forma mas profesional posible, con un diseño increible, buenos colores,          
detalles, que parezca real, que se pueda, con una flecha que gire en la ruleta y la ruleta tenga un pie. quiero  
que lo hagas lo mejor que puedas.
```

Comparación:
- [Link a mi ruleta](https://drive.google.com/file/d/1JOg2lwCjTsg9z6xPjaIJxbQgdBN2D7U8/view?usp=drive_link)
- [Link a la ruleta de la IA(Claude Code)](https://drive.google.com/file/d/18s--K9I-CvvpSXLqmTg8aptZD1EgSOt5/view?usp=drive_link)

#### SPEC para la Ruleta
[SPEC](SPEC.md)
Este SPEC fue creado con ayuda de ChatGPT y con ayuda de Claude, ambos hicieron su aporte para poder "perfeccionarlo" antes de ponerlo en acción.
Una vez utilizado, hizo exactamente lo que yo quería que hiciera, puedo asegurar que fue más de un 90% exacto, tanto en lo visual como en el código. Esto está en los commits `42953d1` & `e3a34a5`

#### Prompt para página de vista de recetas
```
En la tarjeta de premio de la ruleta quiero que agregues al lado del botón "spin", a su lado izquierdo, otro botón para ver la receta completa. Esto cambiará la página de la ruleta por otra que no se encuentra en el nav (pero deberá mantener el nav). Esta página deberá tener en grande arriba (debajo del nav) un header con el título de la comida en un color conveniente según el tipo de comida, orientación a veganos u omnívoros, etc. (ej: naranja, marrón, verde, rojo) y ocupando un 35% de la página desde el lado izquierdo deberá estar en un aside la imagen de la comida, separada por una línea divisoria del lado derecho de la página, la cual tendrá en la parte superior una sección con tags de colores que muestren características rápidas de la comida como momento del día para comerla, orientación hacia qué personas, tiempo, velocidad, etc. Debajo de ello deberás poner todos los pasos de la receta de forma prolija y ordenada respetando un estilo profesional y minimalista, manteniendo una buena semántica en toda la página. tambien debera tener el boton para poder añadir a favoritos
```
- Cumplió al 100% con lo que yo esperaba visualizar. No tanto así con el código así que realicé unos pequeños ajustes.

#### Prompt para crear la skill `maestro-semantica`
```
Revisa en el material del curso todo lo que tenga que ver con semantica y accesibilidad (a11y) y quiero que estudies bien eso y tambien las consignas del proyecto que estan en ese material en proyecto1/proyecto-1-integrartec-2026.pdf. Luego quiero que con toda la informacion disponible y que aprendas, hagas una skill de claude para este proyecto donde seas un maestro de semantica y a11y, y tu tarea en esa skill sera revisar exhaustivamente todo el proyecto de punta a punta buscando puntos debiles en cuanto a esos conceptos que hayas aprendido y al final hagas un informe donde digas que tales archivos tienen todo bien, tales tienen cosas que estan mal, y tales tienen cosas que no estan mal pero se pueden mejorar o corregir, y entonces me listes todos los que estan mal y los que se pueden mejorar y me digas por cada uno como los mejorarias/cambiarias, y yo ire decidiendo como y cuales mejorar en base a eso, tambien proponiendo yo mis propios cambios.
```
- Lo leyó y tuvo 2 consultas: 
  - Qué nombre le damos al comando? Le dije maestro-semantica
  - Corrijo automáticamente los errores encontrados? Le dije que no.
- Luego creó la skill [`maestro-semantica`](skill-employed/maestro-semantica.md)

### ¿Qué respuestas de la IA tuve que corregir?

- Casi no tuve que corregir respuestas de la IA porque al hacer prompts extensas ya no cometía errores. Pedía usualemente cosas puntuales y pequeñas y las sugería o hacía de manera correcta.
- Corregí algunos colores que no tenían buen contraste, código diferente al que nos enseñaron, comentarios excesivos, sugerencias de nombres en español.

### ¿Qué problemas tuve al trabajar con IA?

- Tuve muy pocos, la IA quería irse de scope u optar por el uso de tecnologías no permitidas en este tp, además del problema más molesto... Intentaba hacer los commits ella misma seguidamente, a lo cual no le permití hacer ninguno porque no confío en la IA para ello. 
- Luego de las clases sobre IA y el feedback del examen comencé a hacer más largas mi prompts e incluí el uso de skills para ciertas cosas que se me dificultan. Desde entonces no tuve problemas grandes con la IA ni en este proyecto ni en mi vida diaria. 

### ¿Qué aprendí durante el proceso?

- Aprendí que a pesar de estar muy acostumbrado y encariñado a las IAs de chat, no podía seguir tratando a los agentes como chats. Empezar a usarlos de tal manera fue un cambio un tanto incómodo y diferente a lo que venía acostumbrado.
- Aprendí que si le comunico al agente lo que quiero con lujo de detalle (o al menos eso intento hacer) trabaja de una forma mucho más ordenada, sin idas y vueltas, y se apega más a lo que en mi mente tenía planeado. 
- Aprendí que puede ocurrir que yo me esfuerce y haga grandes cosas de manera manual, pero que de un momento a otro una IA con una buena prompt puede superar mi trabajo en cuestión de minutos; Esto suponiendo que detrás de aquel prompt hay un programador con buen criterio y que sabe lo que hace, porque quizás la IA puede superar muchos aspectos de lo que yo hice pero flaquear en otros que también son importantes.
- Aprendí que por más que le digas a una IA en sus rules y memoria (en el caso de Claude) que no debe hacer algo, igualmente intentará hacerlo (como el caso de querer hacer commits)
- Aprendí que el uso de skills ayuda de alguna forma a que la IA esté más "enfocada". Esto resulta en un mejor desempecho de la IA en un trabajo puntual, en contraste con lo que podría ser un prompt por más que esté bien desarrollado. (Usé prompts similares a la skill y no dieron el mismo resultado, fue mejor el de la skill)

### ¿Qué partes del código puedo explicar?

- Páginas roulette.html, about-us.html, recipe.html y el index.html
- Parte de los estilos de esas páginas (css no es mi fuerte)
- Scripts del traductor, scripts similares a componentes de react (navbar, login, footer), autocompletado

### ¿Qué decisiones tomamos como grupo sin depender de la IA?

- La planificación sobre todo lo que ibamos a hacer en este proyecto la planificamos nosotros mismos por medio de una reunión en meet al inicio y luego charlas en un grupo de wsp donde proponiamos ideas. Cuando confirmabamos esas ideas, las anotabamos en un trello donde nos podemos hacer un seguimiento de las tareas por medio de tres columnas: 
  - Pendientes: Tareas aprobadas para hacer (algunas con usuario designado)
  - En Curso: Para dar visibilidad al equipo sobre en qué estabamos trabajando (evitando mensajes de whatsapp innecesarios)
  - Terminadas: Para llevar allí las tareas que hayamos implementado y pusheado al repositorio.
Por lo tanto, toda la planificación la hicimos sin depender de la IA, tanto las ideas y estructuras como los detalles de cada una de las tareas. 

### ¿Hubo código sugerido por IA que descarté? ¿Por qué?

- Sí, código que se salía de los límites establecidos por la consigna del proyecto. Código que no llevaba a la solución que yo esperaba también.
- Un caso puntual fue el uso de una [API](https://www.themealdb.com/api/json/v1/1), la cual el un inicio pensamos utilizar para obtener directamente las recetas e ingredientes. Pero notamos que algunas imágenes e ingredientes de la API no concordaban con la receta, por lo tanto decidimos reemplazar partes de las recetas y sus imágenes con otras encontradas por internet y también las sugeridas por la IA. Luego de hacerlo, fueron eliminados los archivos que solo tenían como función utilizar esta API y proveerla a los demás, de los cuales también se quitó todo rastro de ella. 