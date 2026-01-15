"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { consultorioSchema, type ConsultorioFormData } from "@/lib/validations/consultorio"
import { createConsultorio, updateConsultorio } from "@/app/actions/consultorios"

interface ConsultorioFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    consultorio?: any
    onSuccess?: () => void
}

export function ConsultorioForm({ open, onOpenChange, consultorio, onSuccess }: ConsultorioFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ConsultorioFormData>({
        resolver: zodResolver(consultorioSchema),
        defaultValues: consultorio ? {
            nombre: consultorio.nombre,
            ubicacion: consultorio.ubicacion,
            capacidad: consultorio.capacidad,
            telefono: consultorio.telefono || "",
            especialidad: consultorio.especialidad,
            estado: consultorio.estado,
        } : undefined,
    })

    const onSubmit = async (data: ConsultorioFormData) => {
        setError("")
        setLoading(true)

        try {
            const result = consultorio
                ? await updateConsultorio(consultorio.id, data)
                : await createConsultorio(data)

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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{consultorio ? "Editar Consultorio" : "Nuevo Consultorio"}</DialogTitle>
                    <DialogDescription>
                        {consultorio ? "Actualiza la información del consultorio" : "Registra un nuevo consultorio"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input
                                id="nombre"
                                {...register("nombre")}
                                placeholder="Consultorio 1"
                                disabled={loading}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ubicacion">Ubicación *</Label>
                            <Input
                                id="ubicacion"
                                {...register("ubicacion")}
                                placeholder="Piso 2, Ala Norte"
                                disabled={loading}
                            />
                            {errors.ubicacion && (
                                <p className="text-sm text-red-600">{errors.ubicacion.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacidad">Capacidad *</Label>
                            <Input
                                id="capacidad"
                                {...register("capacidad")}
                                placeholder="4 personas"
                                disabled={loading}
                            />
                            {errors.capacidad && (
                                <p className="text-sm text-red-600">{errors.capacidad.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="especialidad">Especialidad *</Label>
                            <Input
                                id="especialidad"
                                {...register("especialidad")}
                                placeholder="Cardiología, General, etc."
                                disabled={loading}
                            />
                            {errors.especialidad && (
                                <p className="text-sm text-red-600">{errors.especialidad.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado *</Label>
                            <Select
                                value={watch("estado")}
                                onValueChange={(value) => setValue("estado", value as any)}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Disponible">Disponible</SelectItem>
                                    <SelectItem value="Ocupado">Ocupado</SelectItem>
                                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.estado && (
                                <p className="text-sm text-red-600">{errors.estado.message}</p>
                            )}
                        </div>
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
                            {loading ? "Guardando..." : consultorio ? "Actualizar" : "Registrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
