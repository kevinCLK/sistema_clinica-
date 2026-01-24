"use server"

import prisma from "@/lib/prisma"
import { citaSchema } from "@/lib/validations/cita"
import { revalidatePath } from "next/cache"

export async function createCita(data: unknown) {
    try {
        const validatedData = citaSchema.parse(data)

        // Verificar conflictos de horario
        const conflicto = await prisma.cita.findFirst({
            where: {
                doctorId: validatedData.doctorId,
                consultorioId: validatedData.consultorioId,
                OR: [
                    {
                        AND: [
                            { inicio: { lte: validatedData.inicio } },
                            { final: { gt: validatedData.inicio } },
                        ],
                    },
                    {
                        AND: [
                            { inicio: { lt: validatedData.final } },
                            { final: { gte: validatedData.final } },
                        ],
                    },
                ],
            },
        })

        if (conflicto) {
            return {
                success: false,
                message: "Conflicto de horario: el doctor o consultorio ya tiene una cita en ese horario"
            }
        }

        await prisma.cita.create({
            data: {
                titulo: validatedData.titulo,
                inicio: validatedData.inicio,
                final: validatedData.final,
                color: validatedData.color,
                userId: validatedData.userId,
                doctorId: validatedData.doctorId,
                consultorioId: validatedData.consultorioId,
            },
        })

        revalidatePath("/citas")
        return { success: true, message: "Cita creada exitosamente" }
    } catch (error) {
        console.error("Error creating cita:", error)
        return { success: false, message: "Error al crear cita" }
    }
}

export async function updateCita(id: number, data: unknown) {
    try {
        const validatedData = citaSchema.parse(data)

        // Verificar conflictos excluyendo la cita actual
        const conflicto = await prisma.cita.findFirst({
            where: {
                id: { not: id },
                doctorId: validatedData.doctorId,
                consultorioId: validatedData.consultorioId,
                OR: [
                    {
                        AND: [
                            { inicio: { lte: validatedData.inicio } },
                            { final: { gt: validatedData.inicio } },
                        ],
                    },
                    {
                        AND: [
                            { inicio: { lt: validatedData.final } },
                            { final: { gte: validatedData.final } },
                        ],
                    },
                ],
            },
        })

        if (conflicto) {
            return {
                success: false,
                message: "Conflicto de horario: el doctor o consultorio ya tiene una cita en ese horario"
            }
        }

        await prisma.cita.update({
            where: { id },
            data: {
                titulo: validatedData.titulo,
                inicio: validatedData.inicio,
                final: validatedData.final,
                color: validatedData.color,
                userId: validatedData.userId,
                doctorId: validatedData.doctorId,
                consultorioId: validatedData.consultorioId,
            },
        })

        revalidatePath("/citas")
        return { success: true, message: "Cita actualizada exitosamente" }
    } catch (error) {
        console.error("Error updating cita:", error)
        return { success: false, message: "Error al actualizar cita" }
    }
}

export async function deleteCita(id: number) {
    try {
        await prisma.cita.delete({
            where: { id },
        })

        revalidatePath("/citas")
        return { success: true, message: "Cita eliminada exitosamente" }
    } catch (error) {
        console.error("Error deleting cita:", error)
        return { success: false, message: "Error al eliminar cita" }
    }
}

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getCitas() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return []

        const { id, role } = session.user
        let whereClause = {}

        if (role === "DOCTOR") {
            whereClause = { doctor: { userId: parseInt(id) } }
        } else if (role === "PATIENT") {
            whereClause = { userId: parseInt(id) }
        }

        const citas = await prisma.cita.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { name: true, email: true },
                },
                doctor: {
                    select: { nombres: true, apellidos: true, especialidad: true },
                },
                consultorio: {
                    select: { nombre: true, ubicacion: true },
                },
            },
            orderBy: { inicio: "desc" },
        })
        return citas
    } catch (error) {
        console.error("Error fetching citas:", error)
        return []
    }
}

// Obtener pacientes (usuarios sin doctor asociado)
export async function getPacientesForCitas() {
    try {
        const pacientes = await prisma.user.findMany({
            where: {
                doctor: null, // Solo usuarios que NO son doctores
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: { name: "asc" },
        })
        return pacientes
    } catch (error) {
        console.error("Error fetching pacientes:", error)
        return []
    }
}
