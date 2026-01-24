import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const { pathname } = request.nextUrl

    // 1. Si el usuario intenta acceder al login con sesión, redirigir al dashboard
    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 2. Rutas protegidas que requieren autenticación
    const protectedRoutes = ["/dashboard", "/pacientes", "/doctores", "/citas", "/horarios", "/consultorios", "/perfil"]
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // 3. Protección por Roles (RBAC)
    if (token) {
        const role = token.role as string

        // Doctores no pueden entrar a gestión de doctores o consultorios
        const adminOnlyRoutes = ["/doctores", "/consultorios"]
        if (adminOnlyRoutes.some(route => pathname.startsWith(route)) && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        // Pacientes no pueden entrar a la lista de otros pacientes ni gestión médica
        if (pathname.startsWith("/pacientes") && role === "PATIENT") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
