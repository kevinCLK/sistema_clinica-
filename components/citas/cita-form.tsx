"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { citaSchema, type CitaFormData } from "@/lib/validations/cita"
import { createCita, updateCita, getPacientesForCitas } from "@/app/actions/citas"
import { getDoctores } from "@/app/actions/doctores"
import { getConsultorios } from "@/app/actions/consultorios"

interface CitaFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cita?: any
    selectedSlot?: { start: Date; end: Date } | null
    onSuccess?: () => void
}

export function CitaForm({ open, onOpenChange, cita, selectedSlot, onSuccess }: CitaFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pacientes, setPacientes] = useState<any[]>([])
    const [doctores, setDoctores] = useState<any[]>([])
    const [consultorios, setConsultorios] = useState<any[]>([])

    // Función para formatear fecha a formato datetime-local
    const formatDateTimeLocal = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CitaFormData>({
        resolver: zodResolver(citaSchema),
        defaultValues: cita ? {
            titulo: cita.titulo,
            inicio: cita.inicio,
            final: cita.final,
            color: cita.color || "#3b82f6",
            userId: cita.userId,
            doctorId: cita.doctorId,
            consultorioId: cita.consultorioId,
        } : {
            color: "#3b82f6",
        },
    })

    useEffect(() => {
        if (open) {
            loadData()
            // Si hay un slot seleccionado, pre-llenar las fechas
            if (selectedSlot && !cita) {
                setValue("inicio", formatDateTimeLocal(selectedSlot.start))
                setValue("final", formatDateTimeLocal(selectedSlot.end))
            }
        }
    }, [open, selectedSlot, cita, setValue])

    const loadData = async () => {
        const [pacientesData, doctoresData, consultoriosData] = await Promise.all([
            getPacientesForCitas(),
            getDoctores(),
            getConsultorios(),
        ])
        setPacientes(pacientesData)
        setDoctores(doctoresData)
        setConsultorios(consultoriosData)
    }

    const onSubmit = async (data: CitaFormData) => {
        setError("")
        setLoading(true)

        try {
            const result = cita
                ? await updateCita(cita.id, data)
                : await createCita(data)

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
                    <DialogTitle>{cita ? "Editar Cita" : "Nueva Cita"}</DialogTitle>
                    <DialogDescription>
                        {cita ? "Actualiza la información de la cita" : "Programa una nueva cita médica"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="titulo">Título *</Label>
                            <Input
                                id="titulo"
                                {...register("titulo")}
                                placeholder="Consulta General, Revisión, etc."
                                disabled={loading}
                            />
                            {errors.titulo && (
                                <p className="text-sm text-red-600">{errors.titulo.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userId">Paciente *</Label>
                            <Select
                                value={watch("userId")?.toString()}
                                onValueChange={(value) => setValue("userId", parseInt(value))}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pacientes.map((paciente) => (
                                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                            {paciente.name} ({paciente.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.userId && (
                                <p className="text-sm text-red-600">{errors.userId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="doctorId">Doctor *</Label>
                            <Select
                                value={watch("doctorId")?.toString()}
                                onValueChange={(value) => setValue("doctorId", parseInt(value))}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctores.map((doctor) => (
                                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                            Dr. {doctor.nombres} {doctor.apellidos} - {doctor.especialidad}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.doctorId && (
                                <p className="text-sm text-red-600">{errors.doctorId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="consultorioId">Consultorio *</Label>
                            <Select
                                value={watch("consultorioId")?.toString()}
                                onValueChange={(value) => setValue("consultorioId", parseInt(value))}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione consultorio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {consultorios.map((consultorio) => (
                                        <SelectItem key={consultorio.id} value={consultorio.id.toString()}>
                                            {consultorio.nombre} - {consultorio.ubicacion}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.consultorioId && (
                                <p className="text-sm text-red-600">{errors.consultorioId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                type="color"
                                {...register("color")}
                                disabled={loading}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inicio">Fecha y Hora de Inicio *</Label>
                            <Input
                                id="inicio"
                                type="datetime-local"
                                {...register("inicio")}
                                disabled={loading}
                            />
                            {errors.inicio && (
                                <p className="text-sm text-red-600">{errors.inicio.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="final">Fecha y Hora de Fin *</Label>
                            <Input
                                id="final"
                                type="datetime-local"
                                {...register("final")}
                                disabled={loading}
                            />
                            {errors.final && (
                                <p className="text-sm text-red-600">{errors.final.message}</p>
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
                            {loading ? "Guardando..." : cita ? "Actualizar" : "Agendar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
