import { NextResponse } from "next/server"
import { z } from "zod"

import { briefSchema, CAMPOS_BRIEF, type Brief } from "@/lib/asistente/brief"
import { instruccionesAsistente } from "@/lib/asistente/prompt"
import { cabecerasDeLimite, ipDePeticion, limitarPorIp } from "@/lib/agent/rate-limit"

/**
 * `POST /api/asistente` — un turno del asistente de contacto del home.
 *
 * Público y sin sesión, así que cada llamada cuesta tokens pagados por V1TR0:
 * por eso hay dos límites por IP (ráfaga y día) y un tope al historial que se
 * reenvía. No guarda nada; el brief vive en el navegador y termina en WhatsApp.
 */

export const dynamic = "force-dynamic"

const LIMITE_MINUTO = 12
const LIMITE_DIA = 120
const MAX_MENSAJES = 24
const MAX_CARACTERES = 800

const peticionSchema = z.object({
  mensajes: z
    .array(
      z.object({
        rol: z.enum(["usuario", "asistente"]),
        texto: z.string().min(1).max(MAX_CARACTERES),
      }),
    )
    .min(1)
    .max(MAX_MENSAJES * 2),
  brief: briefSchema,
})

/** Esquema estricto de salida: el modelo solo puede devolver esta forma. */
const formatoRespuesta = {
  type: "json_schema",
  json_schema: {
    name: "turno_asistente",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["respuesta", "brief", "completo"],
      properties: {
        respuesta: { type: "string" },
        completo: { type: "boolean" },
        brief: {
          type: "object",
          additionalProperties: false,
          required: CAMPOS_BRIEF.map((campo) => campo.id),
          properties: Object.fromEntries(CAMPOS_BRIEF.map((campo) => [campo.id, { type: "string" }])),
        },
      },
    },
  },
}

const salidaSchema = z.object({
  respuesta: z.string().min(1).max(1200),
  completo: z.boolean().catch(false),
  brief: briefSchema,
})

export async function POST(request: Request) {
  const ip = ipDePeticion(request)
  const porMinuto = limitarPorIp(`asistente:min:${ip}`, { limite: LIMITE_MINUTO, ventanaMs: 60_000 })
  const porDia = porMinuto.permitido
    ? limitarPorIp(`asistente:dia:${ip}`, { limite: LIMITE_DIA, ventanaMs: 86_400_000 })
    : porMinuto

  if (!porMinuto.permitido || !porDia.permitido) {
    const limite = porMinuto.permitido ? porDia : porMinuto
    return NextResponse.json(
      { error: "Vas muy rápido. Espera un momento o escríbenos directo por WhatsApp." },
      { status: 429, headers: cabecerasDeLimite(limite, porMinuto.permitido ? LIMITE_DIA : LIMITE_MINUTO) },
    )
  }

  const clave = process.env.OPENAI_API_KEY
  if (!clave) {
    return NextResponse.json({ error: "El asistente no está disponible." }, { status: 503 })
  }

  let cuerpo: z.infer<typeof peticionSchema>
  try {
    cuerpo = peticionSchema.parse(await request.json())
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 })
  }

  const historial = cuerpo.mensajes.slice(-MAX_MENSAJES).map((mensaje) => ({
    role: mensaje.rol === "usuario" ? "user" : "assistant",
    content: mensaje.texto,
  }))

  let respuestaModelo: Response
  try {
    respuestaModelo = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 700,
        response_format: formatoRespuesta,
        messages: [
          { role: "system", content: instruccionesAsistente(cuerpo.brief as Brief) },
          ...historial,
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    })
  } catch (error) {
    console.error("[asistente] sin respuesta de OpenAI", error)
    return NextResponse.json({ error: "El asistente tardó demasiado. Intenta de nuevo." }, { status: 504 })
  }

  if (!respuestaModelo.ok) {
    console.error("[asistente] OpenAI respondió", respuestaModelo.status, await respuestaModelo.text())
    return NextResponse.json({ error: "El asistente no pudo responder. Intenta de nuevo." }, { status: 502 })
  }

  try {
    const datos = await respuestaModelo.json()
    const contenido = datos?.choices?.[0]?.message?.content
    const salida = salidaSchema.parse(JSON.parse(contenido))
    return NextResponse.json(salida)
  } catch (error) {
    console.error("[asistente] salida inválida del modelo", error)
    return NextResponse.json({ error: "El asistente no pudo responder. Intenta de nuevo." }, { status: 502 })
  }
}
