"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function loginAction(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            return { success: false, error: "Credenciales inválidas" }
        }
        return { success: false, error: "Error al iniciar sesión" }
    }
}

export async function registerAction(name: string, email: string, password: string) {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, error: "El usuario ya existe" }
        }

        // Hashear la contraseña
        const hashedPassword = await hash(password, 10)

        // Crear el usuario
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        // Auto-login después del registro
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        return { success: true }
    } catch (error) {
        console.error("Registration error:", error)
        return { success: false, error: "Error al registrar usuario" }
    }
}
