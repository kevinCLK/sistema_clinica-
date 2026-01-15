import { z } from "zod"

export const doctorSchema = z.object({
    nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
    telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
    licenciaMedica: z.string().min(3, "La licencia médica es requerida"),
    especialidad: z.string().min(3, "La especialidad es requerida"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
})

export type DoctorFormData = z.infer<typeof doctorSchema>
