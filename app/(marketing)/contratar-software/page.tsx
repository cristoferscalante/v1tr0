import type { Metadata } from "next"

import { RoutePageView, buildRouteMetadata } from "@/components/servicios/detalle/RoutePageView"
import { softwarePage } from "@/lib/data/rutas"

export const metadata: Metadata = buildRouteMetadata(softwarePage)

export default function ContratarSoftwarePage() {
  return <RoutePageView page={softwarePage} />
}
