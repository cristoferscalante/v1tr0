import Image from "next/image"
import Link from "next/link"

const Team = () => {
  return (
    <section className="w-full py-24 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Nuestro Equipo</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Impulsando la innovación digital
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              Somos un equipo interdisciplinario enfocado en crear soluciones que transforman la gestión de proyectos de
              software. Conoce a las personas detrás de V1TR0.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Liderazgo</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Ana Martínez"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Ana Martínez</h4>
              <p className="text-primary mb-4">Directora de Tecnología</p>
              <p className="text-textMuted">
                Especialista en arquitectura de software con más de 10 años de experiencia en desarrollo de plataformas
                de gestión de proyectos.
              </p>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Carlos Rodríguez"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Carlos Rodríguez</h4>
              <p className="text-primary mb-4">Director de Operaciones</p>
              <p className="text-textMuted">
                Experto en gestión de proyectos ágiles y metodologías de desarrollo, con enfoque en la optimización de
                procesos y eficiencia operativa.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 02 */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Desarrollo e Innovación</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Elena Gómez"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Elena Gómez</h4>
              <p className="text-primary mb-4">Ingeniera de IA</p>
              <p className="text-textMuted">
                Especialista en inteligencia artificial y aprendizaje automático, enfocada en la implementación de
                soluciones predictivas para la gestión de proyectos.
              </p>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Miguel Sánchez"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Miguel Sánchez</h4>
              <p className="text-primary mb-4">Desarrollador Full Stack</p>
              <p className="text-textMuted">
                Experto en tecnologías web modernas y arquitecturas escalables para aplicaciones en tiempo real con
                enfoque en la experiencia de usuario.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de unirse al equipo */}
        <div className="w-full py-12 border-t border-custom-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="text-2xl font-bold text-textPrimary">Únete a nuestro equipo</h3>
            <Link
              href="/careers"
              className="flex items-center gap-2 text-textPrimary hover:text-highlight transition-colors"
            >
              <span>Ver oportunidades</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team


  
  
  