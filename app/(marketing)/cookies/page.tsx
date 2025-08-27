import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-textMuted hover:text-highlight transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <div className="bg-backgroundSecondary border border-custom-2/20 rounded-xl p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-highlight">Política de Cookies</h1>

        <div className="space-y-6 text-textMuted">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo cuando los
              visitas. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente, así como
              para proporcionar información a los propietarios del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">2. Cómo Utilizamos las Cookies</h2>
            <p>Utilizamos cookies por varias razones, que se detallan a continuación:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Cookies esenciales:</strong> Algunas cookies son esenciales para que puedas experimentar la
                funcionalidad completa de nuestro sitio.
              </li>
              <li>
                <strong>Cookies de funcionalidad:</strong> Estas cookies nos permiten recordar las elecciones que haces
                y proporcionar características mejoradas y más personales.
              </li>
              <li>
                <strong>Cookies de rendimiento:</strong> Utilizamos estas cookies para mejorar cómo funciona nuestro
                sitio web, entender cómo interactúan los visitantes con el sitio y mantener nuestro sitio actualizado y
                relevante.
              </li>
              <li>
                <strong>Cookies de marketing:</strong> Estas cookies se utilizan para rastrear a los visitantes en los
                sitios web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario
                individual.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">3. Control de Cookies</h2>
            <p>
              Puedes controlar y/o eliminar las cookies según lo desees. Puedes eliminar todas las cookies que ya están
              en tu dispositivo y puedes configurar la mayoría de los navegadores para evitar que se coloquen. Si lo
              haces, es posible que tengas que ajustar manualmente algunas preferencias cada vez que visites un sitio y
              que algunos servicios y funcionalidades no funcionen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">4. Cookies Específicas que Utilizamos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-custom-1/30 rounded-lg mt-2">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-textPrimary">Nombre</th>
                    <th className="px-4 py-2 text-left text-textPrimary">Propósito</th>
                    <th className="px-4 py-2 text-left text-textPrimary">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t border-custom-2/20 px-4 py-2">v1tr0-theme</td>
                    <td className="border-t border-custom-2/20 px-4 py-2">
                      Almacena la preferencia de tema (claro/oscuro)
                    </td>
                    <td className="border-t border-custom-2/20 px-4 py-2">1 año</td>
                  </tr>
                  <tr>
                    <td className="border-t border-custom-2/20 px-4 py-2">v1tr0-session</td>
                    <td className="border-t border-custom-2/20 px-4 py-2">Gestiona la sesión del usuario</td>
                    <td className="border-t border-custom-2/20 px-4 py-2">Sesión</td>
                  </tr>
                  <tr>
                    <td className="border-t border-custom-2/20 px-4 py-2">v1tr0-analytics</td>
                    <td className="border-t border-custom-2/20 px-4 py-2">
                      Recopila información anónima sobre cómo los usuarios navegan por el sitio
                    </td>
                    <td className="border-t border-custom-2/20 px-4 py-2">2 años</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">5. Más Información</h2>
            <p>
              Esperamos que esto haya aclarado las cosas para ti. Como se mencionó anteriormente, si no estás seguro de
              si necesitas algo o no, generalmente es más seguro dejar las cookies habilitadas en caso de que
              interactúen con una de las funciones que utilizas en nuestro sitio.
            </p>
            <p className="mt-2">
              Sin embargo, si todavía estás buscando más información, puedes contactarnos a través de uno de nuestros
              métodos de contacto preferidos.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-custom-2/20">
          <p className="text-sm text-textMuted">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Bogota" })}
          </p>
        </div>
      </div>
    </div>
  )
}
