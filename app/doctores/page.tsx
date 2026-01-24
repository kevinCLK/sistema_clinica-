import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import { DoctoresTable } from "@/components/doctores/doctores-table"
import { getDoctores } from "@/actions/doctores"
import { Stethoscope } from "lucide-react"

export default async function DoctoresPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const doctores = await getDoctores()

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Doctores</h1>
                        <p className="text-muted-foreground mt-1">
                            Lista completa de doctores registrados ({doctores.length} doctores)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <DoctoresTable doctores={doctores} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
