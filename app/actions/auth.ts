"use server"

import { AuthError } from "next-auth"
import prisma from "@/lib/prisma"
import { hash, compare } from "bcryptjs"

export async function loginAction(email: string, password: string) {
    try {
        // Verificar credenciales manualmente
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, error: "Credenciales inválidas" }
        }

        const isValid = await compare(password, user.password)
        if (!isValid) {
            return { success: false, error: "Credenciales inválidas" }
        }

        return { success: true, user }
    } catch (error) {
        console.error("Login error:", error)
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
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return { success: true, user }
    } catch (error) {
        console.error("Registration error:", error)
        return { success: false, error: "Error al registrar usuario" }
    }
}
