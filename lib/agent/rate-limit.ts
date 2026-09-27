/**
 * Limitador de tasa por IP para los endpoints de agentes.
 *
 * Ventana deslizante en memoria del proceso. Conviene ser explícito sobre lo
 * que esto es y lo que no: en Vercel cada instancia serverless tiene su propia
 * memoria y las instancias van y vienen, así que el límite real es "N por
 * ventana por instancia viva", no un límite global exacto. Alcanza para lo que
 * defiende —que un script suelto machaque el endpoint desde una IP— y no
 * alcanza para un abuso distribuido.
 *
 * Se aisló en este módulo justamente para que el día que haga falta precisión
 * se reemplace el cuerpo por Redis o Vercel KV sin tocar ninguna ruta.
 */

interface Ventana {
  /** Marcas de tiempo de las peticiones dentro de la ventana vigente. */
  golpes: number[]
}

const registro = new Map<string, Ventana>()

/** Cota del mapa: sin esto, una lluvia de IPs distintas lo haría crecer sin fin. */
const MAX_CLAVES = 5_000

export interface ResultadoLimite {
  permitido: boolean
  restantes: number
  /** Segundos hasta que se libere un cupo; solo tiene sentido si no se permitió. */
  reintentarEn: number
}

export function limitarPorIp(
  ip: string,
  { limite, ventanaMs }: { limite: number; ventanaMs: number }
): ResultadoLimite {
  const ahora = Date.now()
  const desde = ahora - ventanaMs

  if (registro.size > MAX_CLAVES) registro.clear()

  const entrada = registro.get(ip) ?? { golpes: [] }
  const golpes = entrada.golpes.filter((t) => t > desde)

  if (golpes.length >= limite) {
    const masViejo = golpes[0] ?? ahora
    registro.set(ip, { golpes })
    return {
      permitido: false,
      restantes: 0,
      reintentarEn: Math.max(1, Math.ceil((masViejo + ventanaMs - ahora) / 1000)),
    }
  }

  golpes.push(ahora)
  registro.set(ip, { golpes })

  return { permitido: true, restantes: limite - golpes.length, reintentarEn: 0 }
}

/**
 * IP del cliente detrás del proxy de Vercel.
 *
 * `x-forwarded-for` puede traer una cadena de proxies; el cliente original es
 * el primer valor. Cuando no hay ninguna cabecera (desarrollo local) se usa
 * una clave fija: limitar de más en local es preferible a no limitar.
 */
export function ipDePeticion(request: Request): string {
  const reenviada = request.headers.get("x-forwarded-for")
  if (reenviada) return reenviada.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") ?? "desconocida"
}

/** Cabeceras estándar para que un agente bien portado sepa cómo espaciarse. */
export function cabecerasDeLimite(resultado: ResultadoLimite, limite: number): Record<string, string> {
  const cabeceras: Record<string, string> = {
    "X-RateLimit-Limit": String(limite),
    "X-RateLimit-Remaining": String(resultado.restantes),
  }
  if (!resultado.permitido) cabeceras["Retry-After"] = String(resultado.reintentarEn)
  return cabeceras
}
