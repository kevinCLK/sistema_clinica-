"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"

export async function getUsers() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                doctor: {
                    select: {
                        especialidad: true
                    }
                }
            }
        })
        return users
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

export async function updateUserRole(userId: number, role: Role) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, message: "No autorizado" }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        revalidatePath("/usuarios")
        return { success: true, message: "Rol actualizado exitosamente" }
    } catch (error) {
        console.error("Error updating user role:", error)
        return { success: false, message: "Error al actualizar rol" }
    }
}
