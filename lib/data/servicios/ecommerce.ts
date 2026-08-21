import type { SubcategoryPage } from "./tipos"

/**
 * E-Commerce.
 *
 * El contenido sale de tres proyectos reales en producción: Pet Gourmet
 * (tienda completa con Stripe, cuentas y envíos), Mister LyA y Casa de Fiestas
 * (catálogo con carrito que cierra la venta en WhatsApp). La comparativa entre
 * esos dos caminos es el eje de la página.
 */
export const ecommerce: SubcategoryPage = {
  slug: "ecommerce",
  subcategoryId: "ecommerce",
  category: "Desarrollo de Software",
  name: "E-Commerce",

  seo: {
    title: "E-Commerce a medida: tienda en línea o catálogo con WhatsApp",
    description:
      "Construimos tiendas en línea con pasarela de pago, envíos y panel administrativo, o catálogos con carrito que cierran la venta por WhatsApp. Casos reales: Pet Gourmet, Mister LyA y Casa de Fiestas.",
    keywords: [
      "desarrollo de e-commerce",
      "tienda en línea a medida",
      "catálogo con carrito WhatsApp",
      "pasarela de pago",
      "panel administrativo de productos",
    ],
  },

  hero: {
    headline: "Una tienda que trabaja mientras tú atiendes",
    subheadline:
      "No toda venta en línea necesita pasarela de pago. Construimos desde el catálogo que arma el pedido y lo manda a tu WhatsApp, hasta la tienda completa que cobra, factura y despacha sola. Lo que cambia no es la calidad: es cuánto de la operación quieres automatizar.",
    highlights: [
      "Panel para publicar tú mismo",
      "Carrito en ambos caminos",
      "Pago en línea opcional",
      "Diseñada para vender en celular",
    ],
  },

  zones: {
    title: "El esqueleto de una tienda",
    description:
      "Siete zonas, cada una con un trabajo concreto. Todas empujan al mismo punto: que el pedido se cierre.",
    items: [
      {
        number: "01",
        title: "Barra de navegación",
        description:
          "Fija arriba mientras se navega: logo, categorías, buscador y acceso al carrito con el contador siempre visible. En celular se vuelve menú desplegable y el botón de contacto queda flotando abajo, al alcance del pulgar.",
        tags: ["Menú fijo", "Buscador", "Contador de carrito"],
        wireframe: "navbar",
      },
      {
        number: "02",
        title: "Portada — la primera impresión",
        description:
          "Una imagen a pantalla completa y una frase que explique en cinco segundos qué vendes y para quién. Debajo, el camino directo a las categorías que más rotan, para que nadie tenga que buscar por dónde empezar.",
        tags: ["Promesa en 5 segundos", "Accesos por categoría", "CTA protagonista"],
        wireframe: "hero",
      },
      {
        number: "03",
        title: "Catálogo con filtros",
        description:
          "La vitrina real del negocio: cuadrícula de productos con foto, nombre y precio, filtros por categoría y buscador. Cada filtro tiene su propio enlace, así que puedes mandar pauta directo a una categoría concreta.",
        tags: ["Filtros por categoría", "Búsqueda", "Enlaces para pauta"],
        wireframe: "grid",
      },
      {
        number: "04",
        title: "Ficha de producto",
        description:
          "Galería de fotos, descripción, precio y selector de variantes (color, tamaño, presentación). Es la página que responde las dudas que hoy contestas a mano por chat una y otra vez.",
        tags: ["Galería", "Variantes", "Productos relacionados"],
        wireframe: "detail",
      },
      {
        number: "05",
        title: "Carrito",
        description:
          "Un panel lateral que se abre sin sacar al cliente de donde está: cantidades, subtotal y un solo botón para avanzar. Vive en los dos caminos, con pasarela o sin ella.",
        tags: ["Panel lateral", "Subtotal en vivo", "Sin recargar la página"],
        wireframe: "cart",
      },
      {
        number: "06",
        title: "El cierre de la venta",
        description:
          "Aquí se bifurcan los dos caminos. Con pasarela: datos, envío, pago con tarjeta y correo de confirmación automático. Sin pasarela: el carrito se convierte en un mensaje de WhatsApp con el pedido ya escrito, y la conversación sigue donde el negocio ya atiende.",
        tags: ["Pago con tarjeta", "Pedido armado en WhatsApp", "Confirmación automática"],
        wireframe: "checkout",
      },
      {
        number: "07",
        title: "Panel administrativo",
        description:
          "La diferencia entre una web y una tienda viva: entras con tu usuario, subes productos, cambias precios, agotas existencias y publicas la promoción del mes. Sin llamar al programador y sin esperar turno.",
        tags: ["Publicar productos", "Editar precios", "Gestionar existencias"],
        wireframe: "admin",
      },
    ],
  },

  comparison: {
    title: "Dos caminos para vender",
    description:
      "La pregunta no es cuál es mejor, sino cuánta operación quieres cargar. Esta es la diferencia real entre los proyectos que tenemos en producción.",
    rows: [
      { id: "catalogo", label: "Catálogo con fotos y precios" },
      { id: "carrito", label: "Carrito de compras" },
      { id: "panel", label: "Panel administrativo propio", hint: "Publicas tú, sin depender de nosotros" },
      { id: "pago", label: "Pago en línea con tarjeta" },
      { id: "cuentas", label: "Cuentas de cliente e historial" },
      { id: "envios", label: "Cálculo de envío y despacho" },
      { id: "correos", label: "Correos automáticos de pedido" },
      { id: "suscripcion", label: "Compra recurrente / suscripción" },
      { id: "cierre", label: "Dónde se cierra la venta" },
      { id: "comision", label: "Comisión por transacción" },
      { id: "operacion", label: "Carga operativa diaria" },
    ],
    types: [
      {
        id: "completa",
        name: "Tienda completa",
        tagline: "Vende sola, 24/7, sin que nadie conteste un mensaje",
        featured: true,
        example: "Pet Gourmet",
        values: {
          catalogo: true,
          carrito: true,
          panel: true,
          pago: true,
          cuentas: true,
          envios: true,
          correos: true,
          suscripcion: true,
          cierre: "En el sitio",
          comision: "Sí, la de la pasarela",
          operacion: "Alta: despachos, devoluciones, soporte",
        },
      },
      {
        id: "whatsapp",
        name: "Catálogo con WhatsApp",
        tagline: "La vitrina profesional del negocio que ya atiende por chat",
        example: "Mister LyA",
        values: {
          catalogo: true,
          carrito: true,
          panel: true,
          pago: false,
          cuentas: false,
          envios: false,
          correos: false,
          suscripcion: false,
          cierre: "En WhatsApp, con el pedido ya armado",
          comision: "Ninguna",
          operacion: "Baja: responder y coordinar",
        },
      },
      {
        id: "cotizacion",
        name: "Catálogo por cotización",
        tagline: "Para producto personalizado, donde el precio depende del pedido",
        example: "Casa de Fiestas",
        values: {
          catalogo: true,
          carrito: true,
          panel: true,
          pago: false,
          cuentas: false,
          envios: false,
          correos: false,
          suscripcion: false,
          cierre: "Cotización por WhatsApp",
          comision: "Ninguna",
          operacion: "Media: cotizar y confirmar",
        },
      },
    ],
  },

  flows: {
    title: "El camino del pedido",
    description:
      "Mismo catálogo, mismo carrito. Lo que cambia es lo que pasa después del botón.",
    items: [
      {
        id: "pasarela",
        title: "Con pasarela de pago",
        description:
          "El cliente paga en el sitio y el pedido queda registrado, cobrado y notificado sin que nadie intervenga. Es el camino de Pet Gourmet: incluye cuentas de usuario, envío y compra recurrente.",
        featured: true,
        steps: [
          { label: "Producto", icon: "Package" },
          { label: "Carrito", icon: "ShoppingCart" },
          { label: "Pago con tarjeta", icon: "CreditCard" },
          { label: "Correo automático", icon: "Mail" },
          { label: "Despacho", icon: "Truck" },
        ],
      },
      {
        id: "whatsapp",
        title: "Con cierre en WhatsApp",
        description:
          "El carrito se convierte en un mensaje con productos, cantidades y total. Llega al chat donde el negocio ya atiende, sin comisiones ni pasarela que administrar. Es el camino de Mister LyA y Casa de Fiestas.",
        steps: [
          { label: "Producto", icon: "Package" },
          { label: "Carrito", icon: "ShoppingCart" },
          { label: "Pedido armado", icon: "FileText" },
          { label: "WhatsApp", icon: "MessageCircle" },
          { label: "Acuerdo y entrega", icon: "Truck" },
        ],
      },
    ],
  },

  benefits: {
    title: "Qué gana el negocio",
    description: "Lo que se nota en la operación desde la primera semana.",
    items: [
      {
        icon: "LayoutDashboard",
        title: "Autonomía total del catálogo",
        description:
          "Publicas productos, cambias precios y subes fotos desde tu panel. La tienda deja de depender de la agencia para seguir viva.",
      },
      {
        icon: "MessageCircle",
        title: "Menos ida y vuelta por chat",
        description:
          "El cliente llega con el pedido armado, ya vio precio y variante. Se acaba el 'me pasas la lista' y el catálogo en PDF desactualizado.",
      },
      {
        icon: "CreditCard",
        title: "Cobro sin fricción",
        description:
          "Con pasarela, la venta se cierra a las 2 de la mañana igual que al mediodía, con el pago conciliado y el comprobante enviado solo.",
      },
      {
        icon: "Search",
        title: "Encontrable en Google",
        description:
          "Cada producto y cada categoría es una página propia con su título y su descripción. Tu catálogo empieza a traer visitas por sí mismo.",
      },
      {
        icon: "BarChart3",
        title: "Pauta que se puede medir",
        description:
          "Con analítica y píxel instalados sabes qué producto se ve, cuál se agrega al carrito y cuál se compra. La inversión en anuncios deja de ser a ciegas.",
      },
      {
        icon: "Smartphone",
        title: "Pensada para el celular",
        description:
          "La mayoría de tus clientes entra desde el teléfono: menú al alcance del pulgar, fotos que cargan rápido y botón de contacto siempre visible.",
      },
    ],
  },

  cases: {
    title: "Proyectos en producción",
    description: "Los tres caminos, funcionando hoy con clientes reales.",
    items: [
      {
        name: "Pet Gourmet",
        href: "https://www.petgourmet.mx/",
        image: "/imagenes/proyectos/petgourmet.png",
        summary:
          "Tienda completa de alimento natural para mascotas en México: pago con tarjeta, cuentas de cliente, envío gratis por monto, compra recurrente y blog propio.",
        tags: ["Pasarela de pago", "Cuentas y envíos", "Suscripciones", "Blog"],
      },
      {
        name: "Mister LyA",
        href: "https://www.misterlya.com/",
        image: "/imagenes/proyectos/misterlya.png",
        summary:
          "Catálogo profesional de productos de limpieza con buscador, filtros por categoría y variantes. El carrito arma el pedido y lo envía a WhatsApp; el dueño administra todo desde su panel.",
        tags: ["Carrito a WhatsApp", "Buscador y filtros", "Panel propio"],
      },
      {
        name: "Casa de Fiestas",
        href: "http://casadefiesta.co/",
        image: "/imagenes/proyectos/casadefiesta.png",
        summary:
          "Catálogo de globos y decoración con ocho categorías, variantes de color y tamaño, y catálogo descargable en PDF para el canal mayorista. Cierra por cotización en WhatsApp.",
        tags: ["Cotización", "Variantes", "Catálogo en PDF"],
      },
    ],
  },

  faq: [
    {
      question: "¿Necesito pasarela de pago para vender en línea?",
      answer:
        "No. Si tu negocio ya atiende por WhatsApp, un catálogo con carrito que arme el pedido y lo envíe al chat convierte igual de bien y no paga comisiones ni exige administrar cobros. La pasarela se justifica cuando el volumen de pedidos hace costoso responder uno por uno, o cuando quieres vender fuera del horario de atención.",
    },
    {
      question: "¿Puedo subir productos y cambiar precios yo mismo?",
      answer:
        "Sí. Todos nuestros e-commerce incluyen un panel administrativo con tu usuario y contraseña donde publicas productos, editas precios, subes fotos y marcas agotados. Es la diferencia entre una web estática y una tienda viva.",
    },
    {
      question: "¿Cuál es la diferencia entre catálogo con precios y catálogo por cotización?",
      answer:
        "El catálogo con precios muestra el valor de cada producto y el cliente arma su pedido con el total calculado. El de cotización se usa cuando el precio depende de la personalización —tamaño, combinación, cantidad—: el cliente selecciona lo que quiere y recibe la propuesta por WhatsApp.",
    },
    {
      question: "¿Se puede empezar sencillo y agregar la pasarela después?",
      answer:
        "Sí, y suele ser el camino más sano. El catálogo, el carrito y el panel son la misma base; sumar checkout, cuentas de cliente y envíos es una segunda etapa que se activa cuando el volumen lo pide.",
    },
    {
      question: "¿La tienda va a aparecer en Google?",
      answer:
        "Cada producto y cada categoría se publica como una página propia, con título, descripción e imágenes optimizadas, y se registra en el mapa del sitio. Eso es lo que permite que tu catálogo aparezca en búsquedas sin pagar por cada visita.",
    },
  ],

  cta: {
    title: "¿Cuál de los dos caminos es el tuyo?",
    description:
      "Cuéntanos qué vendes y cómo atiendes hoy. En una conversación corta sabemos si tu negocio necesita pasarela o si le rinde más un catálogo que cierre por WhatsApp.",
    label: "Hablemos de tu tienda",
    href: "https://wa.me/573222237026?text=Hola%20V1TR0%2C%20quiero%20una%20tienda%20en%20l%C3%ADnea%20para%20mi%20negocio.",
  },
}
