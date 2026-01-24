"use server"

import prisma from "@/lib/prisma"
import { doctorSchema } from "@/lib/validations/doctor"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"

export async function createDoctor(data: unknown) {
    try {
        const validatedData = doctorSchema.parse(data)

        // Crear usuario primero
        const user = await prisma.user.create({
            data: {
                name: `Dr. ${validatedData.nombres} ${validatedData.apellidos}`,
                email: validatedData.email,
                password: await hash(validatedData.password || "doctor123", 10),
            },
        })

        // Crear doctor vinculado al usuario
        await prisma.doctor.create({
            data: {
                nombres: validatedData.nombres.toUpperCase(),
                apellidos: validatedData.apellidos.toUpperCase(),
                telefono: validatedData.telefono,
                licenciaMedica: validatedData.licenciaMedica.toUpperCase(),
                especialidad: validatedData.especialidad.toUpperCase(),
                userId: user.id,
            },
        })

        revalidatePath("/doctores")
        return { success: true, message: "Doctor creado exitosamente" }
    } catch (error: any) {
        console.error("Error creating doctor:", error)
        if (error.code === 'P2002') {
            return { success: false, message: "El email ya está registrado" }
        }
        return { success: false, message: "Error al crear doctor" }
    }
}

export async function updateDoctor(id: number, data: unknown) {
    try {
        const validatedData = doctorSchema.parse(data)

        await prisma.doctor.update({
            where: { id },
            data: {
                nombres: validatedData.nombres.toUpperCase(),
                apellidos: validatedData.apellidos.toUpperCase(),
                telefono: validatedData.telefono,
                licenciaMedica: validatedData.licenciaMedica.toUpperCase(),
                especialidad: validatedData.especialidad.toUpperCase(),
            },
        })

        revalidatePath("/doctores")
        return { success: true, message: "Doctor actualizado exitosamente" }
    } catch (error) {
        console.error("Error updating doctor:", error)
        return { success: false, message: "Error al actualizar doctor" }
    }
}

export async function deleteDoctor(id: number) {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!doctor) {
            return { success: false, message: "Doctor no encontrado" }
        }

        // Eliminar doctor (cascade eliminará el user automáticamente por la relación)
        await prisma.doctor.delete({
            where: { id },
        })

        // Eliminar usuario asociado
        await prisma.user.delete({
            where: { id: doctor.userId },
        })

        revalidatePath("/doctores")
        return { success: true, message: "Doctor eliminado exitosamente" }
    } catch (error) {
        console.error("Error deleting doctor:", error)
        return { success: false, message: "Error al eliminar doctor" }
    }
}

export async function getDoctores() {
    try {
        const doctores = await prisma.doctor.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        return doctores
    } catch (error) {
        console.error("Error fetching doctores:", error)
        return []
    }
}

export async function getDoctor(id: number) {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        })
        return doctor
    } catch (error) {
        console.error("Error fetching doctor:", error)
        return null
    }
}
