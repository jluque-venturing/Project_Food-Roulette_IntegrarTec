## Alex Sanchez
### ¿Qué herramientas de IA utilicé?

   -Copilot (Haiku 4.5)
   -Gemini (3.5 Flash)

### ¿Para qué las utilicé?
   -Utilice Gemini para poder entender y/o repasar conceptos especificos, además de utilizarlo para tareas menores que no requerían tanta lógica detrás como un diseño basico para un boton o una recomendación en cuanto a ideas de funcionalidades.
   -Copilot para optimizar tiempos de escritura de código, reduciendo el tiempo que estaba codeando y aumentando el tiempo en que se realizaban mejoras. Tambien para escribir lógica de cero que quizas no comprendía como realizarla pero que tenía la idea de como debía ser.
   También utilice esta herramienta para corregir errores de semántica para optimizar y dejar más limpio al código.

### ¿Qué partes del proyecto fueron asistidas por IA?

   Todos los archivos creados fueron asistidos con IA hasta cierto punto, por ejemplo el archivo index.html fue creado a mano por mi pero a medida que se fueron implementando más funcionalidades, fue siendo modificado a la par por la IA.
   La única excepción seria este mismo archivo.

### ¿Qué prompts o consultas me resultaron mas útiles?

#### Actúa como experto en desarrollo web. ¿Cuál es la ubicación más óptima y eficiente dentro del <body> para colocar elementos <template> de HTML5, considerando el flujo de renderizado y el uso de JS para inyección dinámica?"
   - Cree el archivo index.html de forma manual pero me surgió una duda en cuanto al uso de las etiquetas <template> , puesto que mi idea era inyectar via DOM los ingredientes y recetas correspondientes.
   El uso del prompt no solo me ayudo a agregar esta parte del trabajo sino que me enseño a futuro como manejar dicho caso.

#### "Quiero crear en base al index.html un archivo javascript que aplique la lógica que se solicita en los comentarios, es decir agregar ingredientes de forma dinámica y recetas como los utilizados en roulette"
   Cumplió con lo esperado casi a la perfección, me ayudó a estructurar la lógica del index tomando como ejemplo la ruleta para que no ocurra divergencia de lógica y se cree lo mismo por segunda vez, se obtuvo:
   - Se crearon funciones para cargar ingredientes y recetas desde la estructura de datos del proyecto.
   - Se añadió lógica JS para renderizar ingredientes y recetas en el DOM.

#### Me gustaria que cuente con un login que sea opcional pero que al loggearse se puedan guardar recetas favoritas
   Una vez planteado la problemática y creado los archivos con una vaga lógica, le pedi a Copilot que termine de pulir los detalles y agregue permanencia con localStorage, así como autenticación que habiliten el uso de *favoritos*
   - Se planteó un sistema de autenticación opcional basado en almacenamiento local para que el usuario pueda guardar recetas favoritas.

#### Puedes corregir el fallo de que siempre aparece logout y login juntos
   Seguido al prompt anterior, la respuesta que generó la IA no fue del todo precisa, puesto que si bien agregó la lógica faltaba mejorar el diseño, por lo que este prompt permitió solucionar esta problemática añadiendo lógica de estados.

#### Agregá un modo oscuro que sea visible en cada pagina HTML con ícono de sol y Luna que cambien según que modo se encuentre la pagina
   Quise agregar un modo oscuro a la página para mejorar la accesibilidad y poder satisfacer a los usuarios que tengan preferencia por una gama de colores más oscuros.
   - Se incorporó un selector de modo oscuro con íconos de sol y luna. Guardando en el localStorage el último modo seleccionado y se cambiaron los colores a un tono que contraste con el anterior modo claro, manteniendo el color negro como principal. Tambien se incluyó lógica que muestre un sol y una luna según el modo donde nos encontremos en dicho momento.

