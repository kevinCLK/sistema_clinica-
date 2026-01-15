"use server"

import prisma from "@/lib/prisma"
import { consultorioSchema } from "@/lib/validations/consultorio"
import { revalidatePath } from "next/cache"

export async function createConsultorio(data: unknown) {
    try {
        const validatedData = consultorioSchema.parse(data)

        await prisma.consultorio.create({
            data: {
                nombre: validatedData.nombre.toUpperCase(),
                ubicacion: validatedData.ubicacion.toUpperCase(),
                capacidad: validatedData.capacidad,
                telefono: validatedData.telefono || null,
                especialidad: validatedData.especialidad.toUpperCase(),
                estado: validatedData.estado,
            },
        })

        revalidatePath("/consultorios")
        return { success: true, message: "Consultorio creado exitosamente" }
    } catch (error) {
        console.error("Error creating consultorio:", error)
        return { success: false, message: "Error al crear consultorio" }
    }
}

export async function updateConsultorio(id: number, data: unknown) {
    try {
        const validatedData = consultorioSchema.parse(data)

        await prisma.consultorio.update({
            where: { id },
            data: {
                nombre: validatedData.nombre.toUpperCase(),
                ubicacion: validatedData.ubicacion.toUpperCase(),
                capacidad: validatedData.capacidad,
                telefono: validatedData.telefono || null,
                especialidad: validatedData.especialidad.toUpperCase(),
                estado: validatedData.estado,
            },
        })

        revalidatePath("/consultorios")
        return { success: true, message: "Consultorio actualizado exitosamente" }
    } catch (error) {
        console.error("Error updating consultorio:", error)
        return { success: false, message: "Error al actualizar consultorio" }
    }
}

export async function deleteConsultorio(id: number) {
    try {
        await prisma.consultorio.delete({
            where: { id },
        })

        revalidatePath("/consultorios")
        return { success: true, message: "Consultorio eliminado exitosamente" }
    } catch (error) {
        console.error("Error deleting consultorio:", error)
        return { success: false, message: "Error al eliminar consultorio" }
    }
}

export async function getConsultorios() {
    try {
        const consultorios = await prisma.consultorio.findMany({
            orderBy: { createdAt: "desc" },
        })
        return consultorios
    } catch (error) {
        console.error("Error fetching consultorios:", error)
        return []
    }
}
