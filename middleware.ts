import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_ROLES = ["admin", "team"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // El panel viejo de /dashboard fue eliminado; el redirect se conserva para
  // no romper enlaces guardados por el equipo.
  if (pathname.startsWith("/dashboard")) {
    const newPath = pathname.replace("/dashboard", "/admin")
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  if (pathname.startsWith("/admin")) {
    // /admin/login es la única página del grupo que se sirve sin sesión.
    if (pathname === "/admin/login") return NextResponse.next()

    const session = await auth()
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (!ADMIN_ROLES.includes(session.user.role ?? "")) {
      return NextResponse.redirect(new URL("/client-dashboard", request.url))
    }
  }

  // El portal del cliente se protegía solo desde el layout (client-side), así
  // que la shell del panel llegaba a pintarse antes de redirigir. La API ya
  // filtraba por clientId, así que era fuga de UI y no de datos, pero la
  // verificación pertenece al servidor.
  if (pathname.startsWith("/client-dashboard")) {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (ADMIN_ROLES.includes(session.user.role ?? "")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/client-dashboard/:path*"],
}
