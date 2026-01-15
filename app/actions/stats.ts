"use server"

import prisma from "@/lib/prisma"

export async function getAppointmentsByMonth() {
    // Obtenemos todas las citas (solo la fecha de inicio)
    const citas = await prisma.cita.findMany({
        select: {
            inicio: true
        }
    })

    // Agrupamos por mes
    const citasPorMes = citas.reduce((acc, cita) => {
        const fecha = new Date(cita.inicio)
        const mes = fecha.toLocaleString('es-ES', { month: 'long' })
        // Capitalizar primera letra
        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1)

        acc[mesCapitalizado] = (acc[mesCapitalizado] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Convertimos a array para Recharts
    // Ordenamos los meses cronológicamente si es necesario, 
    // pero por ahora devolvemos el objeto mapeado
    // Para simplificar, usamos un array fijo de meses para mantener el orden
    const mesesOrden = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    return mesesOrden.map(mes => ({
        name: mes,
        citas: citasPorMes[mes] || 0
    })).filter(item => item.citas > 0) // Opcional: filtrar meses sin citas o mostrar todos
}

export async function getPatientsByBloodGroup() {
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
    // Obtenemos doctores con su recuento de citas, y su especialidad
    const doctores = await prisma.doctor.findMany({
        select: {
            especialidad: true,
            _count: {
                select: { citas: true }
            }
        }
    })

    // Agrupamos por especialidad
    const especialidades = doctores.reduce((acc, doctor) => {
        acc[doctor.especialidad] = (acc[doctor.especialidad] || 0) + doctor._count.citas
        return acc
    }, {} as Record<string, number>)

    return Object.entries(especialidades).map(([name, consultas]) => ({
        name,
        consultas
    }))
}
