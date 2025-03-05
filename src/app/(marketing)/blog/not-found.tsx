import Link from "next/link"

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Artículo no encontrado</h1>
      <p className="text-xl text-gray-600 mb-8">
        Lo sentimos, el artículo que estás buscando no existe o ha sido movido.
      </p>
      <Link
        href="/blog"
        className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
      >
        Volver al blog
      </Link>
    </div>
  )
}

