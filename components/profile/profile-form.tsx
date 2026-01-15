"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateProfile } from "@/app/actions/user"
import { useRouter } from "next/navigation"

const profileSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    image: z.string().optional(),
})

interface ProfileFormProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
        },
    })

    // Simulación de subida de imagen (en un caso real usaríamos S3, Cloudinary o similar)
    // Aquí solo permitimos pegar una URL

    const onSubmit = async (data: any) => {
        setLoading(true)
        const result = await updateProfile(data)
        setLoading(false)

        if (result.success) {
            toast.success(result.message)
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                    <p className="text-sm text-red-500">{String(errors.name.message)}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email (No editable)</Label>
                <Input id="email" {...register("email")} disabled className="bg-gray-100 dark:bg-gray-800" />
                <p className="text-xs text-gray-500">
                    Para cambiar tu email, contacta al administrador.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">URL de Avatar (Opcional)</Label>
                <Input id="image" {...register("image")} placeholder="https://example.com/avatar.jpg" />
                <p className="text-xs text-gray-500">
                    Pega una URL de imagen para tu perfil.
                </p>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </form>
    )
}
