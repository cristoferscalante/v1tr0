"use client"

import { motion } from "framer-motion"

/**
 * El robot del asistente: el mismo dibujo vectorial de la marca, con la cara
 * animada. No es decoración suelta — el ánimo lo decide la conversación
 * (ver `animoDelPaso` en ContactoAsistenteSection), así que el robot reacciona
 * a lo que la persona elige: se alegra cuando avanza, piensa mientras escribe
 * la respuesta y celebra cuando el brief queda completo.
 *
 * Mientras habla, la cara se convierte en una onda de sonido: los ojos y la
 * boca se funden y en su lugar corre una señal, como en un vúmetro.
 *
 * Todo el movimiento respeta `prefers-reduced-motion` por vía de framer-motion.
 */

/**
 * Las tres siluetas de la onda. Misma estructura de comandos en las tres, para
 * que framer-motion pueda interpolar la `d` de una a otra.
 */
const ONDAS = [
  "M82 70 Q90 55 97 70 Q104 82 111 70 Q118 58 125 70 Q132 79 139 70",
  "M82 70 Q90 80 97 70 Q104 57 111 70 Q118 84 125 70 Q132 62 139 70",
  "M82 70 Q90 64 97 70 Q104 74 111 70 Q118 63 125 70 Q132 73 139 70",
]

export type Animo =
  | "neutral"
  | "pensando"
  | "contento"
  | "sorprendido"
  | "confundido"
  | "celebrando"

/** Ojo: rectángulo redondeado. Cada ánimo lo achata, lo estira o lo entrecierra. */
type FormaOjo = { y: number; alto: number; rx: number }

interface Gesto {
  izquierdo: FormaOjo
  derecho: FormaOjo
  /** Boca: siempre tres puntos, para que la interpolación entre gestos sea limpia. */
  boca: string
  /** Inclinación de la cabeza, en grados. */
  cabeza: number
  /**
   * Color de las piezas. Sale de la paleta del sitio: el destacado
   * (`highlight.dark`, #26ffdf) cuando está atento, y tonos más apagados del
   * primario cuando piensa o no entiende.
   */
  color: string
  /** Altura del rebote de la antena, en px del viewBox. */
  antena: number
}

const OJO_NORMAL: FormaOjo = { y: 61.8, alto: 18.5, rx: 2.4 }

const GESTOS: Record<Animo, Gesto> = {
  neutral: {
    izquierdo: OJO_NORMAL,
    derecho: OJO_NORMAL,
    boca: "M100 85.5 Q109 85.5 118 85.5",
    cabeza: 0,
    color: "#26ffdf",
    antena: 1.5,
  },
  pensando: {
    izquierdo: { y: 68, alto: 6, rx: 3 },
    derecho: { y: 64, alto: 12, rx: 3 },
    boca: "M103 85.5 Q109 84 115 85.5",
    cabeza: -4,
    color: "#5fc7bd",
    antena: 4,
  },
  contento: {
    izquierdo: { y: 66, alto: 10, rx: 5 },
    derecho: { y: 66, alto: 10, rx: 5 },
    boca: "M100 84 Q109 89.5 118 84",
    cabeza: 2,
    color: "#26ffdf",
    antena: 3,
  },
  sorprendido: {
    izquierdo: { y: 59, alto: 22, rx: 11 },
    derecho: { y: 59, alto: 22, rx: 11 },
    boca: "M105 85.5 Q109 89 113 85.5",
    cabeza: 0,
    color: "#26ffdf",
    antena: 6,
  },
  confundido: {
    izquierdo: { y: 60, alto: 20, rx: 10 },
    derecho: { y: 68, alto: 7, rx: 3.5 },
    boca: "M100 86.5 Q109 83 118 86.5",
    cabeza: 7,
    color: "#08a696",
    antena: 2,
  },
  celebrando: {
    izquierdo: { y: 67, alto: 8, rx: 4 },
    derecho: { y: 67, alto: 8, rx: 4 },
    boca: "M99 83.5 Q109 91 119 83.5",
    cabeza: -2,
    color: "#26ffdf",
    antena: 8,
  },
}

/** Los ojos parpadean solos; en los gestos ya entrecerrados se nota menos. */
const PARPADEO = { duration: 0.18, repeat: Infinity, repeatDelay: 4.5, repeatType: "reverse" as const }

