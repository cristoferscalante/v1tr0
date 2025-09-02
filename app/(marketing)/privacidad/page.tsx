import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-textMuted hover:text-highlight transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <div className="bg-backgroundSecondary border border-custom-2/20 rounded-xl p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-highlight">Política de Privacidad</h1>

        <div className="space-y-6 text-textMuted">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">1. Información que Recopilamos</h2>
            <p>
              En V1TR0 Technologies, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta
              política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio
              web y te informará sobre tus derechos de privacidad.
            </p>
            <p className="mt-2">Podemos recopilar los siguientes tipos de información:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Información de contacto (nombre, correo electrónico, teléfono, etc.)</li>
              <li>Información técnica (dirección IP, tipo de navegador, etc.)</li>
              <li>Información de uso (páginas visitadas, tiempo de permanencia, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">2. Cómo Utilizamos tu Información</h2>
            <p>Utilizamos la información que recopilamos para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Mejorar, personalizar y ampliar nuestros servicios</li>
              <li>Comprender y analizar cómo utilizas nuestros servicios</li>
              <li>Comunicarnos contigo, incluyendo el envío de notificaciones relacionadas con el servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">3. Compartir tus Datos Personales</h2>
            <p>
              No compartimos tus datos personales con terceros excepto cuando sea necesario para proporcionar nuestros
              servicios o cuando estemos legalmente obligados a hacerlo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">4. Seguridad de Datos</h2>
            <p>
              La seguridad de tus datos es importante para nosotros, pero recuerda que ningún método de transmisión por
              Internet o método de almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por utilizar medios
              comercialmente aceptables para proteger tus datos personales, no podemos garantizar su seguridad absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">5. Tus Derechos</h2>
            <p>Tienes los siguientes derechos relacionados con tus datos personales:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Derecho a acceder, actualizar o eliminar la información que tenemos sobre ti</li>
              <li>Derecho de rectificación</li>
              <li>Derecho a oponerte al procesamiento</li>
              <li>Derecho a la portabilidad de datos</li>
              <li>Derecho a retirar el consentimiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-textPrimary">6. Cambios a esta Política de Privacidad</h2>
            <p>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio
              publicando la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;última
              actualización&quot;.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-custom-2/20">
          <p className="text-sm text-textMuted">
            Última actualización:&#123;&quot; &quot;&#125;
            {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Bogota" })}
          </p>
        </div>
      </div>
    </div>
  )
}
