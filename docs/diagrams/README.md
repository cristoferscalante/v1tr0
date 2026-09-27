# Diagramas

Generados con la skill [`diagram-design`](https://github.com/cathrynlavery/diagram-design),
adaptada a la marca V1TR0 (gris carbón `#1e2123`, tinta `#e6f7f6`, acento turquesa
`#08A696`, Bricolage Grotesque + Geist Mono). Los tokens viven en
`.claude/skills/diagram-design/references/style-guide.md`, que está en `.gitignore`
— ver CLAUDE.md para reinstalar la skill.

Cada archivo es HTML autocontenido: se abre directo en el navegador, sin build ni
dependencias. La única petición externa es Google Fonts.

| Archivo | Tipo | Para qué |
|---|---|---|
| `recorrido-proyecto.html` | user journey | Cómo vive el cliente un proyecto. El ánimo cae en desarrollo — la etapa más larga y la única sin nada que mostrar. Es el argumento de por qué existen la franja de resumen y la bitácora. |
| `fases-proyecto.html` | gantt | Plan de fases para el informe del cliente. Lleva estilos `@media print`: en papel se invierte a tinta sobre blanco en A4 apaisado. |
| `rutas-y-autorizacion.html` | architecture | Qué protege cada capa. El middleware es la frontera; cada ruta de datos vuelve a comprobar por su cuenta. |
| `modelo-datos-tareas.html` | ER | Las ocho tablas alrededor de `projects`. |

## Recortes por presupuesto de complejidad

La skill limita cada tipo para que el diagrama siga siendo legible. Lo que quedó fuera:

- **ER**: el límite son 8 entidades y el modelo tiene 9. Se dejó fuera
  `phase_task_subtasks` — es un detalle de una tarea, no cambia la forma del modelo.
- **Arquitectura**: 8 nodos de 9 permitidos. El redirect a `/login` va como sublínea
  del middleware en vez de como nodo propio.
- **Recorrido**: 5 etapas de 6, y 2 marcadores de fricción, ambos en el valle.
  Marcar todas las etapas borraría la señal.

## Regenerar

Los diagramas están escritos a mano; no hay paso de compilación. Para revisarlos
en pantalla basta abrirlos. Si cambia el esquema de la base, el que hay que
actualizar es `modelo-datos-tareas.html`.
