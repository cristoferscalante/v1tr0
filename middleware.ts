import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard")) {
    const newPath = pathname.replace("/dashboard", "/admin")
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  if (pathname.startsWith("/admin")) {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
