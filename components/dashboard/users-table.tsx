"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateUserRole } from "@/actions/user-management"
import { toast } from "sonner"
import { Shield, User, Stethoscope, UserCog } from "lucide-react"

interface UsersTableProps {
    users: any[]
    currentUserId: string
}

const roleIcons: Record<string, any> = {
    ADMIN: <Shield className="h-3 w-3 mr-1 text-red-500" />,
    DOCTOR: <Stethoscope className="h-3 w-3 mr-1 text-blue-500" />,
    RECEPTIONIST: <UserCog className="h-3 w-3 mr-1 text-green-500" />,
    PATIENT: <User className="h-3 w-3 mr-1 text-slate-500" />,
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
    const [loading, setLoading] = useState<number | null>(null)

    const handleRoleChange = async (userId: number, newRole: any) => {
        setLoading(userId)
        const result = await updateUserRole(userId, newRole)
        setLoading(null)

        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol Actual</TableHead>
                        <TableHead className="text-right">Cambiar Rol</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{user.name}</span>
                                    {user.doctor && (
                                        <span className="text-xs text-muted-foreground italic">
                                            {user.doctor.especialidad}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="flex items-center w-fit">
                                    {roleIcons[user.role]}
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Select
                                    disabled={loading === user.id || user.id.toString() === currentUserId}
                                    defaultValue={user.role}
                                    onValueChange={(value) => handleRoleChange(user.id, value)}
                                >
                                    <SelectTrigger className="w-[180px] ml-auto">
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                                        <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
                                        <SelectItem value="PATIENT">Paciente</SelectItem>
                                    </SelectContent>
                                </Select>
                                {user.id.toString() === currentUserId && (
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        No puedes cambiar tu propio rol
                                    </p>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
