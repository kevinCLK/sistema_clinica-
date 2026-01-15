"use server"

import prisma from "@/lib/prisma"
import { pacienteSchema } from "@/lib/validations/paciente"
import { revalidatePath } from "next/cache"

export async function createPaciente(data: unknown) {
    try {
        const validatedData = pacienteSchema.parse(data)

        await prisma.paciente.create({
            data: {
                nombre: validatedData.nombre.toUpperCase(),
                apellidos: validatedData.apellidos.toUpperCase(),
                ci: validatedData.ci,
                numSeguro: validatedData.numSeguro || null,
                fechaNacimiento: validatedData.fechaNacimiento,
                genero: validatedData.genero,
                celular: validatedData.celular,
                correo: validatedData.correo.toLowerCase(),
                direccion: validatedData.direccion.toUpperCase(),
                grupoSanguineo: validatedData.grupoSanguineo,
                alergias: validatedData.alergias?.toUpperCase() || "NINGUNA",
                contactoEmergencia: validatedData.contactoEmergencia.toUpperCase(),
                observaciones: validatedData.observaciones?.toUpperCase() || "",
            },
        })

        revalidatePath("/pacientes")
        return { success: true, message: "Paciente creado exitosamente" }
    } catch (error) {
        console.error("Error creating paciente:", error)
        return { success: false, message: "Error al crear paciente" }
    }
}

export async function updatePaciente(id: number, data: unknown) {
    try {
        const validatedData = pacienteSchema.parse(data)

        await prisma.paciente.update({
            where: { id },
            data: {
                nombre: validatedData.nombre.toUpperCase(),
                apellidos: validatedData.apellidos.toUpperCase(),
                ci: validatedData.ci,
                numSeguro: validatedData.numSeguro || null,
                fechaNacimiento: validatedData.fechaNacimiento,
                genero: validatedData.genero,
                celular: validatedData.celular,
                correo: validatedData.correo.toLowerCase(),
                direccion: validatedData.direccion.toUpperCase(),
                grupoSanguineo: validatedData.grupoSanguineo,
                alergias: validatedData.alergias?.toUpperCase() || "NINGUNA",
                contactoEmergencia: validatedData.contactoEmergencia.toUpperCase(),
                observaciones: validatedData.observaciones?.toUpperCase() || "",
            },
        })

        revalidatePath("/pacientes")
        return { success: true, message: "Paciente actualizado exitosamente" }
    } catch (error) {
        console.error("Error updating paciente:", error)
        return { success: false, message: "Error al actualizar paciente" }
    }
}

export async function deletePaciente(id: number) {
    try {
        await prisma.paciente.delete({
            where: { id },
        })

        revalidatePath("/pacientes")
        return { success: true, message: "Paciente eliminado exitosamente" }
    } catch (error) {
        console.error("Error deleting paciente:", error)
        return { success: false, message: "Error al eliminar paciente" }
    }
}

export async function getPacientes() {
    try {
        const pacientes = await prisma.paciente.findMany({
            orderBy: { createdAt: "desc" },
        })
        return pacientes
    } catch (error) {
        console.error("Error fetching pacientes:", error)
        return []
    }
}

export async function getPaciente(id: number) {
    try {
        const paciente = await prisma.paciente.findUnique({
            where: { id },
        })
        return paciente
    } catch (error) {
        console.error("Error fetching paciente:", error)
        return null
    }
}
