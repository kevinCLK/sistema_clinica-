import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getPaciente } from "@/actions/pacientes"
import { getExpedienteByPacienteId } from "@/actions/expediente"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    FileText,
    User,
    Calendar,
    Plus,
    Activity,
    ClipboardList,
    Stethoscope,
    Info
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ConsultaForm } from "@/components/pacientes/consulta-form"
import prisma from "@/lib/prisma"

interface PacientePageProps {
    params: Promise<{ id: string }>
}

export default async function PacienteDetailPage({ params }: PacientePageProps) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const { id } = await params
    const pacienteId = parseInt(id)

    const [paciente, expediente] = await Promise.all([
        getPaciente(pacienteId),
        getExpedienteByPacienteId(pacienteId)
    ])

    if (!paciente) notFound()

    // Si es doctor, obtener su ID de doctor
    let doctorId: number | null = null
    if (session.user.role === "DOCTOR") {
        const doctorData = await prisma.doctor.findUnique({
            where: { userId: parseInt(session.user.id) }
        })
        doctorId = doctorData?.id || null
    }

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header con Perfil */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {paciente.nombre} {paciente.apellidos}
                                </h1>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    {expediente?.numero}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span className="font-medium">CI:</span> {paciente.ci} |
                                <span className="font-medium ml-2">Edad:</span> {paciente.fechaNacimiento}
                            </p>
                        </div>
                    </div>

                    {session.user.role === "DOCTOR" && doctorId && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                                    <Plus className="h-4 w-4" />
                                    Nueva Consulta
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Nueva Consulta Médica</DialogTitle>
                                    <DialogDescription>
                                        Registra el diagnóstico y tratamiento para {paciente.nombre}.
                                    </DialogDescription>
                                </DialogHeader>
                                <ConsultaForm
                                    expedienteId={expediente!.id}
                                    doctorId={doctorId}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Tabs defaultValue="historial" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="historial" className="gap-2">
                            <ClipboardList className="h-4 w-4" />
                            Historial Clínico
                        </TabsTrigger>
                        <TabsTrigger value="info" className="gap-2">
                            <Info className="h-4 w-4" />
                            Información General
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="historial" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Resumen rápido lateral */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-red-500" />
                                            Alertas Médicas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Alergias:</p>
                                            <p className="text-sm text-foreground">{paciente.alergias}</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Grupo Sanguíneo:</p>
                                            <p className="text-sm text-foreground">{paciente.grupoSanguineo}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Próximas Citas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No hay citas programadas recientemente.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Timeline de Consultas */}
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                                    <Stethoscope className="h-5 w-5 text-primary" />
                                    Cronología de Atenciones
                                </h2>

                                {expediente?.consultas.length === 0 ? (
                                    <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-lg font-medium">No hay registros aún</p>
                                        <p className="text-sm text-muted-foreground">
                                            Cuando un doctor realice una consulta, aparecerá aquí.
                                        </p>
                                    </Card>
                                ) : (
                                    <div className="space-y-6">
                                        {expediente?.consultas.map((consulta) => (
                                            <Card key={consulta.id} className="relative overflow-hidden group hover:border-primary/30 transition-colors">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg text-primary">
                                                                {consulta.motivo}
                                                            </CardTitle>
                                                            <CardDescription className="flex items-center gap-2">
                                                                <Calendar className="h-3 w-3" />
                                                                {format(new Date(consulta.fecha), "PPP", { locale: es })}
                                                            </CardDescription>
                                                        </div>
                                                        <Badge variant="secondary">
                                                            Dr. {consulta.doctor.apellidos}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <Separator className="bg-border/50" />
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground/80 mb-1">Diagnóstico:</p>
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{consulta.diagnostico}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground/80 mb-1">Tratamiento:</p>
                                                        <p className="text-sm p-3 bg-primary/5 rounded-md border border-primary/10 italic">
                                                            {consulta.tratamiento}
                                                        </p>
                                                    </div>
                                                    {consulta.notas && (
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground/80 mb-1">Observaciones:</p>
                                                            <p className="text-xs text-muted-foreground">{consulta.notas}</p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="info" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Contacto y Detalles</CardTitle>
                                <CardDescription>Datos personales registrados en el sistema.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Correo:</p>
                                        <p className="text-base">{paciente.correo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Celular:</p>
                                        <p className="text-base">{paciente.celular}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Dirección:</p>
                                        <p className="text-base">{paciente.direccion}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Contacto de Emergencia:</p>
                                        <p className="text-base">{paciente.contactoEmergencia}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</p>
                                        <p className="text-base">{paciente.fechaNacimiento}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Género:</p>
                                        <p className="text-base">{paciente.genero}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
