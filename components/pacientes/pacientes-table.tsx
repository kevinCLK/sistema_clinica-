"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PacienteForm } from "./paciente-form"
import { deletePaciente } from "@/actions/pacientes"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import { FileDown, FileText, Users } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PacientesTableProps {
    pacientes: any[]
}

export function PacientesTable({ pacientes }: PacientesTableProps) {
    const router = useRouter()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedPaciente, setSelectedPaciente] = useState<any>(null)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const handleEdit = (paciente: any) => {
        setSelectedPaciente(paciente)
        setFormOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar este paciente?")) return

        setDeleting(id)
        const result = await deletePaciente(id)
        setDeleting(null)

        if (result.success) {
            toast.success("Paciente eliminado exitosamente")
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    const handleNew = () => {
        setSelectedPaciente(null)
        setFormOpen(true)
    }

    const handleSuccess = () => {
        router.refresh()
    }

    // Filtrado y búsqueda
    const filteredPacientes = useMemo(() => {
        return pacientes.filter((paciente) => {
            const search = searchTerm.toLowerCase()
            return (
                paciente.nombre.toLowerCase().includes(search) ||
                paciente.apellidos.toLowerCase().includes(search) ||
                paciente.ci.includes(search) ||
                paciente.correo.toLowerCase().includes(search) ||
                paciente.celular.includes(search)
            )
        })
    }, [pacientes, searchTerm])

    // Paginación
    const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPacientes = filteredPacientes.slice(startIndex, endIndex)

    // Reset página al buscar
    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleExportExcel = () => {
        const columns = [
            { header: "ID", key: "id" },
            { header: "Nombres", key: "nombre" },
            { header: "Apellidos", key: "apellidos" },
            { header: "CI", key: "ci" },
            { header: "Fecha Nacimiento", key: "fechaNacimiento" },
            { header: "Género", key: "genero" },
            { header: "Tipo Sangre", key: "tipoSangre" },
            { header: "Celular", key: "celular" },
            { header: "Email", key: "correo" },
        ]
        exportToExcel(filteredPacientes, columns, "Pacientes_Clinica")
    }

    const handleExportPDF = () => {
        const columns = [
            { header: "Nombre", key: "nombre" },
            { header: "Apellidos", key: "apellidos" },
            { header: "CI", key: "ci" },
            { header: "Celular", key: "celular" },
            { header: "Email", key: "correo" },
        ]
        exportToPDF(filteredPacientes, columns, "Reporte de Pacientes", "Reporte_Pacientes")
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, CI, email o celular..."
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

                    <Button onClick={handleNew} className="gap-2">
                        <Users className="h-4 w-4" />
                        Nuevo Paciente
                    </Button>
                </div>
            </div>

            {/* Indicador de resultados */}
            <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <span className="font-medium text-foreground">{currentPacientes.length}</span>
                <span>de</span>
                <span className="font-medium text-foreground">{filteredPacientes.length}</span>
                <span>pacientes</span>
                {searchTerm && (
                    <>
                        <span className="mx-2">•</span>
                        <span className="text-xs">Filtrado de {pacientes.length} total</span>
                    </>
                )}
            </div>

            <div className="rounded-lg border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Nombre Completo</TableHead>
                            <TableHead>CI</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Grupo Sang.</TableHead>
                            <TableHead>Edad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentPacientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="h-12 w-12 text-muted-foreground/50" />
                                        <p className="text-muted-foreground font-medium">
                                            {searchTerm ? "No se encontraron resultados" : "No hay pacientes registrados"}
                                        </p>
                                        {!searchTerm && (
                                            <p className="text-sm text-muted-foreground">
                                                Haz clic en 'Nuevo Paciente' para agregar uno
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPacientes.map((paciente, index) => {
                                const edad = Math.floor(
                                    (new Date().getTime() - new Date(paciente.fechaNacimiento).getTime()) /
                                    (365.25 * 24 * 60 * 60 * 1000)
                                )

                                return (
                                    <TableRow key={paciente.id}>
                                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{paciente.nombre} {paciente.apellidos}</p>
                                                <p className="text-sm text-gray-500">{paciente.genero}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{paciente.ci}</TableCell>
                                        <TableCell>{paciente.celular}</TableCell>
                                        <TableCell className="text-sm">{paciente.correo}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                                {paciente.grupoSanguineo}
                                            </span>
                                        </TableCell>
                                        <TableCell>{edad} años</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/pacientes/${paciente.id}`)}
                                                    className="gap-1"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Expediente
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(paciente)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(paciente.id)}
                                                    disabled={deleting === paciente.id}
                                                >
                                                    {deleting === paciente.id ? "Eliminando..." : "Eliminar"}
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

            {/* Paginación */}
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

            <PacienteForm
                open={formOpen}
                onOpenChange={setFormOpen}
                paciente={selectedPaciente}
                onSuccess={handleSuccess}
            />
        </>
    )
}
