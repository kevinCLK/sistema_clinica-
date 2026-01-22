"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { CitasTable } from "./citas-table"
import { Button } from "@/components/ui/button"
import { LayoutList, Calendar as CalendarIcon } from "lucide-react"

const CalendarView = dynamic(() => import("./calendar-view").then(mod => ({ default: mod.CalendarView })), {
    ssr: false,
    loading: () => <div className="p-4">Cargando calendario...</div>
})

interface CitasPageClientProps {
    citas: any[]
}

export function CitasPageClient({ citas }: CitasPageClientProps) {
    const [view, setView] = useState<"list" | "calendar">("list")

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                    <Button
                        variant={view === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="h-9 gap-2"
                    >
                        <LayoutList className="w-4 h-4" />
                        Lista
                    </Button>
                    <Button
                        variant={view === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("calendar")}
                        className="h-9 gap-2"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Calendario
                    </Button>
                </div>
            </div>

            {view === "list" ? (
                <CitasTable citas={citas} />
            ) : (
                <CalendarView citas={citas} />
            )}
        </div>
    )
}
