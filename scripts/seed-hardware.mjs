/**
 * Siembra el catálogo de hardware de la tienda: dispositivos LoRa/Meshtastic,
 * placas ESP32-S3, computadoras de placa única y handhelds Linux.
 *
 *   node scripts/seed-hardware.mjs          siembra o actualiza (idempotente por slug)
 *   node scripts/seed-hardware.mjs --clean  borra solo estos productos
 *
 * Todos llevan `metadata.coleccion = "hardware"`: es lo que usa /api/products
 * para mostrarlos en la tienda. Las imágenes viven en
 * public/imagenes/tienda/hardware/<slug>/ y salen de las fichas oficiales de
 * cada fabricante (LILYGO, M5Stack, Raspberry Pi, ClockworkPi, TrimUI).
 *
 * Precios en COP. Cada producto guarda su `costo` (precio de compra en
 * AliExpress) y el precio de venta se calcula con `precioVenta`: deja un 20 %
 * de ganancia sobre el costo después de la comisión de Wompi. El costo no se
 * guarda en la base (el API de productos es público).
 */
import { config } from "dotenv"

config({ path: ".env.local" })
config({ path: ".env" })

const { neon } = await import("@neondatabase/serverless")
const sql = neon(process.env.DATABASE_URL)

const ENTREGA = "Importación bajo pedido · 15 a 25 días hábiles"

// --- Precio de venta ---------------------------------------------------------
const GANANCIA = 0.2 // sobre el costo
// Wompi, plan avanzado: 2,65 % + $700 por transacción, más IVA sobre la comisión.
const WOMPI_PCT = 0.0265
const WOMPI_FIJO = 700
const IVA = 0.19

/**
 * Precio P tal que P − comisión Wompi = costo × (1 + GANANCIA).
 * Comisión = (P × 2,65 % + 700) × 1,19  →  P = (costo × 1,2 + 700 × 1,19) / (1 − 2,65 % × 1,19)
 * Se redondea hacia arriba a un precio terminado en 900 (…$249.900), así el
 * margen nunca queda por debajo del objetivo.
 */
function precioVenta(costo) {
  const exacto = (costo * (1 + GANANCIA) + WOMPI_FIJO * (1 + IVA)) / (1 - WOMPI_PCT * (1 + IVA))
  return Math.ceil((exacto + 100) / 1000) * 1000 - 100
}

const imgs = (slug, n) =>
  Array.from({ length: n }, (_, i) => `/imagenes/tienda/hardware/${slug}/${i + 1}.webp`)

