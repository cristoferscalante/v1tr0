import type { RoutePage } from "./tipos"

/**
 * Ruta "software": qué es contratar desarrollo con nosotros.
 *
 * La página responde a una sola pregunta —"¿qué estoy comprando exactamente?"—
 * y usa los principios como prueba: SOLID explica por qué el sistema aguanta
 * cambios, Gestalt por qué la interfaz se entiende sin manual.
 */
export const softwarePage: RoutePage = {
  slug: "contratar-software",
  subcategoryId: "contratar-software",
  category: "Cómo trabajamos",
  name: "Contratar software",
  seo: {
    title: "Contratar software a medida en Colombia: cómo funciona",
    description:
      "Qué incluye contratar desarrollo de software a medida con V1TR0: fases, entregables, precios por alcance y los principios SOLID y Gestalt con los que construimos. Explicado sin jerga.",
    keywords: [
      "contratar software a medida",
      "desarrollo de software Colombia",
      "cuánto cuesta una aplicación web",
      "fases de un proyecto de software",
      "principios SOLID explicados",
      "principios de Gestalt en interfaces",
      "empresa de desarrollo web",
    ],
  },
  hero: {
    headline: "Contratar software no es comprar código: es comprar un sistema que aguanta cambios",
    subheadline:
      "Te explicamos, paso a paso y sin tecnicismos, qué pasa desde que nos escribes hasta que tu equipo usa el sistema todos los días: qué decides tú, qué decidimos nosotros, qué recibes y qué pasa después de entregar.",
    highlights: [
      "Alcance cerrado por escrito",
      "Entregas cada 2 semanas",
      "El código es tuyo",
      "Soporte después de entregar",
    ],
  },
  zones: {
    title: "Las cinco etapas de un proyecto",
    description:
      "Ningún proyecto empieza por programar. Este es el recorrido completo, con lo que se firma y lo que se entrega en cada paso.",
    items: [
      {
        number: "01",
        title: "Diagnóstico: entender el problema antes de proponer solución",
        description:
          "Una o dos sesiones para mapear cómo trabajas hoy, dónde se pierde tiempo y qué números deberían moverse. Salimos con el problema escrito en una frase y con las decisiones que hay que tomar antes de programar nada.",
        tags: ["Sesión de 90 min", "Sin costo", "Mapa del proceso actual"],
        wireframe: "story",
      },
      {
        number: "02",
        title: "Propuesta: alcance, precio y fecha, todo por escrito",
        description:
          "Un documento con el alcance dividido en entregables, qué queda explícitamente fuera, el precio por fases y el calendario. Si algo no está en ese documento, no está en el proyecto: así nadie descubre sorpresas a mitad de camino.",
        tags: ["Alcance cerrado", "Precio por fases", "Fuera de alcance explícito"],
        wireframe: "form",
      },
      {
        number: "03",
        title: "Diseño: ver la interfaz antes de que exista",
        description:
          "Prototipos navegables de las pantallas clave. Aquí aplicamos Gestalt: agrupamos lo que va junto, jerarquizamos lo importante y dejamos el color para señalar la acción. Corregir aquí cuesta minutos; corregir en código cuesta semanas.",
        tags: ["Prototipo navegable", "Revisión contigo", "Sistema de diseño"],
        wireframe: "hero",
      },
      {
        number: "04",
        title: "Construcción: entregas cada dos semanas, no una entrega final",
        description:
          "Cada quincena ves una versión funcionando en un enlace privado y puedes usarla. Eso convierte el proyecto en una serie de correcciones pequeñas en vez de una única entrega donde ya es tarde para opinar.",
        tags: ["Demo quincenal", "Ambiente de pruebas", "Cambios acordados"],
        wireframe: "admin",
      },
      {
        number: "05",
        title: "Entrega y acompañamiento",
        description:
          "Publicamos, capacitamos a tu equipo y te entregamos el repositorio, los accesos y la documentación. Después queda un periodo de garantía y, si quieres, un plan de mantenimiento mensual.",
        tags: ["Repositorio a tu nombre", "Capacitación", "Garantía incluida"],
        wireframe: "proof",
      },
    ],
  },
  comparison: {
    title: "Tres formas de trabajar con nosotros",
    description:
      "El mismo equipo y los mismos principios; cambia el tamaño del compromiso. Si no sabes cuál te sirve, el diagnóstico lo aclara.",
    rows: [
      { id: "para", label: "Para quién es" },
      { id: "tiempo", label: "Tiempo típico", hint: "De la firma a producción" },
      { id: "alcance", label: "Alcance", hint: "Qué tan cerrado queda" },
      { id: "diseno", label: "Diseño de interfaz" },
      { id: "codigo", label: "Código y repositorio a tu nombre" },
      { id: "soporte", label: "Soporte posterior" },
    ],
    types: [
      {
        id: "puntual",
        name: "Proyecto puntual",
        tagline: "Una necesidad concreta y acotada",
        values: {
          para: "Landing, sitio corporativo, automatización de una tarea",
          tiempo: "2 a 6 semanas",
          alcance: "Cerrado",
          diseno: true,
          codigo: true,
          soporte: "30 días de garantía",
        },
        example: "Sulkar SAS",
      },
      {
        id: "producto",
        name: "Producto a medida",
        tagline: "Un sistema que tu operación usa a diario",
        featured: true,
        values: {
          para: "Plataformas, e-commerce, sistemas de gestión",
          tiempo: "2 a 5 meses",
          alcance: "Por fases, revisable entre fases",
          diseno: true,
          codigo: true,
          soporte: "Garantía + plan mensual opcional",
        },
        example: "Pet Gourmet",
      },
      {
        id: "evolutivo",
        name: "Equipo continuo",
        tagline: "El sistema ya existe y tiene que seguir creciendo",
        values: {
          para: "Producto vivo con mejoras mes a mes",
          tiempo: "Continuo, cupo mensual",
          alcance: "Prioridades acordadas cada mes",
          diseno: true,
          codigo: true,
          soporte: "Incluido",
        },
      },
    ],
  },
  flows: {
    title: "Qué recorrido sigue una decisión",
    description:
      "Dos recorridos que explican cómo se toman las decisiones durante el proyecto: el de una idea nueva y el de un problema en producción.",
    items: [
      {
        id: "idea",
        title: "De la idea a producción",
        description: "Lo que pasa cuando pides una funcionalidad nueva.",
        featured: true,
        steps: [
          { label: "La escribes", icon: "FileText" },
          { label: "La estimamos", icon: "Ruler" },
          { label: "La apruebas", icon: "Handshake" },
          { label: "Se construye", icon: "GitBranch" },
          { label: "La revisas en demo", icon: "Eye" },
          { label: "Sale a producción", icon: "Rocket" },
        ],
      },
      {
        id: "incidencia",
        title: "Cuando algo falla",
        description: "Ruta de una incidencia reportada, con tiempos de respuesta acordados.",
        steps: [
          { label: "Reporte", icon: "MessageCircle" },
          { label: "Reproducción", icon: "Search" },
          { label: "Corrección", icon: "Wrench" },
          { label: "Prueba", icon: "ShieldCheck" },
          { label: "Aviso de cierre", icon: "Mail" },
        ],
      },
    ],
  },
  benefits: {
    title: "Qué ganas al contratarnos",
    description: "No son características técnicas: es lo que cambia en tu operación y en tu bolsillo.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Sin dependencia del proveedor",
        description:
          "El repositorio, los dominios y los accesos quedan a tu nombre desde el primer día. Si un día quieres cambiar de equipo, puedes hacerlo sin rehacer nada.",
      },
      {
        icon: "Clock",
        title: "Sabes en qué va el proyecto",
        description:
          "Demo cada dos semanas y un tablero donde ves el avance. Nunca tienes que preguntar si vamos bien: lo ves funcionando.",
      },
      {
        icon: "Gauge",
        title: "Cambiar después no cuesta una fortuna",
        description:
          "Es exactamente para lo que sirve SOLID: agregar una forma de pago o un reporte nuevo toca una pieza, no todo el sistema.",
      },
      {
        icon: "MousePointerClick",
        title: "Tu equipo lo entiende sin manual",
        description:
          "Las interfaces se diseñan con principios de percepción: lo que va junto se ve junto, lo importante pesa más, el color señala la acción.",
      },
      {
        icon: "BarChart3",
        title: "Medible desde el primer día",
        description:
          "Definimos contigo dos o tres números que el sistema debe mover y los dejamos visibles en un panel, no en una hoja suelta.",
      },
      {
        icon: "Users",
        title: "Un interlocutor, no un call center",
        description:
          "Hablas siempre con quien construye. Sin capas intermedias que traduzcan mal lo que necesitas.",
      },
    ],
  },
  principles: [
    {
      eyebrow: "Cómo se sostiene el código",
      title: "SOLID: por qué tu sistema va a aguantar los cambios",
      description:
        "Cinco reglas de construcción con más de veinte años de uso en la industria. Se resumen en una idea: cada pieza hace una cosa y se puede reemplazar sin romper las demás. Traducido a tu factura, es la diferencia entre que un cambio cueste horas o cueste semanas.",
      items: [
        {
          label: "S — Responsabilidad única",
          title: "Cada pieza hace una sola cosa",
          description:
            "El módulo que cobra no es el que envía correos ni el que genera reportes. Cada uno vive por su lado.",
          payoff: "cambiar la facturación no puede tumbar los envíos.",
          diagram: "srp",
        },
        {
          label: "O — Abierto/cerrado",
          title: "Se extiende sin abrirlo",
          description:
            "Lo que ya funciona y está probado no se toca: lo nuevo se enchufa como una pieza aparte.",
          payoff: "agregar un medio de pago no obliga a reprobar todo el sistema.",
          diagram: "ocp",
        },
        {
          label: "L — Sustitución",
          title: "Las piezas equivalentes son intercambiables",
          description:
            "Cualquier implementación que cumpla el mismo contrato encaja en el mismo hueco, sin excepciones escondidas.",
          payoff: "puedes cambiar de proveedor de correo o de pagos sin reescribir la lógica.",
          diagram: "lsp",
        },
        {
          label: "I — Interfaces pequeñas",
          title: "Nadie carga con lo que no usa",
          description:
            "Los contratos entre piezas son mínimos: cada consumidor pide exactamente lo que necesita.",
          payoff: "menos superficie que romper y menos que probar en cada cambio.",
          diagram: "isp",
        },
        {
          label: "D — Inversión de dependencias",
          title: "Todo depende del contrato, no del detalle",
          description:
            "La lógica de tu negocio no sabe si detrás hay Postgres, Stripe o un archivo: solo conoce el contrato.",
          payoff: "migrar de infraestructura es cambiar una pieza, no reescribir el producto.",
          diagram: "dip",
        },
      ],
    },
    {
      eyebrow: "Cómo se lee la interfaz",
      title: "Gestalt: por qué se entiende sin que nadie lo explique",
      description:
        "Principios de percepción visual: describen cómo el ojo agrupa, separa y jerarquiza antes de que el usuario alcance a leer. Los usamos para que tu equipo o tus clientes sepan dónde hacer clic sin capacitación previa.",
      items: [
        {
          label: "Proximidad",
          title: "Lo que va junto, se ve junto",
          description: "El espacio agrupa mejor que las cajas y las líneas. Dos bloques separados se leen como dos temas.",
          payoff: "menos preguntas de tu equipo sobre dónde va cada dato.",
          diagram: "proximidad",
        },
        {
          label: "Semejanza",
          title: "Lo que se parece, se comporta igual",
          description:
            "Si algo tiene forma de botón, hace clic. Nunca dos estilos distintos para la misma acción.",
          payoff: "quien aprende una pantalla ya sabe usar las demás.",
          diagram: "similitud",
        },
        {
          label: "Continuidad",
          title: "El ojo sigue una línea",
          description:
            "Alineamos los elementos sobre una retícula para que el recorrido de lectura sea uno solo, no un zigzag.",
          payoff: "formularios que se llenan más rápido y con menos errores.",
          diagram: "continuidad",
        },
        {
          label: "Cierre",
          title: "Lo incompleto se completa solo",
          description:
            "Una tarjeta cortada en el borde comunica que hay más contenido sin necesidad de un cartel que lo diga.",
          payoff: "interfaces más limpias, con menos instrucciones en pantalla.",
          diagram: "cierre",
        },
        {
          label: "Figura y fondo",
          title: "El gris sostiene, el color señala",
          description:
            "Reservamos el acento de color para la acción principal. Si todo brilla, nada destaca.",
          payoff: "la acción que quieres que ocurra es la que se ve primero.",
          diagram: "figura-fondo",
        },
        {
          label: "Jerarquía",
          title: "El tamaño ordena la lectura",
          description:
            "Tres niveles de texto, no siete. El recorrido queda decidido desde el diseño, no al azar.",
          payoff: "el mensaje importante llega aunque nadie lea todo.",
          diagram: "jerarquia",
        },
      ],
    },
  ],
  cases: {
    title: "Sistemas que ya operan así",
    description: "Proyectos en producción construidos con este mismo proceso.",
    items: [
      {
        name: "Pet Gourmet",
        href: "https://www.petgourmet.mx/",
        image: "/imagenes/proyectos/petgourmet.png",
        summary:
          "E-commerce con carrito, inventario y pagos en línea, entregado por fases y con panel de administración propio.",
        tags: ["E-commerce", "Pagos", "Panel"],
      },
      {
        name: "Mister Lya",
        href: "https://www.misterlya.com/",
        image: "/imagenes/proyectos/misterlya.png",
        summary: "Catálogo y tienda con gestión de productos, pensada para que el cliente publique sin depender de nosotros.",
        tags: ["Catálogo", "Autogestión"],
      },
      {
        name: "Casa de Fiesta",
        href: "http://casadefiesta.co/",
        image: "/imagenes/proyectos/casadefiesta.png",
        summary: "Sitio de reservas y contacto con seguimiento de solicitudes desde un panel interno.",
        tags: ["Reservas", "Leads"],
      },
    ],
  },
  faq: [
    {
      question: "¿Cuánto cuesta contratar software a medida?",
      answer:
        "Depende del alcance, no del tamaño de la empresa. Un sitio corporativo o una automatización puntual arranca en el orden de unos pocos millones de pesos; un producto a medida con panel, usuarios y pagos se cotiza por fases. En el diagnóstico salimos con un rango, y la propuesta trae el precio cerrado por entregable.",
    },
    {
      question: "¿Cuánto se demora un proyecto?",
      answer:
        "Un proyecto puntual, entre 2 y 6 semanas. Un producto a medida, entre 2 y 5 meses, con entregas funcionando cada dos semanas desde la tercera semana. Nunca trabajamos con una única entrega al final.",
    },
    {
      question: "¿El código queda a mi nombre?",
      answer:
        "Sí. El repositorio, los dominios y los accesos a servicios quedan bajo tu cuenta desde el primer día, no al cerrar el proyecto. No usamos plataformas cerradas que te obliguen a quedarte con nosotros.",
    },
    {
      question: "¿Qué pasa si a mitad del proyecto necesito cambiar algo?",
      answer:
        "Se estima y se acuerda antes de construirlo. Los cambios pequeños entran en la siguiente quincena; los que mueven el alcance se cotizan aparte y tú decides si entran ahora o después. Nada se construye sin tu visto bueno.",
    },
    {
      question: "¿Y si ya tengo un sistema hecho por otro proveedor?",
      answer:
        "Hacemos una revisión del estado del código y te decimos con franqueza si conviene continuarlo o rehacer una parte. Si continuarlo es lo razonable, lo continuamos.",
    },
    {
      question: "¿Ofrecen soporte después de entregar?",
      answer:
        "Sí. Todo proyecto incluye garantía sobre lo entregado y puedes tomar un plan mensual de mantenimiento y evolución, con cupo de horas y tiempos de respuesta acordados.",
    },
  ],
  cta: {
    title: "Cuéntanos qué necesitas resolver",
    description:
      "El diagnóstico no tiene costo y termina en un documento con alcance, rango de precio y tiempos. Si después decides no seguir, el documento es tuyo igual.",
    label: "Agendar diagnóstico",
    href: "https://wa.me/573222237026?text=Hola%20V1TR0%2C%20quiero%20agendar%20un%20diagn%C3%B3stico%20de%20software.",
  },
}
