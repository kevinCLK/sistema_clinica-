"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { pacienteSchema, type PacienteFormData } from "@/lib/validations/paciente"
import { createPaciente, updatePaciente } from "@/actions/pacientes"
import { toast } from "sonner"

interface PacienteFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    paciente?: any
    onSuccess?: () => void
}

export function PacienteForm({ open, onOpenChange, paciente, onSuccess }: PacienteFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<PacienteFormData>({
        resolver: zodResolver(pacienteSchema),
        defaultValues: paciente ? {
            nombre: paciente.nombre,
            apellidos: paciente.apellidos,
            ci: paciente.ci,
            numSeguro: paciente.numSeguro || "",
            fechaNacimiento: paciente.fechaNacimiento,
            genero: paciente.genero,
            celular: paciente.celular,
            correo: paciente.correo,
            direccion: paciente.direccion,
            grupoSanguineo: paciente.grupoSanguineo,
            alergias: paciente.alergias || "",
            contactoEmergencia: paciente.contactoEmergencia,
            observaciones: paciente.observaciones || "",
        } : undefined,
    })

    const onSubmit = async (data: PacienteFormData) => {
        setError("")
        setLoading(true)

        try {
            const result = paciente
                ? await updatePaciente(paciente.id, data)
                : await createPaciente(data)

            if (result.success) {
                toast.success(result.message)
                reset()
                onOpenChange(false)
                onSuccess?.()
            } else {
                setError(result.message)
                toast.error(result.message)
            }
        } catch (err) {
            const errorMsg = "Error al procesar la solicitud"
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{paciente ? "Editar Paciente" : "Nuevo Paciente"}</DialogTitle>
                    <DialogDescription>
                        {paciente ? "Actualiza la información del paciente" : "Registra un nuevo paciente en el sistema"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input
                                id="nombre"
                                {...register("nombre")}
                                placeholder="Juan"
                                disabled={loading}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600">{errors.nombre.message}</p>
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

                        {/* CI */}
                        <div className="space-y-2">
                            <Label htmlFor="ci">CI *</Label>
                            <Input
                                id="ci"
                                {...register("ci")}
                                placeholder="12345678"
                                disabled={loading}
                            />
                            {errors.ci && (
                                <p className="text-sm text-red-600">{errors.ci.message}</p>
                            )}
                        </div>

                        {/* Número de Seguro */}
                        <div className="space-y-2">
                            <Label htmlFor="numSeguro">Número de Seguro</Label>
                            <Input
                                id="numSeguro"
                                {...register("numSeguro")}
                                placeholder="NS-12345"
                                disabled={loading}
                            />
                            {errors.numSeguro && (
                                <p className="text-sm text-red-600">{errors.numSeguro.message}</p>
                            )}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="space-y-2">
                            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                            <Input
                                id="fechaNacimiento"
                                type="date"
                                {...register("fechaNacimiento")}
                                disabled={loading}
                            />
                            {errors.fechaNacimiento && (
                                <p className="text-sm text-red-600">{errors.fechaNacimiento.message}</p>
                            )}
                        </div>

                        {/* Género */}
                        <div className="space-y-2">
                            <Label htmlFor="genero">Género *</Label>
                            <Select
                                value={watch("genero")}
                                onValueChange={(value) => setValue("genero", value as any)}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione género" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                    <SelectItem value="Femenino">Femenino</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.genero && (
                                <p className="text-sm text-red-600">{errors.genero.message}</p>
                            )}
                        </div>

                        {/* Celular */}
                        <div className="space-y-2">
                            <Label htmlFor="celular">Celular *</Label>
                            <Input
                                id="celular"
                                {...register("celular")}
                                placeholder="70123456"
                                disabled={loading}
                            />
                            {errors.celular && (
                                <p className="text-sm text-red-600">{errors.celular.message}</p>
                            )}
                        </div>

                        {/* Correo */}
                        <div className="space-y-2">
                            <Label htmlFor="correo">Correo Electrónico *</Label>
                            <Input
                                id="correo"
                                type="email"
                                {...register("correo")}
                                placeholder="correo@ejemplo.com"
                                disabled={loading}
                            />
                            {errors.correo && (
                                <p className="text-sm text-red-600">{errors.correo.message}</p>
                            )}
                        </div>

                        {/* Grupo Sanguíneo */}
                        <div className="space-y-2">
                            <Label htmlFor="grupoSanguineo">Grupo Sanguíneo *</Label>
                            <Select
                                value={watch("grupoSanguineo")}
                                onValueChange={(value) => setValue("grupoSanguineo", value as any)}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.grupoSanguineo && (
                                <p className="text-sm text-red-600">{errors.grupoSanguineo.message}</p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="direccion">Dirección *</Label>
                            <Input
                                id="direccion"
                                {...register("direccion")}
                                placeholder="Av. Principal #123"
                                disabled={loading}
                            />
                            {errors.direccion && (
                                <p className="text-sm text-red-600">{errors.direccion.message}</p>
                            )}
                        </div>

                        {/* Contacto de Emergencia */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="contactoEmergencia">Contacto de Emergencia *</Label>
                            <Input
                                id="contactoEmergencia"
                                {...register("contactoEmergencia")}
                                placeholder="Nombre y número: María Pérez - 75123456"
                                disabled={loading}
                            />
                            {errors.contactoEmergencia && (
                                <p className="text-sm text-red-600">{errors.contactoEmergencia.message}</p>
                            )}
                        </div>

                        {/* Alergias */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="alergias">Alergias</Label>
                            <Textarea
                                id="alergias"
                                {...register("alergias")}
                                placeholder="Penicilina, polen, etc."
                                disabled={loading}
                                rows={2}
                            />
                            {errors.alergias && (
                                <p className="text-sm text-red-600">{errors.alergias.message}</p>
                            )}
                        </div>

                        {/* Observaciones */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="observaciones">Observaciones</Label>
                            <Textarea
                                id="observaciones"
                                {...register("observaciones")}
                                placeholder="Información adicional relevante"
                                disabled={loading}
                                rows={3}
                            />
                            {errors.observaciones && (
                                <p className="text-sm text-red-600">{errors.observaciones.message}</p>
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
                            {loading ? "Guardando..." : paciente ? "Actualizar" : "Registrar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
