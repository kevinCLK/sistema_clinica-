"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getAppointmentsByMonth() {
    const session = await getServerSession(authOptions)
    if (!session) return []

    const { id, role } = session.user
    let whereClause = {}

    if (role === "DOCTOR") {
        whereClause = { doctor: { userId: parseInt(id) } }
    }

    const citas = await prisma.cita.findMany({
        where: whereClause,
        select: {
            inicio: true
        }
    })

    const citasPorMes = citas.reduce((acc, cita) => {
        const fecha = new Date(cita.inicio)
        const mes = fecha.toLocaleString('es-ES', { month: 'long' })
        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1)

        acc[mesCapitalizado] = (acc[mesCapitalizado] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const mesesOrden = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    return mesesOrden.map(mes => ({
        name: mes,
        citas: citasPorMes[mes] || 0
    })).filter(item => item.citas > 0)
}

export async function getPatientsByBloodGroup() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === "PATIENT") return []

    // Nota: El filtrado de pacientes por doctor requiere una relación directa 
    // pero aquí consultamos todos por grupo sanguíneo si es admin o doctor
    const result = await prisma.paciente.groupBy({
        by: ['grupoSanguineo'],
        _count: {
            grupoSanguineo: true
        }
    })

    return result.map(item => ({
        name: item.grupoSanguineo,
        value: item._count.grupoSanguineo
    }))
}

export async function getConsultationsBySpecialty() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") return []

    const doctores = await prisma.doctor.findMany({
        select: {
            especialidad: true,
            _count: {
                select: { citas: true }
            }
        }
    })

    const especialidades = doctores.reduce((acc, doctor) => {
        acc[doctor.especialidad] = (acc[doctor.especialidad] || 0) + doctor._count.citas
        return acc
    }, {} as Record<string, number>)

    return Object.entries(especialidades).map(([name, consultas]) => ({
        name,
        consultas
    }))
}
