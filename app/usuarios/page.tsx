import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers } from "@/actions/user-management"
import { AppLayout } from "@/components/layout/app-layout"
import { UsersTable } from "@/components/dashboard/users-table"
import { ShieldAlert, UserCog } from "lucide-react"

export default async function UsuariosPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const users = await getUsers()

    return (
        <AppLayout user={session.user}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <UserCog className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Control de Usuarios y Roles
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona quién tiene acceso a qué módulos ({users.length} usuarios registrados)
                        </p>
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-400">
                        <p className="font-bold">Advertencia de Seguridad</p>
                        <p>Cambiar los roles de los usuarios afecta inmediatamente su acceso al sistema. Asegúrate de asignar los privilegios correctos a cada persona.</p>
                    </div>
                </div>

                <UsersTable users={users} currentUserId={session.user.id} />
            </div>
        </AppLayout>
    )
}
