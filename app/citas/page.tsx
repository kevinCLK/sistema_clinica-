import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import { CitasPageClient } from "@/components/citas/citas-page-client"
import { getCitas } from "@/app/actions/citas"
import { Calendar } from "lucide-react"

export default async function CitasPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const citas = await getCitas()

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Citas</h1>
                        <p className="text-muted-foreground mt-1">
                            Agenda y administra las citas médicas ({citas.length} citas)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <CitasPageClient citas={citas} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
