import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-textMuted hover:text-highlight transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <div className="bg-backgroundSecondary border border-custom-2/20 rounded-xl p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-highlight">Términos y Condiciones</h1>

        <div className="space-y-6 text-textMuted">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">1. Introducción</h2>
            <p>
              Bienvenido a V1TR0 Technologies. Estos términos y condiciones describen las reglas y regulaciones para el
              uso del sitio web de V1TR0 Technologies.
            </p>
            <p className="mt-2">
              Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No
              continúes usando el sitio web de V1TR0 Technologies si no aceptas todos los términos y condiciones
              establecidos en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">2. Licencia de Uso</h2>
            <p>
              A menos que se indique lo contrario, V1TR0 Technologies y/o sus licenciantes poseen los derechos de
              propiedad intelectual de todo el material en V1TR0 Technologies. Todos los derechos de propiedad
              intelectual están reservados.
            </p>
            <p className="mt-2">
              Puedes ver y/o imprimir páginas desde el sitio web para tu uso personal sujeto a las restricciones
              establecidas en estos términos y condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">3. Restricciones</h2>
            <p>Específicamente, no debes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Publicar cualquier material del sitio web en cualquier otro medio</li>
              <li>Vender, alquilar o sublicenciar material del sitio web</li>
              <li>Reproducir, duplicar o copiar material del sitio web</li>
              <li>Redistribuir contenido de V1TR0 Technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">4. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso V1TR0 Technologies o sus proveedores serán responsables por cualquier daño (incluyendo, sin
              limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surjan
              del uso o la incapacidad de usar los materiales en el sitio web de V1TR0 Technologies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">5. Modificaciones</h2>
            <p>
              V1TR0 Technologies puede revisar estos términos de servicio del sitio web en cualquier momento sin previo
              aviso. Al usar este sitio web, aceptas estar vinculado a la versión actual de estos términos y
              condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">6. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de España y te sometes
              irrevocablemente a la jurisdicción exclusiva de los tribunales en ese estado o localidad.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-custom-2/20">
          <p className="text-sm text-textMuted">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}
