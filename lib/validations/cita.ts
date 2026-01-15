import { z } from "zod"

export const citaSchema = z.object({
    titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    inicio: z.string().min(1, "La fecha y hora de inicio es requerida"),
    final: z.string().min(1, "La fecha y hora de fin es requerida"),
    color: z.string().default("#3b82f6"),
    userId: z.number().min(1, "Seleccione un paciente"),
    doctorId: z.number().min(1, "Seleccione un doctor"),
    consultorioId: z.number().min(1, "Seleccione un consultorio"),
}).refine((data) => {
    const inicio = new Date(data.inicio)
    const final = new Date(data.final)
    return final > inicio
}, {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["final"],
})

export type CitaFormData = z.infer<typeof citaSchema>
