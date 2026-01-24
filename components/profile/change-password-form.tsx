"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { changePassword } from "@/actions/user"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        const result = await changePassword(data)
        setLoading(false)

        if (result.success) {
            toast.success(result.message)
            reset()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                />
                {errors.currentPassword && (
                    <p className="text-sm text-red-500">{String(errors.currentPassword.message)}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                />
                {errors.newPassword && (
                    <p className="text-sm text-red-500">{String(errors.newPassword.message)}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{String(errors.confirmPassword.message)}</p>
                )}
            </div>

            <Button type="submit" disabled={loading} variant="destructive">
                {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </Button>
        </form>
    )
}
