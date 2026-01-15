import { z } from "zod"

export const consultorioSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    ubicacion: z.string().min(3, "La ubicación es requerida"),
    capacidad: z.string().min(1, "La capacidad es requerida"),
    telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos").optional().or(z.literal("")),
    especialidad: z.string().min(3, "La especialidad es requerida"),
    estado: z.enum(["Disponible", "Ocupado", "Mantenimiento"], {
        required_error: "Seleccione un estado",
    }),
})

export type ConsultorioFormData = z.infer<typeof consultorioSchema>
