import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/app-layout"
import { ConsultoriosTable } from "@/components/consultorios/consultorios-table"
import { getConsultorios } from "@/app/actions/consultorios"
import { Building2 } from "lucide-react"

export default async function ConsultoriosPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const consultorios = await getConsultorios()

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Consultorios</h1>
                        <p className="text-muted-foreground mt-1">
                            Lista completa de consultorios ({consultorios.length} consultorios)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <ConsultoriosTable consultorios={consultorios} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
