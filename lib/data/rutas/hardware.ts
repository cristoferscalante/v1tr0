import type { RoutePage } from "./tipos"

/**
 * Ruta "hardware": productos IoT con comunicación LoRa.
 *
 * A diferencia de la ruta de software, esta línea es joven: la página dice
 * con todas las letras hasta dónde llegamos hoy y qué todavía no hacemos.
 * Prometer de más en hardware se paga en devoluciones, no en correcciones.
 */
export const hardwarePage: RoutePage = {
  slug: "hardware-iot",
  subcategoryId: "hardware-iot",
  category: "Cómo trabajamos",
  name: "Hardware e IoT",
  seo: {
    title: "Hardware IoT con LoRa: sensores, gateways y monitoreo remoto",
    description:
      "Nodos sensores y gateways con comunicación LoRa para medir a kilómetros de distancia y sin internet en campo: alcances reales, autonomía, panel de monitoreo y hasta dónde llegamos hoy.",
    keywords: [
      "hardware IoT Colombia",
      "comunicación LoRa",
      "LoRaWAN",
      "sensores inalámbricos largo alcance",
      "monitoreo remoto sin internet",
      "telemetría agrícola",
      "gateway LoRa",
    ],
  },
  hero: {
    headline: "Medir lo que pasa en campo, aunque allá no haya internet",
    subheadline:
      "Diseñamos nodos con sensores y gateways que se comunican por LoRa: kilómetros de alcance, años de batería y un panel donde ves el dato sin ir hasta el sitio. Esta línea es joven, así que aquí está exactamente hasta dónde llegamos hoy.",
    highlights: ["Alcance de 2 a 10 km", "Sin cobertura celular", "Batería de meses a años", "Panel web incluido"],
  },
  zones: {
    title: "Cómo se arma una solución IoT",
    description:
      "Cuatro piezas, siempre las mismas. Entender qué hace cada una evita la confusión más común: creer que el sensor 'manda a internet' por sí solo.",
    items: [
      {
        number: "01",
        title: "El nodo: el aparato que mide",
        description:
          "Una caja pequeña con batería, un microcontrolador y los sensores que tu caso necesita: humedad de suelo, temperatura, nivel de tanque, apertura de puerta, consumo de agua. Despierta cada cierto tiempo, mide, transmite y se vuelve a dormir. Ese ciclo es lo que hace que la batería dure meses.",
        tags: ["Batería o solar", "Caja para intemperie", "Sensores según el caso"],
        wireframe: "detail",
      },
      {
        number: "02",
        title: "El enlace LoRa: la radio que cruza la distancia",
        description:
          "LoRa es una radio de baja potencia y largo alcance que trabaja en banda libre: no paga plan de datos ni depende del operador celular. A cambio, transmite poquísimos datos por mensaje. Sirve de sobra para lecturas de sensores; no sirve para video ni audio.",
        tags: ["Banda libre 915 MHz", "Sin SIM ni plan de datos", "Mensajes cortos"],
        wireframe: "story",
      },
      {
        number: "03",
        title: "El gateway: el punto que reúne todo",
        description:
          "Un solo gateway escucha a decenas de nodos repartidos por la finca, la planta o el edificio, y es el único que necesita internet o celular. Se instala en el punto más alto y con energía disponible.",
        tags: ["Uno por sitio", "Necesita internet", "Instalación en altura"],
        wireframe: "grid",
      },
      {
        number: "04",
        title: "El panel: donde el dato se vuelve decisión",
        description:
          "Histórico, gráficas, umbrales y alertas por WhatsApp o correo cuando un valor se sale de rango. Es software, y por eso se construye con los mismos criterios que el resto de lo que hacemos: el gris sostiene, el color señala lo que hay que atender ya.",
        tags: ["Histórico y gráficas", "Alertas por umbral", "Usuarios y permisos"],
        wireframe: "admin",
      },
    ],
  },
  comparison: {
    title: "Hasta dónde llegamos hoy",
    description:
      "Tres niveles de compromiso. Los dos primeros son lo que hacemos con solvencia ahora mismo; el tercero se estudia caso por caso y lo decimos antes de cotizar, no después.",
    rows: [
      { id: "que", label: "Qué recibes" },
      { id: "nodos", label: "Cantidad de nodos" },
      { id: "tiempo", label: "Tiempo estimado" },
      { id: "panel", label: "Panel web con histórico" },
      { id: "campo", label: "Instalación en sitio" },
      { id: "cert", label: "Certificación y producción en serie" },
    ],
    types: [
      {
        id: "prueba",
        name: "Prueba de concepto",
        tagline: "Confirmar que el enlace funciona en tu terreno",
        values: {
          que: "Un nodo, un gateway y medición de alcance real",
          nodos: "1 a 2",
          tiempo: "3 a 5 semanas",
          panel: "Panel básico de lecturas",
          campo: true,
          cert: false,
        },
      },
      {
        id: "piloto",
        name: "Piloto en operación",
        tagline: "Un sitio real midiendo todos los días",
        featured: true,
        values: {
          que: "Red de nodos, gateway, panel completo y alertas",
          nodos: "3 a 20",
          tiempo: "2 a 4 meses",
          panel: true,
          campo: true,
          cert: false,
        },
      },
      {
        id: "escala",
        name: "Despliegue amplio",
        tagline: "Varios sitios o más de veinte nodos",
        values: {
          que: "Se evalúa caso por caso, con socio de manufactura",
          nodos: "20 o más",
          tiempo: "A definir",
          panel: true,
          campo: "Con equipo aliado",
          cert: "Se gestiona con terceros",
        },
      },
    ],
  },
  flows: {
    title: "El camino del dato",
    description:
      "De la magnitud física a la alerta en tu teléfono. Todo el recorrido ocurre en segundos y sin intervención de nadie.",
    items: [
      {
        id: "dato",
        title: "Del sensor a tu teléfono",
        description: "El ciclo completo, que se repite cada intervalo configurado.",
        featured: true,
        steps: [
          { label: "Sensor mide", icon: "Thermometer" },
          { label: "Nodo despierta", icon: "Cpu" },
          { label: "Transmite por LoRa", icon: "Radio" },
          { label: "Gateway recibe", icon: "RadioTower" },
          { label: "Servidor guarda", icon: "Layers" },
          { label: "Alerta si aplica", icon: "MessageCircle" },
        ],
      },
      {
        id: "proyecto",
        title: "Cómo se ejecuta el proyecto",
        description: "Un proyecto de hardware suma dos pasos que el software no tiene: visita a terreno y prueba de alcance.",
        steps: [
          { label: "Visita al sitio", icon: "MapPin" },
          { label: "Prueba de alcance", icon: "Ruler" },
          { label: "Prototipo", icon: "Wrench" },
          { label: "Instalación", icon: "Boxes" },
          { label: "Seguimiento", icon: "Gauge" },
        ],
      },
    ],
  },
  benefits: {
    title: "Para qué sirve en la práctica",
    description: "Casos donde LoRa resuelve algo que el celular o el wifi no resuelven.",
    items: [
      {
        icon: "Thermometer",
        title: "Agro: riego y suelo",
        description:
          "Humedad y temperatura en varios puntos del lote para regar por dato y no por costumbre. Es el caso donde más se nota, porque el terreno es grande y no hay cobertura.",
      },
      {
        icon: "BatteryCharging",
        title: "Años sin cambiar batería",
        description:
          "El nodo duerme casi todo el tiempo y despierta solo para medir. Con lecturas cada 15 minutos, la autonomía se cuenta en meses o años, no en días.",
      },
      {
        icon: "RadioTower",
        title: "Sin plan de datos por aparato",
        description:
          "Solo el gateway necesita internet. Veinte nodos no son veinte SIM: es una sola conexión y el resto es radio en banda libre.",
      },
      {
        icon: "Package",
        title: "Tanques, silos y bodegas",
        description:
          "Nivel, apertura y temperatura en sitios sin red, con alerta cuando el valor se sale del rango que tú definas.",
      },
      {
        icon: "ShieldCheck",
        title: "El dato queda en tu servidor",
        description:
          "No dependes de una nube de terceros que pueda cerrar o cambiar de precio: la base de datos y el panel son parte de lo que se entrega.",
      },
      {
        icon: "Wrench",
        title: "Mantenible por tu gente",
        description:
          "Se entrega documentado —esquema, componentes, cómo reemplazar un nodo— para que una falla no dependa de que nosotros podamos ir.",
      },
    ],
  },
  principles: [
    {
      eyebrow: "Criterios de diseño",
      title: "Los mismos principios, ahora en algo que se moja y se golpea",
      description:
        "SOLID nació para el código, pero la idea de fondo —piezas que hacen una cosa y se reemplazan sin rehacer el resto— se aplica igual a un aparato que va a estar cinco años a la intemperie. Así es como decidimos qué va dentro de la caja.",
      items: [
        {
          label: "Una función por pieza",
          title: "Sensor, radio y energía separados",
          description:
            "Cada bloque del nodo es independiente: el que mide no es el que transmite ni el que administra la batería.",
          payoff: "si falla un sensor, se cambia ese sensor y no el nodo completo.",
          diagram: "srp",
        },
        {
          label: "Abierto a más sensores",
          title: "Se le agregan medidas sin rediseñar",
          description:
            "El nodo se diseña con puertos libres y un protocolo que admite campos nuevos.",
          payoff: "sumar una medición después no obliga a fabricar todo otra vez.",
          diagram: "ocp",
        },
        {
          label: "Piezas intercambiables",
          title: "Componentes que se consiguen aquí",
          description:
            "Preferimos módulos comunes y sustituibles antes que una pieza exótica con un solo proveedor.",
          payoff: "un repuesto se consigue en días, no en meses de importación.",
          diagram: "lsp",
        },
        {
          label: "Mensajes mínimos",
          title: "Se transmite solo lo necesario",
          description:
            "LoRa cobra en batería y en tiempo de aire cada byte, así que el mensaje lleva la lectura y nada más.",
          payoff: "más autonomía y más nodos conviviendo en el mismo gateway.",
          diagram: "isp",
        },
        {
          label: "Contrato entre capas",
          title: "El panel no sabe qué radio hay abajo",
          description:
            "Entre el nodo y el panel hay un formato de mensaje acordado, no un acople directo al hardware.",
          payoff: "cambiar de gateway o de tecnología de radio no bota el panel.",
          diagram: "dip",
        },
      ],
    },
    {
      eyebrow: "Lectura del panel",
      title: "Un tablero que se entiende de un vistazo",
      description:
        "El panel es donde tu equipo va a mirar el dato a las seis de la mañana. Se diseña con los mismos principios de percepción que el resto de nuestras interfaces.",
      items: [
        {
          label: "Figura y fondo",
          title: "Solo lo que está fuera de rango llama la atención",
          description: "Los valores normales se mantienen en gris; el acento se reserva para la alerta.",
          payoff: "un vistazo basta para saber si hay que ir al lote.",
          diagram: "figura-fondo",
        },
        {
          label: "Proximidad",
          title: "Cada zona agrupa sus nodos",
          description: "Los sensores del mismo sector se ven juntos, con su promedio arriba del grupo.",
          payoff: "ubicas el problema en el mapa sin abrir nodo por nodo.",
          diagram: "proximidad",
        },
        {
          label: "Continuidad",
          title: "La serie de tiempo cuenta la historia",
          description: "Una línea continua muestra la tendencia; el número suelto solo muestra el instante.",
          payoff: "distingues un pico raro de una tendencia que sí importa.",
          diagram: "continuidad",
        },
      ],
    },
  ],
  cases: {
    title: "",
    description: "",
    items: [],
  },
  faq: [
    {
      question: "¿Qué es LoRa y en qué se diferencia del wifi o del celular?",
      answer:
        "LoRa es una tecnología de radio de baja potencia y largo alcance que funciona en banda libre. Frente al wifi gana muchísima distancia; frente al celular, no necesita SIM ni plan de datos. La contrapartida es que transmite muy pocos datos por mensaje: sirve para lecturas de sensores, no para video, audio ni transferencia de archivos.",
    },
    {
      question: "¿Cuál es el alcance real?",
      answer:
        "En campo abierto con el gateway bien ubicado, entre 5 y 10 km. En zona con árboles, edificaciones o desniveles, entre 1 y 3 km. La cifra depende del terreno, y por eso el primer paso siempre es una prueba de alcance en tu sitio: preferimos medir antes que prometer.",
    },
    {
      question: "¿Cuánto dura la batería?",
      answer:
        "Con lecturas cada 15 a 30 minutos, entre varios meses y un par de años según el sensor. Los sensores que necesitan calentarse o alimentarse de forma continua consumen más; en esos casos usamos panel solar pequeño.",
    },
    {
      question: "¿Necesito internet en la finca o en la planta?",
      answer:
        "Solo en el punto donde va el gateway, y puede ser una conexión modesta o un módem celular. Los nodos repartidos por el terreno no necesitan ninguna conexión.",
    },
    {
      question: "¿Fabrican en serie o certifican los equipos?",
      answer:
        "Hoy no. Trabajamos hasta prototipo funcional y piloto instalado, con carcasa apta para intemperie pero sin certificación formal ni producción en volumen. Para un despliegue grande nos apoyamos en un socio de manufactura, y eso se dice desde la cotización.",
    },
    {
      question: "¿Se puede integrar con un sistema que ya tengo?",
      answer:
        "Sí. Los datos se exponen por API, así que pueden alimentar tu ERP, tu tablero actual o una hoja de cálculo. Si además quieres el panel, se entrega junto con la solución.",
    },
  ],
  cta: {
    title: "Cuéntanos qué necesitas medir y dónde",
    description:
      "Con la ubicación y la distancia aproximada podemos decirte si LoRa es la tecnología correcta —a veces no lo es, y también te lo decimos— y qué implicaría una prueba en tu terreno.",
    label: "Escribir por WhatsApp",
    href: "https://wa.me/573222237026?text=Hola%20V1TR0%2C%20quiero%20consultar%20por%20hardware%20IoT%20con%20LoRa.",
  },
}
