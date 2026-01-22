import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import prisma from "@/lib/prisma"
import { getAppointmentsByMonth, getPatientsByBloodGroup, getConsultationsBySpecialty } from "@/app/actions/stats"
import { AppointmentsChart } from "@/components/dashboard/charts/appointments-chart"
import { PatientsPieChart } from "@/components/dashboard/charts/patients-pie-chart"
import { SpecialtyBarChart } from "@/components/dashboard/charts/specialty-bar-chart"
import { Users, Stethoscope, Calendar, Building2, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    // Obtener estadísticas reales de la base de datos
    const [
        pacientesCount,
        doctoresCount,
        consultoriosCount,
        citasCount,
        appointmentsData,
        patientsBloodData,
        specialtyData
    ] = await Promise.all([
        prisma.paciente.count(),
        prisma.doctor.count(),
        prisma.consultorio.count(),
        prisma.cita.count(),
        getAppointmentsByMonth(),
        getPatientsByBloodGroup(),
        getConsultationsBySpecialty()
    ])

    // Obtener citas de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const citasHoy = await prisma.cita.count({
        where: {
            inicio: {
                gte: today,
                lt: tomorrow
            }
        }
    })

    return (
        <AppLayout user={session.user}>
            <div className="space-y-8">
                {/* Header de la página */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Bienvenido, {session.user.name || session.user.email}</p>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Pacientes
                            </CardTitle>
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{pacientesCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pacientes registrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Doctores
                            </CardTitle>
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{doctoresCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Doctores activos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Citas del Día
                            </CardTitle>
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{citasHoy}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Programadas hoy
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Consultorios
                            </CardTitle>
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{consultoriosCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total disponibles
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos de Análisis */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Análisis y Estadísticas</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AppointmentsChart data={appointmentsData} />
                        <PatientsPieChart data={patientsBloodData} />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <SpecialtyBarChart data={specialtyData} />
                    </div>
                </div>

                {/* Información del Sistema */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen General</CardTitle>
                            <CardDescription>
                                Estadísticas del sistema médico
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Total de Citas Registradas:</span>
                                    <span className="font-semibold text-foreground">{citasCount}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Pacientes por Doctor:</span>
                                    <span className="font-semibold text-foreground">
                                        {doctoresCount > 0 ? Math.round(pacientesCount / doctoresCount) : 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-border">
                                    <span className="text-sm text-muted-foreground">Usuario:</span>
                                    <span className="font-medium text-foreground">{session.user.name || session.user.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>
                                Accesos directos a funciones principales
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/pacientes">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Users className="h-4 w-4" />
                                        Pacientes
                                    </Button>
                                </Link>
                                <Link href="/doctores">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Stethoscope className="h-4 w-4" />
                                        Doctores
                                    </Button>
                                </Link>
                                <Link href="/citas">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Citas
                                    </Button>
                                </Link>
                                <Link href="/consultorios">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Consultorios
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
