"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { doctorSchema, type DoctorFormData } from "@/lib/validations/doctor"
import { createDoctor, updateDoctor } from "@/actions/doctores"

interface DoctorFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    doctor?: any
    onSuccess?: () => void
}

export function DoctorForm({ open, onOpenChange, doctor, onSuccess }: DoctorFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: doctor ? {
            nombres: doctor.nombres,
            apellidos: doctor.apellidos,
            telefono: doctor.telefono,
            licenciaMedica: doctor.licenciaMedica,
            especialidad: doctor.especialidad,
            email: doctor.user?.email || "",
        } : undefined,
    })

    const onSubmit = async (data: DoctorFormData) => {
        setError("")
        setLoading(true)

        try {
            const result = doctor
                ? await updateDoctor(doctor.id, data)
                : await createDoctor(data)

            if (result.success) {
                reset()
                onOpenChange(false)
                onSuccess?.()
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError("Error al procesar la solicitud")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{doctor ? "Editar Doctor" : "Nuevo Doctor"}</DialogTitle>
                    <DialogDescription>
                        {doctor ? "Actualiza la información del doctor" : "Registra un nuevo doctor en el sistema"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombres */}
                        <div className="space-y-2">
                            <Label htmlFor="nombres">Nombres *</Label>
                            <Input
                                id="nombres"
                                {...register("nombres")}
                                placeholder="Juan Carlos"
                                disabled={loading}
                            />
                            {errors.nombres && (
                                <p className="text-sm text-red-600">{errors.nombres.message}</p>
                            )}
                        </div>

                        {/* Apellidos */}
                        <div className="space-y-2">
                            <Label htmlFor="apellidos">Apellidos *</Label>
                            <Input
                                id="apellidos"
                                {...register("apellidos")}
                                placeholder="Pérez González"
                                disabled={loading}
                            />
                            {errors.apellidos && (
                                <p className="text-sm text-red-600">{errors.apellidos.message}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono *</Label>
                            <Input
                                id="telefono"
                                {...register("telefono")}
                                placeholder="70123456"
                                disabled={loading}
                            />
                            {errors.telefono && (
                                <p className="text-sm text-red-600">{errors.telefono.message}</p>
                            )}
                        </div>

                        {/* Licencia Médica */}
                        <div className="space-y-2">
                            <Label htmlFor="licenciaMedica">Licencia Médica *</Label>
                            <Input
                                id="licenciaMedica"
                                {...register("licenciaMedica")}
                                placeholder="LM-12345"
                                disabled={loading}
                            />
                            {errors.licenciaMedica && (
                                <p className="text-sm text-red-600">{errors.licenciaMedica.message}</p>
                            )}
                        </div>

                        {/* Especialidad */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="especialidad">Especialidad *</Label>
                            <Input
                                id="especialidad"
                                {...register("especialidad")}
                                placeholder="Cardiología, Pediatría, etc."
                                disabled={loading}
                            />
                            {errors.especialidad && (
                                <p className="text-sm text-red-600">{errors.especialidad.message}</p>
                            )}
                        </div>

                        {/* Email (solo para crear) */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Email {doctor ? "(no editable)" : "*"}</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="doctor@clinica.com"
                                disabled={loading || !!doctor}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                            {!doctor && (
                                <p className="text-xs text-gray-500">
                                    Se creará un usuario con contraseña por defecto: "doctor123"
                                </p>
                            )}
                        </div>

                        {/* Contraseña (solo para crear) */}
                        {!doctor && (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="password">Contraseña (opcional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    placeholder="Dejar vacío para usar 'doctor123'"
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : doctor ? "Actualizar" : "Registrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
