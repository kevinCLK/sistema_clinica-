"use client"

import { useState, useMemo } from "react"
import { Calendar, momentLocalizer, Views, View, SlotInfo } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { CitaForm } from "@/components/citas/cita-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"

moment.locale("es")
const localizer = momentLocalizer(moment)

interface CalendarViewProps {
    citas: any[]
}

export function CalendarView({ citas }: CalendarViewProps) {
    const [selectedCita, setSelectedCita] = useState<any>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState<View>(Views.WEEK)
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)

    // Mapear citas al formato del calendario
    const events = useMemo(() => {
        return citas.map(cita => ({
            id: cita.id,
            title: cita.titulo || "Cita médica",
            start: new Date(cita.inicio),
            end: new Date(cita.final),
            resource: cita,
            color: cita.color || "#3b82f6",
            paciente: cita.user?.name || "Sin paciente",
            doctor: cita.doctor?.nombre || "Sin doctor",
            consultorio: cita.consultorio?.nombre || "Sin consultorio",
        }))
    }, [citas])

    const handleSelectEvent = (event: any) => {
        setSelectedCita(event.resource)
        setFormOpen(true)
    }

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setSelectedSlot({ start: slotInfo.start, end: slotInfo.end || new Date(slotInfo.start.getTime() + 60 * 60 * 1000) })
        setSelectedCita(null)
        setFormOpen(true)
    }

    const eventStyleGetter = (event: any) => {
        const color = event.color || "#3b82f6"
        return {
            style: {
                backgroundColor: color,
                borderRadius: '8px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                padding: '4px 8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }
        }
    }

    const handleNavigate = (action: 'prev' | 'next' | 'today') => {
        if (action === 'today') {
            setCurrentDate(new Date())
        } else if (action === 'prev') {
            if (currentView === Views.MONTH) {
                setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())
            } else if (currentView === Views.WEEK) {
                setCurrentDate(moment(currentDate).subtract(1, 'week').toDate())
            } else {
                setCurrentDate(moment(currentDate).subtract(1, 'day').toDate())
            }
        } else {
            if (currentView === Views.MONTH) {
                setCurrentDate(moment(currentDate).add(1, 'month').toDate())
            } else if (currentView === Views.WEEK) {
                setCurrentDate(moment(currentDate).add(1, 'week').toDate())
            } else {
                setCurrentDate(moment(currentDate).add(1, 'day').toDate())
            }
        }
    }

    const handleViewChange = (view: View) => {
        setCurrentView(view)
    }

    const messages = {
        next: "Siguiente",
        previous: "Anterior",
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        agenda: "Agenda",
        date: "Fecha",
        time: "Hora",
        event: "Cita",
        noEventsInRange: "No hay citas en este rango de fechas",
    }

    const getDateLabel = () => {
        if (currentView === Views.MONTH) {
            return format(currentDate, "MMMM yyyy", { locale: es })
        } else if (currentView === Views.WEEK) {
            const start = moment(currentDate).startOf('week')
            const end = moment(currentDate).endOf('week')
            return `${format(start.toDate(), "d MMM", { locale: es })} - ${format(end.toDate(), "d MMM yyyy", { locale: es })}`
        } else {
            return format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: es })
        }
    }

    return (
        <div className="space-y-4">
            {/* Controles del Calendario */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl">Calendario de Citas</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {getDateLabel()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNavigate('prev')}
                                className="gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNavigate('today')}
                                className="gap-2"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                Hoy
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNavigate('next')}
                                className="gap-2"
                            >
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Selector de Vista */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex bg-muted rounded-lg p-1 gap-1">
                            <Button
                                variant={currentView === Views.MONTH ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewChange(Views.MONTH)}
                                className="h-8"
                            >
                                Mes
                            </Button>
                            <Button
                                variant={currentView === Views.WEEK ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewChange(Views.WEEK)}
                                className="h-8"
                            >
                                Semana
                            </Button>
                            <Button
                                variant={currentView === Views.DAY ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewChange(Views.DAY)}
                                className="h-8"
                            >
                                Día
                            </Button>
                            <Button
                                variant={currentView === Views.AGENDA ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewChange(Views.AGENDA)}
                                className="h-8"
                            >
                                Agenda
                            </Button>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedCita(null)
                                setSelectedSlot(null)
                                setFormOpen(true)
                            }}
                            className="ml-auto gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva Cita
                        </Button>
                    </div>

                    {/* Calendario */}
                    <div className="h-[600px] rounded-lg border bg-card overflow-hidden">
                        <div className="h-full [&_.rbc-calendar]:h-full [&_.rbc-calendar]:bg-card [&_.rbc-calendar]:text-foreground">
                            <style jsx global>{`
                                .rbc-calendar {
                                    font-family: inherit;
                                }
                                .rbc-header {
                                    padding: 12px 8px;
                                    font-weight: 600;
                                    background: hsl(var(--muted));
                                    border-bottom: 1px solid hsl(var(--border));
                                    color: hsl(var(--foreground));
                                }
                                .rbc-today {
                                    background-color: hsl(var(--primary) / 0.1);
                                }
                                .rbc-off-range-bg {
                                    background: hsl(var(--muted) / 0.3);
                                }
                                .rbc-date-cell {
                                    text-align: center;
                                }
                                .rbc-date-cell > a {
                                    color: hsl(var(--foreground));
                                    text-decoration: none;
                                }
                                .rbc-date-cell.rbc-now > a {
                                    color: hsl(var(--primary));
                                    font-weight: 700;
                                }
                                .rbc-toolbar {
                                    display: none;
                                }
                                .rbc-time-view {
                                    border-color: hsl(var(--border));
                                }
                                .rbc-time-header-content {
                                    border-color: hsl(var(--border));
                                }
                                .rbc-time-content {
                                    border-color: hsl(var(--border));
                                }
                                .rbc-time-slot {
                                    border-color: hsl(var(--border) / 0.5);
                                }
                                .rbc-day-slot .rbc-time-slot {
                                    border-top-color: hsl(var(--border) / 0.3);
                                }
                                .rbc-agenda-view table {
                                    border-color: hsl(var(--border));
                                }
                                .rbc-agenda-view table tbody > tr > td {
                                    border-color: hsl(var(--border));
                                    padding: 12px;
                                }
                                .rbc-agenda-view table thead > tr > th {
                                    background: hsl(var(--muted));
                                    border-color: hsl(var(--border));
                                    padding: 12px;
                                    font-weight: 600;
                                }
                                .rbc-agenda-time-cell {
                                    color: hsl(var(--muted-foreground));
                                }
                                .rbc-agenda-date-cell {
                                    color: hsl(var(--foreground));
                                }
                                .rbc-event {
                                    cursor: pointer;
                                    transition: all 0.2s;
                                }
                                .rbc-event:hover {
                                    opacity: 1;
                                    transform: translateY(-1px);
                                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                                }
                                .rbc-selected {
                                    background-color: hsl(var(--primary) / 0.2) !important;
                                }
                                .rbc-show-more {
                                    background-color: hsl(var(--muted));
                                    color: hsl(var(--foreground));
                                    border-radius: 4px;
                                    padding: 4px 8px;
                                    font-size: 0.75rem;
                                }
                                .rbc-show-more:hover {
                                    background-color: hsl(var(--muted) / 0.8);
                                }
                            `}</style>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                date={currentDate}
                                view={currentView}
                                onView={handleViewChange}
                                onNavigate={setCurrentDate}
                                style={{ height: "100%" }}
                                messages={messages}
                                onSelectEvent={handleSelectEvent}
                                onSelectSlot={handleSelectSlot}
                                selectable
                                eventPropGetter={eventStyleGetter}
                                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                                defaultView={Views.WEEK}
                                step={30}
                                timeslots={2}
                                min={new Date(2024, 0, 1, 7, 0)}
                                max={new Date(2024, 0, 1, 20, 0)}
                                formats={{
                                    dayFormat: (date, culture, localizer) => localizer?.format(date, 'dddd D', culture) || '',
                                    weekdayFormat: (date, culture, localizer) => localizer?.format(date, 'ddd', culture) || '',
                                    timeGutterFormat: (date, culture, localizer) => localizer?.format(date, 'HH:mm', culture) || '',
                                }}
                            />
                        </div>
                    </div>

                    {/* Información de la cita seleccionada (si hay alguna) */}
                    {selectedCita && (
                        <Card className="mt-4 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Detalles de la Cita
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Título</p>
                                        <p className="text-base font-semibold">{selectedCita.titulo || "Cita médica"}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                                                <p className="text-base">{selectedCita.user?.name || "Sin paciente"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Horario</p>
                                                <p className="text-base">
                                                    {format(new Date(selectedCita.inicio), "PPpp", { locale: es })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                                                <p className="text-base">{selectedCita.doctor?.nombre || "Sin doctor"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Consultorio</p>
                                                <p className="text-base">{selectedCita.consultorio?.nombre || "Sin consultorio"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setFormOpen(true)
                                            }}
                                            className="w-full"
                                        >
                                            Editar Cita
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>

            {/* Formulario de Cita */}
            <CitaForm
                open={formOpen}
                onOpenChange={(open) => {
                    setFormOpen(open)
                    if (!open) {
                        setSelectedCita(null)
                        setSelectedSlot(null)
                    }
                }}
                cita={selectedCita}
                selectedSlot={selectedSlot}
                onSuccess={() => {
                    setFormOpen(false)
                    setSelectedCita(null)
                    setSelectedSlot(null)
                    window.location.reload()
                }}
            />
        </div>
    )
}