const CATALOGO = [
  {
    slug: "lilygo-t-deck",
    name: "LILYGO T-Deck",
    category: "lora-meshtastic",
    subcategory: "Comunicadores LoRa",
    marca: "LILYGO",
    costo: 204065,
    images: imgs("t-deck", 4),
    shortDescription: "Comunicador de bolsillo ESP32-S3 con teclado, pantalla de 2,8\" y LoRa SX1262.",
    description:
      "Dispositivo de bolsillo con pantalla IPS de 2,8\", mini teclado QWERTY, trackball y procesador ESP32-S3 de doble núcleo. Con el módulo LoRa SX1262 se convierte en un comunicador autónomo: mensajería fuera de la red celular con Meshtastic, o una terminal portátil para programar y probar firmware.",
    destacados: ["ESP32-S3", "LoRa SX1262", "Teclado QWERTY"],
    features: [
      "Mensajería off-grid con Meshtastic, sin señal celular ni internet",
      "Terminal portátil para prototipos y firmware propio",
      "Nodo de comunicación para campo, eventos o emergencias",
      "Aprendizaje de programación embebida (Arduino, MicroPython)",
    ],
    specifications: {
      Procesador: "ESP32-S3FN16R8 · doble núcleo Xtensa LX7",
      Memoria: "16 MB Flash · 8 MB PSRAM",
      Pantalla: "IPS 2,8\" ST7789 · 320 × 240 px",
      LoRa: "SX1262 · +22 dBm · 433 / 868 / 915 MHz",
      Inalámbrico: "Wi-Fi 2,4 GHz · Bluetooth 5 LE",
      Entrada: "Teclado QWERTY · trackball · micrófono · altavoz",
      Desarrollo: "Arduino · PlatformIO · MicroPython",
    },
  },
  {
    slug: "lilygo-t-deck-plus",
    name: "LILYGO T-Deck Plus",
    category: "lora-meshtastic",
    subcategory: "Comunicadores LoRa",
    marca: "LILYGO",
    costo: 296980,
    badge: "Meshtastic",
    isFeatured: true,
    images: imgs("t-deck-plus", 4),
    shortDescription: "T-Deck con GPS y batería de 2000 mAh integrados, listo para Meshtastic.",
    description:
      "La evolución del T-Deck: suma módulo GPS, ranura TF y batería integrada de 2000 mAh en una carcasa cerrada. Es la opción lista para usar como comunicador Meshtastic con posición en el mapa y días de autonomía, sin armar nada.",
    destacados: ["GPS integrado", "2000 mAh", "LoRa SX1262"],
    features: [
      "Comunicador Meshtastic con ubicación GPS en tiempo real",
      "Rastreo de equipos en rutas, obras o zonas rurales",
      "Red de mensajería privada para brigadas y comunidades",
      "Registro de recorridos y puntos de interés",
    ],
    specifications: {
      Procesador: "ESP32-S3FN16R8 · doble núcleo Xtensa LX7",
      Memoria: "16 MB Flash · 8 MB PSRAM",
      Pantalla: "IPS 2,8\" ST7789 · 320 × 240 px",
      LoRa: "SX1262 · +22 dBm · 433 / 868 / 915 MHz",
      Posicionamiento: "Módulo GPS integrado",
      Batería: "2000 mAh integrada",
      Inalámbrico: "Wi-Fi 2,4 GHz · Bluetooth 5 LE",
      Extras: "Ranura TF · micrófono · altavoz",
    },
  },
  {
    slug: "lilygo-t-beam-1w",
    name: "LILYGO T-Beam 1W",
    category: "lora-meshtastic",
    subcategory: "Nodos y repetidores",
    marca: "LILYGO",
    costo: 208207,
    images: imgs("t-beam-1w", 4),
    shortDescription: "Nodo LoRa de 1 W con ESP32-S3, GPS, OLED de 1,3\" y ventilador.",
    description:
      "Placa LoRa de alta potencia: transmite a 1 W para cubrir distancias largas, con ventilador para disipar el calor, GPS y pantalla OLED de 1,3\". Pensada como repetidor o nodo fijo de una red Meshtastic, alimentada con batería F550 o fuente externa.",
    destacados: ["LoRa 1 W", "GPS", "OLED 1,3\""],
    features: [
      "Repetidor Meshtastic para ampliar la cobertura de la red",
      "Enlace de telemetría de sensores a varios kilómetros",
      "Estación base en fincas, montaña o zonas sin señal",
      "Rastreo GPS de activos y vehículos",
    ],
    specifications: {
      Procesador: "ESP32-S3 · doble núcleo Xtensa LX7",
      Memoria: "16 MB Flash · 8 MB PSRAM",
      LoRa: "SX1262 · 1 W · 830 a 945 MHz",
      Pantalla: "OLED 1,3\"",
      Posicionamiento: "GPS integrado",
      Energía: "PMU AXP2101 · compatible con batería F550",
      Inalámbrico: "Wi-Fi 2,4 GHz · Bluetooth 5 LE",
      Refrigeración: "Ventilador activo",
    },
  },
  {
    slug: "lilygo-t-echo-card",
    name: "LILYGO T-Echo Card",
    category: "lora-meshtastic",
    subcategory: "Comunicadores LoRa",
    marca: "LILYGO",
    costo: 249179,
    images: imgs("t-echo-card", 4),
    shortDescription: "Tarjeta LoRa nRF52840 de bajo consumo con GPS, IMU y panel solar.",
    description:
      "Nodo LoRa del tamaño de una tarjeta, con nRF52840 de muy bajo consumo, GPS multisistema, sensor de movimiento de 9 ejes, audio y un panel solar de 0,25 W. Se lleva colgado y funciona durante días como tracker o nodo Meshtastic personal.",
    destacados: ["nRF52840", "Panel solar", "GPS + IMU 9 ejes"],
    features: [
      "Tracker personal Meshtastic de larga autonomía",
      "Nodo solar para senderismo, ciclismo o trabajo de campo",
      "Detección de caídas o movimiento con el IMU de 9 ejes",
      "Balizas de ubicación para personas y equipos",
    ],
    specifications: {
      Procesador: "nRF52840 · 1 MB Flash · 256 kB RAM",
      LoRa: "SX1262 · 400 a 520 MHz y 830 a 945 MHz",
      Posicionamiento: "L76K · GPS, GLONASS, BeiDou, QZSS",
      Sensores: "ICM20948 · IMU de 9 ejes",
      Pantalla: "OLED 0,42\" · 72 × 40 px",
      Audio: "Altavoz 1 W · micrófono MEMS",
      Energía: "Panel solar 0,25 W · 5 V",
      Dimensiones: "90 × 60 × 9,5 mm",
    },
  },
  {
    slug: "m5stack-cardputer-adv",
    name: "M5Stack Cardputer Adv",
    category: "esp32",
    subcategory: "Computadoras de bolsillo",
    marca: "M5Stack",
    costo: 178805,
    isFeatured: true,
    images: imgs("cardputer-adv", 5),
    shortDescription: "Computadora programable del tamaño de una tarjeta con ESP32-S3 y 56 teclas.",
    description:
      "Plataforma programable del tamaño de una tarjeta, basada en el módulo Stamp-S3A. Trae teclado de 56 teclas, pantalla de 1,14\", audio completo, emisor infrarrojo, IMU y batería de 1750 mAh. Base magnética y puertos Grove para conectar sensores en segundos.",
    destacados: ["ESP32-S3", "56 teclas", "1750 mAh"],
    features: [
      "Prototipado rápido de IoT con sensores Grove",
      "Control remoto infrarrojo y automatización del hogar",
      "Herramienta portátil de pruebas Wi-Fi y Bluetooth",
      "Enseñanza de programación con UiFlow2 y Arduino",
    ],
    specifications: {
      Procesador: "ESP32-S3FN8 · doble núcleo LX7 a 240 MHz",
      Memoria: "8 MB Flash · microSD",
      Pantalla: "ST7789V2 1,14\" · 240 × 135 px",
      Teclado: "56 teclas (4 × 14)",
      Audio: "Códec ES8311 · altavoz 1 W · jack 3,5 mm",
      Sensores: "IMU BMI270 · emisor infrarrojo",
      Expansión: "Grove HY2.0-4P · EXT 2,54-14P",
      Batería: "1750 mAh",
      Dimensiones: "84 × 54 × 19,6 mm · 81 g",
    },
  },
  {
    slug: "raspberry-pi-5",
    name: "Raspberry Pi 5",
    category: "computadoras",
    subcategory: "Placas SBC",
    marca: "Raspberry Pi",
    costo: 292828,
    isFeatured: true,
    images: imgs("raspberry-pi-5", 3),
    shortDescription: "Computadora de placa única con Cortex-A76 a 2,4 GHz, PCIe y doble 4K.",
    description:
      "La Raspberry Pi más rápida: procesador Broadcom BCM2712 de cuatro núcleos Cortex-A76 a 2,4 GHz, hasta tres veces más rendimiento que la generación anterior. Suma PCI Express para discos NVMe, doble salida 4K y el doble de ancho de banda USB.",
    destacados: ["Cortex-A76 2,4 GHz", "PCIe 2.0", "Doble 4K"],
    features: [
      "Servidor doméstico: NAS, Home Assistant o nube privada",
      "Gateway IoT y concentrador de sensores",
      "Estación de desarrollo Linux y laboratorio de redes",
      "Señalización digital y kioscos",
    ],
    specifications: {
      Procesador: "Broadcom BCM2712 · 4 × Cortex-A76 a 2,4 GHz",
      Memoria: "LPDDR4X · 4 GB u 8 GB",
      Video: "2 × micro HDMI 4K a 60 Hz",
      Almacenamiento: "microSD SDR104 · PCIe 2.0 x1 para NVMe",
      Conectividad: "Gigabit Ethernet · Wi-Fi 5 · Bluetooth 5.0",
      USB: "2 × USB 3.0 · 2 × USB 2.0",
      Cámara_y_pantalla: "2 × MIPI de 4 carriles",
      GPIO: "40 pines",
    },
  },
  {
    slug: "clockworkpi-uconsole",
    name: "ClockworkPi uConsole",
    category: "computadoras",
    subcategory: "Terminales portátiles",
    marca: "ClockworkPi",
    costo: 1595666,
    badge: "Premium",
    images: imgs("clockworkpi-uconsole", 4),
    shortDescription: "Terminal Linux portátil con pantalla de 5\", teclado retroiluminado y mainboard v3.14.",
    description:
      "Computadora Linux de bolsillo en carcasa metálica, con pantalla IPS de 5\" a 720p y teclado QWERTY retroiluminado. Usa el mainboard ClockworkPi v3.14 y un módulo de cómputo intercambiable, con puerto de expansión para radio SDR, LoRa o 4G. Versión Wi-Fi, paquete Core.",
    destacados: ["Pantalla 5\" 720p", "Linux", "Expansión SDR/LoRa"],
    features: [
      "Terminal de campo para administración de servidores y redes",
      "Radio definida por software (SDR) y experimentación RF",
      "Laboratorio portátil de ciberseguridad",
      "Computadora de viaje para programar sin portátil",
    ],
    specifications: {
      Pantalla: "IPS 5\" · HD 720p",
      Teclado: "QWERTY ultraportátil retroiluminado",
      Mainboard: "ClockworkPi v3.14",
      Cómputo: "Compatible con Raspberry Pi CM4 (Cortex-A72, 4 GB)",
      Conectividad: "Wi-Fi 2,4 / 5 GHz · Bluetooth 5.0 (vía CM4)",
      Audio: "Doble altavoz",
      Energía: "Módulo de batería para 2 × 18650 (no incluidas)",
      Sistema: "clockworkOS",
    },
  },
  {
    slug: "trimui-brick-pro",
    name: "TrimUI Brick Pro",
    category: "handhelds",
    subcategory: "Consolas Linux",
    marca: "TrimUI",
    costo: 354190,
    images: imgs("trimui-brick-pro", 4),
    shortDescription: "Consola retro portátil Linux con pantalla de 3,95\" 1024 × 768 y 5000 mAh.",
    description:
      "Consola portátil vertical con sistema Linux de código abierto y pantalla IPS laminada de 3,95\" a 1024 × 768. Procesador Allwinner A133p, Wi-Fi y Bluetooth, batería de 5000 mAh y salida de audio estéreo. También sirve como reproductor de video y plataforma para experimentar con Linux embebido.",
    destacados: ["Pantalla 3,95\"", "Linux abierto", "5000 mAh"],
    features: [
      "Emulación retro y juegos indie",
      "Reproductor de video y música portátil",
      "Plataforma para experimentar con Linux embebido",
      "Regalo para amantes de la tecnología y los videojuegos",
    ],
    specifications: {
      Pantalla: "IPS 3,95\" laminada · 1024 × 768 · 60 Hz",
      Procesador: "Allwinner A133p a 1,8 GHz",
      GPU: "PowerVR GE8300",
      Memoria: "1 GB LPDDR3 · 8 GB eMMC · TF hasta 1 TB",
      Conectividad: "Wi-Fi 802.11 b/g/n · Bluetooth 4.2",
      Audio: "2 altavoces estéreo · jack 3,5 mm · micrófono",
      Batería: "5000 mAh",
      Puertos: "USB-C 2.0",
    },
  },
]

