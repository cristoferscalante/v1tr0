import type { Metadata } from "next"

import { RoutePageView, buildRouteMetadata } from "@/components/servicios/detalle/RoutePageView"
import { hardwarePage } from "@/lib/data/rutas"

export const metadata: Metadata = buildRouteMetadata(hardwarePage)

export default function HardwareIotPage() {
  return <RoutePageView page={hardwarePage} />
}
