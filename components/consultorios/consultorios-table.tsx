"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConsultorioForm } from "./consultorio-form"
import { deleteConsultorio } from "@/actions/consultorios"
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

interface ConsultoriosTableProps {
    consultorios: any[]
}

export function ConsultoriosTable({ consultorios }: ConsultoriosTableProps) {
    const router = useRouter()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedConsultorio, setSelectedConsultorio] = useState<any>(null)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [estadoFilter, setEstadoFilter] = useState<string>("todos")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const handleEdit = (consultorio: any) => {
        setSelectedConsultorio(consultorio)
        setFormOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar este consultorio?")) return

        setDeleting(id)
        const result = await deleteConsultorio(id)
        setDeleting(null)

        if (result.success) {
            toast.success("Consultorio eliminado exitosamente")
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    const handleNew = () => {
        setSelectedConsultorio(null)
        setFormOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    const getEstadoBadge = (estado: string) => {
        const colors = {
            Disponible: "bg-green-100 text-green-800",
            Ocupado: "bg-red-100 text-red-800",
            Mantenimiento: "bg-yellow-100 text-yellow-800",
        }
        return colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-800"
    }

    // Filtrado y búsqueda
    const filteredConsultorios = useMemo(() => {
        return consultorios.filter((consultorio) => {
            const search = searchTerm.toLowerCase()
            const matchesSearch = (
                consultorio.nombre.toLowerCase().includes(search) ||
                consultorio.ubicacion.toLowerCase().includes(search) ||
                consultorio.especialidad.toLowerCase().includes(search)
            )
            const matchesEstado = estadoFilter === "todos" || consultorio.estado === estadoFilter
            return matchesSearch && matchesEstado
        })
    }, [consultorios, searchTerm, estadoFilter])

    // Paginación
    const totalPages = Math.ceil(filteredConsultorios.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentConsultorios = filteredConsultorios.slice(startIndex, endIndex)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleEstadoFilter = (value: string) => {
        setEstadoFilter(value)
        setCurrentPage(1)
    }

    const handleExportExcel = () => {
        const columns = [
            { header: "ID", key: "id" },
            { header: "Nombre", key: "nombre" },
            { header: "Ubicación", key: "ubicacion" },
            { header: "Especialidad", key: "especialidad" },
            { header: "Capacidad", key: "capacidad" },
            { header: "Teléfono", key: "telefono" },
            { header: "Estado", key: "estado" },
        ]
        exportToExcel(filteredConsultorios, columns, "Consultorios_Clinica")
    }

    const handleExportPDF = () => {
        const columns = [
            { header: "Nombre", key: "nombre" },
            { header: "Ubicación", key: "ubicacion" },
            { header: "Especialidad", key: "especialidad" },
            { header: "Estado", key: "estado" },
        ]
        exportToPDF(filteredConsultorios, columns, "Reporte de Consultorios", "Reporte_Consultorios")
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar consultorio..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full sm:w-64"
                    />
                    <Select value={estadoFilter} onValueChange={handleEstadoFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="Disponible">Disponible</SelectItem>
                            <SelectItem value="Ocupado">Ocupado</SelectItem>
                            <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchTerm || estadoFilter !== "todos") && (
                        <Button variant="ghost" size="sm" onClick={() => { handleSearch(""); handleEstadoFilter("todos"); }}>
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
                        + Nuevo Consultorio
                    </Button>
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
                Mostrando {currentConsultorios.length} de {filteredConsultorios.length} consultorios
                {(searchTerm || estadoFilter !== "todos") && ` (filtrado de ${consultorios.length} total)`}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Especialidad</TableHead>
                            <TableHead>Capacidad</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentConsultorios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm || estadoFilter !== "todos" ? "No se encontraron resultados" : "No hay consultorios registrados. Haz clic en 'Nuevo Consultorio' para agregar uno."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentConsultorios.map((consultorio, index) => (
                                <TableRow key={consultorio.id}>
                                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                    <TableCell className="font-medium">{consultorio.nombre}</TableCell>
                                    <TableCell>{consultorio.ubicacion}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {consultorio.especialidad}
                                        </span>
                                    </TableCell>
                                    <TableCell>{consultorio.capacidad}</TableCell>
                                    <TableCell>{consultorio.telefono || "-"}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(consultorio.estado)}`}>
                                            {consultorio.estado}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(consultorio)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(consultorio.id)}
                                                disabled={deleting === consultorio.id}
                                            >
                                                {deleting === consultorio.id ? "Eliminando..." : "Eliminar"}
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

            <ConsultorioForm
                open={formOpen}
                onOpenChange={setFormOpen}
                consultorio={selectedConsultorio}
                onSuccess={handleSuccess}
            />
        </>
    )
}
