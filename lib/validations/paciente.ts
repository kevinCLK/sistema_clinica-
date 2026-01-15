import { z } from "zod"

export const pacienteSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
    ci: z.string().min(5, "El CI debe tener al menos 5 caracteres"),
    numSeguro: z.string().min(5, "El número de seguro debe tener al menos 5 caracteres").optional().or(z.literal("")),
    fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
    genero: z.enum(["Masculino", "Femenino", "Otro"], {
        required_error: "Seleccione un género",
    }),
    celular: z.string().min(7, "El celular debe tener al menos 7 dígitos"),
    correo: z.string().email("Email inválido"),
    direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    grupoSanguineo: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        required_error: "Seleccione un grupo sanguíneo",
    }),
    alergias: z.string().optional().or(z.literal("")),
    contactoEmergencia: z.string().min(5, "El contacto de emergencia es requerido"),
    observaciones: z.string().optional().or(z.literal("")),
})

export type PacienteFormData = z.infer<typeof pacienteSchema>