#### Quiero que acomodes el modo oscuro para todos los html, así como el estilo agregado en el navbar, y que el contraste en el modo oscuro cumpla con los estándares WCAG, tratar de mantener todo con etiquetas semanticas
   El modo oscuro no se estaba estableciendo correctamente a todas las páginas html por lo que tuve que solicitarle una mejora tanto en accesibilidad como en color.
   Se aplicaron ajustes de estilo en todas las páginas y en el navbar, asegurando que el contraste cumpla con WCAG para mejorar la legibilidad.

### ¿Qué respuestas de la IA tuve que corregir?

   En el caso del segundo prompt solicitado mucha de la lógica utilizada reescribia código que ya estaba en otra parte del proyecto por lo que tuve que abstraer dicha lógica en archivos independientes e importarla a los demás archivos para centralizarlo.

   Los elementos utilizados para representar inicio de sesion y cierre de sesion, se veian de manera simultanea.
   Al generarse el login, los colores de los elementos que creó ya no cumplian con el contraste mínimo necesario para que se divise fácilmente, además que esta adición no funcionaba en la pagina Roulette.html.

   El modo oscuro no funcionaba dentro de la página roulette.html por lo que junto con el login tuve que volver abstraer dicha lógica en archivos independientes, en este caso en cada pagina html. Además que muchos cambios de colores del modo oscuro tuvieron que ser ajustados para que cumplan con el mínimo de contraste para cumplir con los estándares WCAG.

### ¿Qué problemas tuve al trabajar con IA?

- Tuve problemas para expresar en palabras las ideas que tenía en mi cabezam muchas veces omitia detalles que quizas tiendo a obviar pero son necesarios en cuanto a un prompt de IA, esto trajo varios problemas en cuanto a Semantica y repetición de lógica utilizada en otra parte del proyecto.
- Fuera de eso, la IA me generó la respuesta que esperaba luego de unos retoques, por lo que no considero que sea un problema tan grande pero si me inspira a mejorar mi escritura de prompts.

### ¿Qué aprendí durante el proceso?

- Aprendí gracias a las clases de manejo de IA y a la práctica que lo mejor es que luego de cada seccion trabajada se borre el contexto anterior porque a diferencia de mejorar, puede llegar a alucinar bastante omitiendo incluso detalles solicitados en el mismo prompt.
- Recorde y aprendí varios conceptos de javaScript que no utilizaba hace bastante tiempo y pude mejorarlos con ayuda y explicación de la IA.
- Comprendi de mejor manera que la IA es una herramienta que puede agilizar muchisimo en trabajo pero que depende también mucho en que manos se encuentre, porque incluso con prompts bien definidos, puede llegar a cometer errores y uno mismo tiene que identificarlos y mejorarlos.
- Pude utilizar por primera vez un agente de IA y descubrí que es una gran mejora comparado con los chats, pero que a la vez requiere de un cuidado mucho mayor puesto que tiene acceso a partes mucho más delicadas y puede cometer errores irreversibles si no se tienen en cuenta (como commits automaticos).

### ¿Qué partes del código puedo explicar?

- Las páginas index.html, roulette.html, about-us.html, contact.html
- Los estilos de las mismas, así como el modo oscuro incluido en cada una
- Scripts del modo oscuro, login, traductor

### ¿Qué decisiones tomamos como grupo sin depender de la IA?

- Primeramente planteamos la idea general del proyecto por meet y incluimos todas las posibles ideas y borradores en un pdf, luego nos fuimos manejando mediante el uso de whatsapp para coordinar cambios y Trello para registrar los avances plasmandolos en 3 columnas que determinaban su estado y el responsable (pendiente, en curso (responsable) , finalizado(por quien))

### ¿Hubo código sugerido por IA que descarté? ¿Por qué?

- Hubo código que no llevaba a la solución que yo esperaba y código que se iba por las ramas y sugeria alternativas con frameworks.
- Tuvimos un caso que fue el uso de la API [API](https://www.themealdb.com/api/json/v1/1), donde algunas imágenes e ingredientes de la API no concordaban con la receta, por lo que decidimos reemplazar partes de las recetas y sus imágenes con otras encontradas por internet y también las sugeridas por la IA.
Luego borramos los archivos que solo tenían como función utilizar esta API y proveerla a los demás, de los cuales también se quitó todo rastro de ella.

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