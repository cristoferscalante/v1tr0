/**
 * Inyecta un bloque JSON-LD en el HTML servido.
 *
 * Server Component: el objetivo es que el dato estructurado exista en la
 * respuesta HTML inicial. Los rastreadores de los motores de respuesta —a
 * diferencia de Googlebot— en general no ejecutan JavaScript, así que un
 * schema montado desde el cliente es, para ellos, un schema inexistente.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenido propio y estático: no hay entrada de usuario que escapar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
