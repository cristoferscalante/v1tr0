import LoadingSpinner from "@/components/ui/loading-spinner"

// Antes vivía en app/loading.tsx y envolvía también el sitio público. Su
// Suspense escondía el HTML del home tras la transmisión y lo remontaba,
// reiniciando la intro; por eso ahora está solo en las secciones de trabajo.

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