export default function RobotAsistente({
  animo = "neutral",
  hablando = false,
  className = "",
}: {
  animo?: Animo
  /** Mientras habla, la cara pasa a ser una onda de sonido. */
  hablando?: boolean
  className?: string
}) {
  const gesto = GESTOS[animo]
  const transicion = { type: "spring" as const, stiffness: 220, damping: 18 }

  return (
    <motion.svg
      viewBox="0 0 218 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Robot del asistente V1TR0"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Brazos y cuerpo: quietos, sostienen la composición. */}
      <motion.g animate={{ fill: gesto.color }} transition={{ duration: 0.4 }}>
        <path d="M58.5874 138.742L40.1937 134.711L39.853 114.891L51.4343 112.203L58.5874 138.742Z" />
        <path d="M159.753 138.406L177.466 134.711L178.488 114.891L166.566 112.203L159.753 138.406Z" />
        <path d="M150.556 156.211H67.7844C66.0812 156.211 64.0375 154.867 63.6969 152.852L51.4344 110.523C50.4125 107.836 52.7969 105.148 55.5219 105.148H162.478C165.203 105.148 167.587 107.836 166.566 110.523L154.303 152.852C154.303 154.867 152.6 156.211 150.556 156.211Z" />
        <path d="M71.8719 133.367C76.0106 133.367 79.3657 130.058 79.3657 125.977C79.3657 121.895 76.0106 118.586 71.8719 118.586C67.7332 118.586 64.3782 121.895 64.3782 125.977C64.3782 130.058 67.7332 133.367 71.8719 133.367Z" />
      </motion.g>

      <path d="M63.0155 143.109L37.128 137.398L36.4468 112.539L53.8187 108.508L63.0155 143.109ZM43.5999 132.023L54.1593 134.375L49.3905 115.898L43.2593 117.242L43.5999 132.023Z" fill="black" />
      <path d="M155.666 142.438L164.181 108.172L181.894 112.203L180.872 137.062L155.666 142.438ZM168.95 115.898L164.522 134.039L174.741 132.023L175.422 117.578L168.95 115.898Z" fill="black" />
      <path d="M150.556 159.57H67.7843C64.3781 159.57 60.9718 157.219 60.2906 153.859L48.3687 111.867C47.6875 109.852 48.0281 107.164 49.3906 105.484C50.7531 103.469 53.1375 102.125 55.8625 102.125H162.819C165.203 102.125 167.587 103.469 169.291 105.484C170.653 107.5 170.994 109.852 170.312 112.203L158.391 154.195C157.369 156.883 153.962 159.57 150.556 159.57ZM55.8625 108.508C55.5218 108.508 55.1812 108.844 55.1812 108.844C54.8406 109.18 55.1812 109.516 55.1812 109.516L67.4437 151.844C67.4437 152.18 68.125 152.516 68.4656 152.516H151.237C151.578 152.516 151.919 152.18 152.259 151.844L163.5 109.852C163.5 109.516 163.5 109.516 163.5 109.18C163.159 108.844 162.819 108.844 162.819 108.844H55.8625V108.508Z" fill="black" />
      <path d="M71.872 135.383C66.422 135.383 62.3345 131.016 62.3345 125.641C62.3345 120.266 66.7626 116.234 71.872 116.234C76.9814 116.234 81.4095 120.602 81.4095 125.641C81.7501 131.016 77.322 135.383 71.872 135.383ZM71.872 120.602C69.147 120.602 66.7626 122.953 66.7626 125.641C66.7626 128.328 69.147 130.68 71.872 130.68C74.597 130.68 76.9814 128.328 76.9814 125.641C76.9814 122.953 74.9376 120.602 71.872 120.602Z" fill="black" />
      <path d="M121.262 118.922V117.914C121.262 116.906 121.603 116.57 122.625 116.57H134.206C135.228 116.57 135.569 116.906 135.569 117.914V118.922C135.569 119.93 135.228 120.266 134.206 120.266H122.625C121.603 120.266 121.262 119.93 121.262 118.922Z" fill="black" />
      <path d="M121.262 124.969C121.262 123.961 122.284 123.289 122.966 123.289H146.809C147.831 123.289 148.512 124.297 148.512 124.969C148.512 125.977 147.491 126.648 146.809 126.648H122.966C122.284 126.648 121.262 125.977 121.262 124.969Z" fill="black" />
      <path d="M121.262 131.688V131.352C121.262 130.344 122.284 130.008 122.625 130.008H139.316C140.337 130.008 140.678 131.016 140.678 131.352V131.688C140.678 132.695 139.656 133.031 139.316 133.031H122.625C121.603 133.367 121.262 132.695 121.262 131.688Z" fill="black" />

      {/* Brazos largos: se levantan al celebrar. */}
      <motion.g
        animate={{ rotate: animo === "celebrando" ? -8 : 0 }}
        transition={transicion}
        style={{ originX: "20%", originY: "70%" }}
      >
        <path d="M40.1937 127.656C39.8531 127.656 21.4593 126.648 12.9437 109.852C7.83433 99.7734 9.87808 90.3672 10.5593 87.0078V86.6719L18.3937 88.3516V88.6875C17.7125 91.0391 16.35 98.7656 20.0968 106.156C26.2281 118.25 40.1937 119.594 40.1937 119.594V127.656Z" fill="black" />
        <path d="M16.6906 91.7109C14.6469 91.7109 12.9438 91.375 10.9 90.7031C4.42813 88.3516 0 81.2969 0 73.5703H8.175C8.175 77.9375 10.5594 81.9687 13.9656 82.9766C18.3937 84.6562 24.525 82.3047 26.5688 76.9297L34.0625 79.6172C31.3375 87.0078 24.1844 91.7109 16.6906 91.7109Z" fill="black" />
      </motion.g>
      <motion.g
        animate={{ rotate: animo === "celebrando" ? 8 : 0 }}
        transition={transicion}
        style={{ originX: "80%", originY: "70%" }}
      >
        <path d="M178.147 127.656V119.594C178.147 119.594 192.113 118.586 198.244 106.156C201.991 98.7656 200.288 91.0391 199.947 88.6875V88.3516L207.781 86.6719V87.0078C208.463 90.0313 210.506 99.7734 205.397 109.852C196.881 126.648 178.147 127.656 178.147 127.656Z" fill="black" />
        <path d="M201.309 91.375C194.497 91.375 187.684 87.6797 184.278 81.2969L191.431 77.6016C194.156 82.6406 200.628 84.6563 204.716 82.6406C208.122 80.9609 210.166 77.2656 209.825 72.8984L218 72.2266C218.681 79.9531 214.594 87.0078 208.122 90.0313C206.078 91.0391 203.694 91.375 201.309 91.375Z" fill="black" />
      </motion.g>

      {/* Cabeza: se inclina con el ánimo. */}
      <motion.g
        animate={{ rotate: gesto.cabeza }}
        transition={transicion}
        style={{ originX: "50%", originY: "60%" }}
      >
        {/* Antena */}
        <motion.g
          animate={{ y: [0, -gesto.antena, 0] }}
          transition={{ duration: animo === "celebrando" ? 0.6 : 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path
            d="M109.341 20.4922C114.232 20.4922 118.197 16.5817 118.197 11.7578C118.197 6.93395 114.232 3.02344 109.341 3.02344C104.449 3.02344 100.484 6.93395 100.484 11.7578C100.484 16.5817 104.449 20.4922 109.341 20.4922Z"
            animate={{ fill: gesto.color }}
            transition={{ duration: 0.4 }}
          />
          <path d="M109.341 23.5156C102.528 23.5156 97.4187 18.1406 97.4187 11.7578C97.4187 5.375 102.869 0 109.341 0C116.153 0 121.262 5.375 121.262 11.7578C121.262 18.1406 115.812 23.5156 109.341 23.5156ZM109.341 6.04687C106.275 6.04687 103.891 8.39844 103.891 11.4219C103.891 14.4453 106.275 16.7969 109.341 16.7969C112.406 16.7969 114.791 14.4453 114.791 11.4219C114.791 8.39844 112.406 6.04687 109.341 6.04687Z" fill="black" />
        </motion.g>
        <path d="M112.747 20.4922H105.934V33.2578H112.747V20.4922Z" fill="black" />

        {/* Orejas */}
        <motion.g animate={{ fill: gesto.color }} transition={{ duration: 0.4 }}>
          <path d="M61.6531 73.9062L49.7312 71.2188V53.75L61.6531 51.0625V73.9062Z" />
          <path d="M156.347 73.9062L168.269 71.2188V53.75L156.347 51.0625V73.9062Z" />
        </motion.g>
        <path d="M65.0593 77.9375L46.325 73.5703V51.0625L65.0593 46.6953V77.9375ZM52.7968 68.8672L58.5875 70.2109V55.4297L52.7968 56.7734V68.8672Z" fill="black" />
        <path d="M152.941 77.9375V47.0312L171.334 51.3984V73.9062L152.941 77.9375ZM159.413 55.0938V69.875L165.203 68.5313V56.1016L159.413 55.0938Z" fill="black" />

        {/* Carcasa */}
        <motion.path
          d="M147.491 91.0391H75.9593C68.1249 91.0391 61.9937 84.6562 61.9937 77.2656V40.9844C61.9937 35.9453 66.0811 32.25 70.8499 32.25H147.491C152.6 32.25 156.347 36.2813 156.347 40.9844V82.3047C156.347 87.3437 152.6 91.0391 147.491 91.0391Z"
          animate={{ fill: gesto.color }}
          transition={{ duration: 0.4 }}
        />
        <path d="M147.491 94.3984H75.9593C66.4218 94.3984 58.5874 86.6719 58.5874 77.2656V40.9844C58.5874 34.2656 64.0374 28.8906 70.8499 28.8906H147.491C154.303 28.8906 159.753 34.2656 159.753 40.9844V82.3047C159.753 89.0234 154.303 94.3984 147.491 94.3984ZM70.5093 35.6094C67.7843 35.6094 65.0593 37.625 65.0593 40.9844V77.2656C65.0593 82.9766 69.828 87.6797 75.6187 87.6797H147.15C150.216 87.6797 152.6 85.6641 152.6 82.3047V40.9844C152.6 38.2969 150.556 35.6094 147.15 35.6094H70.5093Z" fill="black" />

        {/* Pantalla de la cara */}
        <path d="M140.678 91.0391H80.0468C77.3218 91.0391 75.2781 88.6875 75.2781 86.3359V57.4453C75.2781 52.7422 79.0249 49.7188 83.1124 49.7188H137.612C142.381 49.7188 146.128 53.4141 146.128 58.1172V87.0078C145.447 89.0234 143.744 91.0391 140.678 91.0391Z" fill="black" />

        {/* Cara en reposo: ojos y boca. Se funden mientras habla. */}
        <motion.g animate={{ opacity: hablando ? 0 : 1 }} transition={{ duration: 0.2 }}>
        <motion.rect
          x={89.925}
          y={OJO_NORMAL.y}
          width={9.54}
          height={OJO_NORMAL.alto}
          rx={OJO_NORMAL.rx}
          fill="white"
          animate={{ attrY: gesto.izquierdo.y, height: gesto.izquierdo.alto, rx: gesto.izquierdo.rx }}
          transition={transicion}
        />
        <motion.rect
          x={121.262}
          y={OJO_NORMAL.y}
          width={9.54}
          height={OJO_NORMAL.alto}
          rx={OJO_NORMAL.rx}
          fill="white"
          animate={{ attrY: gesto.derecho.y, height: gesto.derecho.alto, rx: gesto.derecho.rx }}
          transition={transicion}
        />
        {/* Párpados: bajan un instante cada tanto, para que la cara no quede fija. */}
        <motion.rect
          x={87}
          y={49.7}
          width={46}
          fill="black"
          initial={{ height: 0 }}
          animate={{ height: [0, 32] }}
          transition={PARPADEO}
        />

        {/* Boca */}
        <motion.path
          d={GESTOS.neutral.boca}
          animate={{ d: gesto.boca, stroke: gesto.color }}
          transition={transicion}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        </motion.g>

        {/* Onda de sonido: ocupa el sitio de los ojos y la boca. */}
        <motion.path
          d={ONDAS[0]}
          animate={hablando ? { opacity: 1, d: [ONDAS[0]!, ONDAS[1]!, ONDAS[2]!, ONDAS[0]!] } : { opacity: 0 }}
          transition={
            hablando
              ? { d: { duration: 0.7, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.2 } }
              : { duration: 0.2 }
          }
          stroke={gesto.color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  )
}