const fmt = (n) => `$${Math.round(n).toLocaleString("es-CO")}`

async function limpiar() {
  const slugs = CATALOGO.map((p) => p.slug)
  const borrados = await sql`delete from products where slug = any(${slugs}) returning slug`
  console.log(`Borrados ${borrados.length} productos de hardware`)
}

async function sembrar() {
  for (const p of CATALOGO) {
    // Claves con guion bajo en el objeto para no romper la sintaxis; en la ficha van con espacio.
    const specifications = Object.fromEntries(
      Object.entries(p.specifications).map(([k, v]) => [k.replaceAll("_", " "), v])
    )
    const metadata = {
      coleccion: "hardware",
      marca: p.marca,
      entrega: ENTREGA,
      destacados: p.destacados,
      // JSONB no conserva el orden de las claves: la ficha las ordena con esta lista.
      ordenSpecs: Object.keys(specifications),
    }
    await sql`
      insert into products (
        name, slug, description, short_description, price, product_type, category,
        subcategory, tags, images, stock, features, specifications, metadata,
        is_active, is_featured, badge
      ) values (
        ${p.name}, ${p.slug}, ${p.description}, ${p.shortDescription}, ${precioVenta(p.costo)}, 'physical',
        ${p.category}, ${p.subcategory}, ${[p.marca.toLowerCase(), ...p.destacados]}, ${p.images},
        -1, ${JSON.stringify(p.features)}, ${JSON.stringify(specifications)}, ${JSON.stringify(metadata)},
        true, ${p.isFeatured ?? false}, ${p.badge ?? null}
      )
      on conflict (slug) do update set
        name = excluded.name, description = excluded.description,
        short_description = excluded.short_description, price = excluded.price,
        product_type = excluded.product_type, category = excluded.category,
        subcategory = excluded.subcategory, tags = excluded.tags, images = excluded.images,
        stock = excluded.stock, features = excluded.features,
        specifications = excluded.specifications, metadata = excluded.metadata,
        is_active = excluded.is_active, is_featured = excluded.is_featured,
        badge = excluded.badge, updated_at = now()
    `
    const precio = precioVenta(p.costo)
    const comision = (precio * WOMPI_PCT + WOMPI_FIJO) * (1 + IVA)
    const ganancia = precio - comision - p.costo
    console.log(
      `✓ ${p.name.padEnd(24)} costo ${fmt(p.costo)} → precio ${fmt(precio)} · Wompi ${fmt(comision)} · ganancia ${fmt(ganancia)} (${((ganancia / p.costo) * 100).toFixed(1)} %)`
    )
  }
}

if (process.argv.includes("--clean")) {
  await limpiar()
} else {
  await sembrar()
}
