"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateProfileSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"), // La validación de unicidad debe ser manejada en el catch
    image: z.string().optional(),
})

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return { success: false, message: "No autorizado" }
    }

    const result = updateProfileSchema.safeParse(data)
    if (!result.success) {
        return { success: false, message: "Datos inválidos" }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: result.data.name,
                // @ts-ignore
                image: result.data.image
                // Email no se actualiza por ahora para simplificar auth
            }
        })

        revalidatePath("/perfil")
        revalidatePath("/dashboard")
        return { success: true, message: "Perfil actualizado correctamente" }
    } catch (error) {
        return { success: false, message: "Error al actualizar perfil" }
    }
}

export async function changePassword(data: z.infer<typeof changePasswordSchema>) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return { success: false, message: "No autorizado" }
    }

    const result = changePasswordSchema.safeParse(data)
    if (!result.success) {
        // @ts-ignore
        return { success: false, message: result.error.errors[0].message }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        return { success: false, message: "Usuario no encontrado" }
    }

    const passwordsMatch = await bcrypt.compare(data.currentPassword, user.password)
    if (!passwordsMatch) {
        return { success: false, message: "La contraseña actual es incorrecta" }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        })

        return { success: true, message: "Contraseña actualizada correctamente" }
    } catch (error) {
        return { success: false, message: "Error al actualizar contraseña" }
    }
}
