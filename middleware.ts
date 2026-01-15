import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()

    // Rutas protegidas que requieren autenticación
    const protectedRoutes = ["/dashboard", "/pacientes", "/doctores", "/citas", "/horarios", "/consultorios"]

    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Si intenta acceder a una ruta protegida sin sesión, redirigir al login
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Si está logueado y intenta acceder al login, redirigir al dashboard
    if (request.nextUrl.pathname === "/login" && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
