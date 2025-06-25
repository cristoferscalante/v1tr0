import Link from "next/link"
import { FileQuestionIcon } from "@/lib/icons"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-custom-2/20 rounded-full mb-6">
            <FileQuestionIcon className="w-10 h-10 text-highlight" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-textPrimary">Página no encontrada</h1>
          <p className="text-xl text-textMuted mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-highlight px-8 text-sm font-medium text-white shadow transition-all duration-300 hover:bg-highlight/90 hover:shadow-lg hover:scale-105"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
