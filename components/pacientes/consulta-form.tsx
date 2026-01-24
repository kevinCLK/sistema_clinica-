"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { createConsulta } from "@/actions/expediente"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    motivo: z.string().min(1, "El motivo es requerido"),
    diagnostico: z.string().min(1, "El diagnóstico es requerido"),
    tratamiento: z.string().min(1, "El tratamiento es requerido"),
    notas: z.string().optional(),
})

interface ConsultaFormProps {
    expedienteId: number
    doctorId: number
    onSuccess?: () => void
}

export function ConsultaForm({ expedienteId, doctorId, onSuccess }: ConsultaFormProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            motivo: "",
            diagnostico: "",
            tratamiento: "",
            notas: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const result = await createConsulta({
                expedienteId,
                doctorId,
                ...values,
            })

            if (result.success) {
                toast.success("Consulta guardada exitosamente")
                form.reset()
                onSuccess?.()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="motivo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Motivo de Consulta</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ej: Dolor de cabeza persistente..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="diagnostico"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Diagnóstico</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ej: Migraña tensional..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tratamiento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tratamiento / Receta</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ej: Paracetamol 500mg cada 8 horas..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notas"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Ej: Reposo por 24 horas..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar Consulta"
                    )}
                </Button>
            </form>
        </Form>
    )
}
