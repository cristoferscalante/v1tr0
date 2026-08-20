import type { SubcategoryPage } from "./tipos"

/**
 * Landing Pages.
 *
 * El caso real es el portafolio de Álvaro Efrén: un sitio de autoridad hecho
 * en Astro con fondo WebGL propio, certificaciones verificables y un panel
 * privado. Sirve para explicar el rango completo: desde la página única que
 * solo persigue una acción hasta el sitio que construye credibilidad.
 */
export const landingPages: SubcategoryPage = {
  slug: "landing-pages",
  subcategoryId: "landing",
  category: "Desarrollo de Software",
  name: "Landing Pages",

  seo: {
    title: "Landing pages que convierten: página de captación o sitio de autoridad",
    description:
      "Diseñamos páginas de aterrizaje enfocadas en una sola acción, sitios de autoridad que construyen credibilidad y landings de campaña. Carga rápida, medición real y una experiencia que demuestra en lugar de prometer.",
    keywords: [
      "diseño de landing page",
      "página de aterrizaje que convierte",
      "captación de leads",
      "sitio de autoridad y portafolio",
      "landing page para campaña",
    ],
  },

  hero: {
    headline: "Una página con un solo trabajo: que te contacten",
    subheadline:
      "Una landing no es una web pequeña, es una web sin distracciones. Todo lo que aparece en pantalla existe para acercar al visitante a una única acción, y todo lo que no ayuda a eso sobra. La diferencia entre una que convierte y una que no suele estar en qué se decidió quitar.",
    highlights: [
      "Una acción, no cinco",
      "Carga en menos de dos segundos",
      "Diseñada primero para celular",
      "Cada visita medida",
    ],
  },

  zones: {
    title: "El esqueleto de la página",
    description:
      "Una sola página de desplazamiento continuo, dividida en seis zonas. Cada zona tiene un trabajo específico y todas empujan hacia el mismo punto: el contacto.",
    items: [
      {
        number: "01",
        title: "Barra de navegación",
        description:
          "Fija en la parte superior mientras se navega: logo, accesos a las secciones y el botón de contacto siempre visible. En celular se convierte en menú desplegable y el botón queda flotando abajo, al alcance del pulgar.",
        tags: ["Menú fijo", "Botón flotante móvil", "Scroll suave"],
        wireframe: "navbar",
      },
      {
        number: "02",
        title: "Portada — la primera impresión",
        description:
          "Imagen o escena a pantalla completa con una frase que explique en cinco segundos qué haces y para quién. El elemento más grande y visible de toda la página es el botón de acción: nadie debería tener que buscar cómo contactarte.",
        tags: ["Promesa en 5 segundos", "Botón protagonista", "Pantalla completa"],
        wireframe: "hero",
      },
      {
        number: "03",
        title: "Qué ofreces",
        description:
          "Tarjetas cortas —tres o cuatro, no diez— que explican con claridad qué se puede contratar. Cada una con ícono, título, una descripción breve y enlace directo al contacto con esa opción ya preseleccionada.",
        tags: ["Tres tarjetas", "Íconos propios", "Enlace con intención"],
        wireframe: "grid",
      },
      {
        number: "04",
        title: "Prueba de que es cierto",
        description:
          "El bloque que sostiene todo lo anterior: certificaciones con su imagen, logos de clientes, cifras o testimonios. Aquí se decide si el visitante te cree. Sin esta zona, la promesa de la portada queda en palabras.",
        tags: ["Certificaciones", "Logos y cifras", "Testimonios"],
        wireframe: "proof",
      },
      {
        number: "05",
        title: "Cómo trabajas",
        description:
          "El proceso en etapas numeradas, de la primera conversación a la entrega. Convierte un servicio abstracto en algo que el cliente puede imaginar, y responde la pregunta silenciosa de '¿y esto cómo sería?'.",
        tags: ["Etapas numeradas", "Recorrido visual", "Expectativas claras"],
        wireframe: "story",
      },
      {
        number: "06",
        title: "El cierre",
        description:
          "Formulario corto —entre menos campos, más respuestas— o botón directo a WhatsApp, según dónde prefieras conversar. Se repite el mismo mensaje de la portada: quien llegó hasta abajo ya está convencido, solo falta que sea fácil.",
        tags: ["Formulario corto", "WhatsApp directo", "Sin fricción"],
        wireframe: "form",
      },
    ],
  },

  comparison: {
    title: "Tres formas de aterrizar",
    description:
      "La estructura cambia según lo que persigas: una acción inmediata, credibilidad a largo plazo o una campaña con fecha de vencimiento.",
    rows: [
      { id: "objetivo", label: "Para qué sirve" },
      { id: "paginas", label: "Número de páginas" },
      { id: "formulario", label: "Formulario de contacto" },
      { id: "whatsapp", label: "Contacto directo por WhatsApp" },
      { id: "prueba", label: "Bloque de prueba social", hint: "Certificaciones, logos, testimonios" },
      { id: "experiencia", label: "Animación o escena inmersiva" },
      { id: "blog", label: "Blog o contenido propio" },
      { id: "medicion", label: "Medición de conversiones" },
      { id: "seo", label: "Posicionamiento a largo plazo" },
      { id: "tiempo", label: "Tiempo de construcción" },
    ],
    types: [
      {
        id: "captacion",
        name: "Landing de captación",
        tagline: "Una sola página, una sola acción: dejar los datos",
        featured: true,
        values: {
          objetivo: "Convertir visitas de pauta en contactos",
          paginas: "Una",
          formulario: true,
          whatsapp: true,
          prueba: true,
          experiencia: false,
          blog: false,
          medicion: true,
          seo: "Limitado: vive de la pauta",
          tiempo: "Corto",
        },
      },
      {
        id: "autoridad",
        name: "Sitio de autoridad",
        tagline: "Construye credibilidad y sostiene la reputación en el tiempo",
        example: "Portafolio Efrén",
        values: {
          objetivo: "Que te elijan por confianza",
          paginas: "Varias, por tema",
          formulario: false,
          whatsapp: false,
          prueba: true,
          experiencia: true,
          blog: true,
          medicion: true,
          seo: "Alto: crece con el contenido",
          tiempo: "Medio",
        },
      },
      {
        id: "campana",
        name: "Landing de campaña",
        tagline: "Para un lanzamiento, un evento o una temporada concreta",
        values: {
          objetivo: "Inscripciones o registros con fecha",
          paginas: "Una",
          formulario: true,
          whatsapp: true,
          prueba: false,
          experiencia: false,
          blog: false,
          medicion: true,
          seo: "Nulo: es temporal",
          tiempo: "Muy corto",
        },
      },
    ],
  },

  flows: {
    title: "El camino del visitante",
    description:
      "Nadie llega decidido. Estas son las dos rutas que recorre alguien entre el anuncio y el mensaje.",
    items: [
      {
        id: "captacion",
        title: "De la pauta al contacto",
        description:
          "El visitante llega desde un anuncio o una búsqueda, lee la promesa, confirma que eres real y escribe. Cuatro pasos: cada uno que se alarga es gente que se va.",
        featured: true,
        steps: [
          { label: "Llega desde el anuncio", icon: "MousePointerClick" },
          { label: "Lee la promesa", icon: "Sparkles" },
          { label: "Confirma que eres real", icon: "Award" },
          { label: "Escribe o deja sus datos", icon: "MessageCircle" },
        ],
      },
      {
        id: "autoridad",
        title: "De la búsqueda a la confianza",
        description:
          "El recorrido largo: alguien te encuentra en Google, recorre tu trabajo, vuelve semanas después y llega a la conversación ya convencido. Aquí no se persigue el clic inmediato, sino ser recordado.",
        steps: [
          { label: "Te encuentra en Google", icon: "Search" },
          { label: "Recorre tu trabajo", icon: "FileText" },
          { label: "Comprueba tus credenciales", icon: "ShieldCheck" },
          { label: "Vuelve y contacta", icon: "RefreshCw" },
        ],
      },
    ],
  },

  benefits: {
    title: "Qué gana el negocio",
    description: "Lo que cambia cuando la página tiene un objetivo claro en lugar de intentarlo todo.",
    items: [
      {
        icon: "MousePointerClick",
        title: "La pauta deja de perderse",
        description:
          "Mandar anuncios a la página de inicio es pagar por visitas que se dispersan. Una landing recibe esa visita con la respuesta exacta a lo que prometía el anuncio.",
      },
      {
        icon: "Clock",
        title: "Carga en segundos",
        description:
          "Una página liviana no pierde a quien está en datos móviles. Cada segundo de espera se paga en visitantes que cierran antes de ver nada.",
      },
      {
        icon: "Award",
        title: "Credibilidad demostrada",
        description:
          "Certificaciones con imagen, cifras y trabajos reales convierten afirmaciones en evidencia. Es la diferencia entre decir que eres bueno y mostrarlo.",
      },
      {
        icon: "Sparkles",
        title: "La página como demostración",
        description:
          "Cuando el sitio se ve y se siente bien hecho, deja de hablar de tu trabajo: lo demuestra. Especialmente cierto si vendes diseño, datos o tecnología.",
      },
      {
        icon: "BarChart3",
        title: "Sabes qué funciona",
        description:
          "Con medición instalada ves cuánta gente llega, hasta dónde baja y cuántos escriben. Ajustar deja de ser intuición y pasa a ser decisión.",
      },
      {
        icon: "Smartphone",
        title: "Pensada para el pulgar",
        description:
          "La mayoría llega desde el celular: texto legible sin ampliar, botón de contacto siempre a la mano y nada que obligue a hacer zoom.",
      },
    ],
  },

  cases: {
    title: "Proyecto en producción",
    description: "Un sitio de autoridad donde la experiencia técnica es parte del argumento.",
    items: [
      {
        name: "Portafolio Álvaro Efrén",
        href: "https://efren-portafolio.v1tr0.com/",
        image: "/imagenes/proyectos/portafolio.png",
        summary:
          "Portafolio de un politólogo especializado en ciencia de datos sociales: fondo interactivo en WebGL, ocho certificaciones verificables con su imagen, el ciclo de vida del dato explicado como servicio y un panel privado propio.",
        tags: ["Escena WebGL", "Certificaciones", "Multi-página", "Panel privado"],
      },
    ],
  },

  faq: [
    {
      question: "¿Cuál es la diferencia entre una landing page y una página web normal?",
      answer:
        "Una web tiene muchas salidas: menú, blog, catálogo, redes. Una landing tiene una sola, y todo el contenido está ordenado para llevarte a ella. Por eso convierte mejor el tráfico de pauta: no compite consigo misma por la atención del visitante.",
    },
    {
      question: "¿Necesito una landing si ya tengo página web?",
      answer:
        "Si inviertes en anuncios, sí. Mandar esa inversión a la página de inicio dispersa a quien llega. Una landing por campaña o por servicio recibe esa visita con el mensaje exacto que la trajo y suele multiplicar los contactos con el mismo presupuesto.",
    },
    {
      question: "¿Formulario o WhatsApp?",
      answer:
        "Depende de dónde atiendas. El formulario deja el contacto ordenado y con historial; WhatsApp tiene menos fricción y respuesta inmediata. Se pueden combinar, siempre que uno sea claramente el principal: dos botones del mismo peso reparten la decisión y bajan la conversión.",
    },
    {
      question: "¿Vale la pena una escena 3D o animada?",
      answer:
        "Vale cuando la experiencia es parte de lo que vendes —diseño, tecnología, datos— porque entonces la página demuestra la capacidad en lugar de describirla. Si vendes un servicio donde lo que importa es la claridad, ese esfuerzo rinde más invertido en textos y prueba social.",
    },
    {
      question: "¿Una landing me posiciona en Google?",
      answer:
        "Poco por sí sola: una página única compite con muy pocos términos. Si el objetivo es aparecer en búsquedas de forma sostenida, el camino es un sitio de varias páginas por tema y contenido propio que crezca en el tiempo. La landing rinde con pauta; el sitio de autoridad, con orgánico.",
    },
  ],

  cta: {
    title: "¿Qué quieres que haga tu página?",
    description:
      "Cuéntanos a quién quieres llegar y qué debería hacer esa persona al entrar. De ahí sale si necesitas una landing de captación, un sitio de autoridad o una página de campaña.",
    label: "Hablemos de tu página",
    href: "https://wa.me/573222237026?text=Hola%20V1TR0%2C%20quiero%20una%20landing%20page%20para%20mi%20negocio.",
  },
}
