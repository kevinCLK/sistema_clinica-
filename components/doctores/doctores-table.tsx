"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DoctorForm } from "./doctor-form"
import { deleteDoctor } from "@/actions/doctores"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import { FileDown, FileText } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DoctoresTableProps {
    doctores: any[]
}

export function DoctoresTable({ doctores }: DoctoresTableProps) {
    const router = useRouter()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const handleEdit = (doctor: any) => {
        setSelectedDoctor(doctor)
        setFormOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar este doctor? También se eliminará su usuario del sistema.")) return

        setDeleting(id)
        const result = await deleteDoctor(id)
        setDeleting(null)

        if (result.success) {
            toast.success("Doctor eliminado exitosamente")
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    const handleNew = () => {
        setSelectedDoctor(null)
        setFormOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    // Filtrado y búsqueda
    const filteredDoctores = useMemo(() => {
        return doctores.filter((doctor) => {
            const search = searchTerm.toLowerCase()
            return (
                doctor.nombres.toLowerCase().includes(search) ||
                doctor.apellidos.toLowerCase().includes(search) ||
                doctor.especialidad.toLowerCase().includes(search) ||
                doctor.licenciaMedica.toLowerCase().includes(search) ||
                doctor.user?.email.toLowerCase().includes(search)
            )
        })
    }, [doctores, searchTerm])

    // Paginación
    const totalPages = Math.ceil(filteredDoctores.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentDoctores = filteredDoctores.slice(startIndex, endIndex)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleExportExcel = () => {
        const columns = [
            { header: "ID", key: "id" },
            { header: "Nombres", key: "nombres" },
            { header: "Apellidos", key: "apellidos" },
            { header: "Especialidad", key: "especialidad" },
            { header: "Licencia Médica", key: "licenciaMedica" },
            { header: "Teléfono", key: "telefono" },
            { header: "Email", key: "user.email" },
        ]
        exportToExcel(filteredDoctores, columns, "Doctores_Clinica")
    }

    const handleExportPDF = () => {
        const columns = [
            { header: "Nombre", key: "nombres" },
            { header: "Apellido", key: "apellidos" },
            { header: "Especialidad", key: "especialidad" },
            { header: "Licencia", key: "licenciaMedica" },
            { header: "Email", key: "user.email" },
        ]
        exportToPDF(filteredDoctores, columns, "Reporte de Doctores", "Reporte_Doctores")
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, especialidad o licencia..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full md:w-96"
                    />
                    {searchTerm && (
                        <Button variant="ghost" size="sm" onClick={() => handleSearch("")}>
                            Limpiar
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4" />
                                Exportar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleExportExcel}>
                                <FileText className="mr-2 h-4 w-4" />
                                Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPDF}>
                                <FileText className="mr-2 h-4 w-4" />
                                PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handleNew}>
                        + Nuevo Doctor
                    </Button>
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
                Mostrando {currentDoctores.length} de {filteredDoctores.length} doctores
                {searchTerm && ` (filtrado de ${doctores.length} total)`}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Nombre Completo</TableHead>
                            <TableHead>Especialidad</TableHead>
                            <TableHead>Licencia Médica</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentDoctores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    {searchTerm ? "No se encontraron resultados" : "No hay doctores registrados. Haz clic en 'Nuevo Doctor' para agregar uno."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentDoctores.map((doctor, index) => (
                                <TableRow key={doctor.id}>
                                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">Dr. {doctor.nombres} {doctor.apellidos}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {doctor.especialidad}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{doctor.licenciaMedica}</TableCell>
                                    <TableCell>{doctor.telefono}</TableCell>
                                    <TableCell className="text-sm">{doctor.user?.email}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(doctor)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(doctor.id)}
                                                disabled={deleting === doctor.id}
                                            >
                                                {deleting === doctor.id ? "Eliminando..." : "Eliminar"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

            <DoctorForm
                open={formOpen}
                onOpenChange={setFormOpen}
                doctor={selectedDoctor}
                onSuccess={handleSuccess}
            />
        </>
    )
}
