"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CitaForm } from "./cita-form"
import { deleteCita } from "@/actions/citas"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import { FileDown, FileText } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CitasTableProps {
    citas: any[]
}

export function CitasTable({ citas }: CitasTableProps) {
    const router = useRouter()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedCita, setSelectedCita] = useState<any>(null)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const handleEdit = (cita: any) => {
        setSelectedCita(cita)
        setFormOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar esta cita?")) return

        setDeleting(id)
        const result = await deleteCita(id)
        setDeleting(null)

        if (result.success) {
            toast.success("Cita eliminada exitosamente")
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    const handleNew = () => {
        setSelectedCita(null)
        setFormOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    // Filtrado y búsqueda
    const filteredCitas = useMemo(() => {
        return citas.filter((cita) => {
            const search = searchTerm.toLowerCase()
            return (
                cita.titulo.toLowerCase().includes(search) ||
                cita.user?.name.toLowerCase().includes(search) ||
                cita.doctor?.nombres.toLowerCase().includes(search) ||
                cita.doctor?.apellidos.toLowerCase().includes(search) ||
                cita.consultorio?.nombre.toLowerCase().includes(search)
            )
        })
    }, [citas, searchTerm])

    // Paginación
    const totalPages = Math.ceil(filteredCitas.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCitas = filteredCitas.slice(startIndex, endIndex)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleExportExcel = () => {
        const columns = [
            { header: "ID", key: "id" },
            { header: "Título", key: "titulo" },
            { header: "Paciente", key: "user.name" },
            { header: "Doctor Nombre", key: "doctor.nombres" },
            { header: "Doctor Apellido", key: "doctor.apellidos" },
            { header: "Consultorio", key: "consultorio.nombre" },
            { header: "Inicio", key: "inicio" },
            { header: "Final", key: "final" },
        ]
        exportToExcel(filteredCitas, columns, "Citas_Clinica")
    }

    const handleExportPDF = () => {
        const columns = [
            { header: "Título", key: "titulo" },
            { header: "Paciente", key: "user.name" },
            { header: "Doctor", key: "doctor.nombres" },
            { header: "Consultorio", key: "consultorio.nombre" },
            { header: "Inicio", key: "inicio" },
        ]
        exportToPDF(filteredCitas, columns, "Reporte de Citas", "Reporte_Citas")
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por título, paciente o doctor..."
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
                        + Nueva Cita
                    </Button>
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
                Mostrando {currentCitas.length} de {filteredCitas.length} citas
                {searchTerm && ` (filtrado de ${citas.length} total)`}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Consultorio</TableHead>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Duración</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCitas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm ? "No se encontraron resultados" : "No hay citas programadas. Haz clic en 'Nueva Cita' para agendar una."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentCitas.map((cita, index) => {
                                const inicio = new Date(cita.inicio)
                                const final = new Date(cita.final)
                                const duracionMinutos = Math.round((final.getTime() - inicio.getTime()) / (1000 * 60))

                                return (
                                    <TableRow key={cita.id}>
                                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: cita.color }}
                                                />
                                                <span className="font-medium">{cita.titulo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{cita.user?.name || "Sin asignar"}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    Dr. {cita.doctor?.nombres} {cita.doctor?.apellidos}
                                                </p>
                                                <p className="text-xs text-gray-500">{cita.doctor?.especialidad}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{cita.consultorio?.nombre}</p>
                                                <p className="text-xs text-gray-500">{cita.consultorio?.ubicacion}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {format(inicio, "dd MMM yyyy", { locale: es })}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {format(inicio, "HH:mm", { locale: es })} - {format(final, "HH:mm", { locale: es })}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {duracionMinutos} min
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(cita)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(cita.id)}
                                                    disabled={deleting === cita.id}
                                                >
                                                    {deleting === cita.id ? "Eliminando..." : "Eliminar"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {
                totalPages > 1 && (
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
                )
            }

            <CitaForm
                open={formOpen}
                onOpenChange={setFormOpen}
                cita={selectedCita}
                onSuccess={handleSuccess}
            />
        </>
    )
}
