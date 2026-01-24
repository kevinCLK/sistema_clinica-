"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getExpedienteByPacienteId(pacienteId: number) {
    try {
        let expediente = await prisma.expediente.findUnique({
            where: { pacienteId },
            include: {
                consultas: {
                    include: {
                        doctor: true
                    },
                    orderBy: {
                        fecha: 'desc'
                    }
                }
            }
        })

        // Si no existe, lo creamos automáticamente
        if (!expediente) {
            const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } })
            if (!paciente) return null

            const numeroExpediente = `EXP-${paciente.ci}-${Math.floor(Math.random() * 1000)}`

            expediente = await prisma.expediente.create({
                data: {
                    numero: numeroExpediente,
                    pacienteId
                },
                include: {
                    consultas: {
                        include: {
                            doctor: true
                        },
                        orderBy: {
                            fecha: 'desc'
                        }
                    }
                }
            })
        }

        return expediente
    } catch (error) {
        console.error("Error al obtener expediente:", error)
        return null
    }
}

export async function createConsulta(data: {
    expedienteId: number
    doctorId: number
    motivo: string
    diagnostico: string
    tratamiento: string
    notas?: string
    citaId?: number
}) {
    try {
        const consulta = await prisma.consulta.create({
            data: {
                expedienteId: data.expedienteId,
                doctorId: data.doctorId,
                motivo: data.motivo,
                diagnostico: data.diagnostico,
                tratamiento: data.tratamiento,
                notas: data.notas,
                citaId: data.citaId
            }
        })

        revalidatePath("/pacientes")
        return { success: true, consulta }
    } catch (error) {
        console.error("Error al crear consulta:", error)
        return { success: false, error: "Error al guardar la consulta" }
    }
}
