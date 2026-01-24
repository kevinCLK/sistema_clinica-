import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import { PacientesTable } from "@/components/pacientes/pacientes-table"
import { getPacientes } from "@/actions/pacientes"
import { Users } from "lucide-react"

export default async function PacientesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const pacientes = await getPacientes()

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Pacientes</h1>
                        <p className="text-muted-foreground mt-1">
                            Lista completa de pacientes registrados ({pacientes.length} pacientes)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <PacientesTable pacientes={pacientes} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
