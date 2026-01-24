"use client"

import dynamic from "next/dynamic"
import { Cita } from "@/lib/validations/cita"

const CitasPageClient = dynamic(() => import("@/components/citas/citas-page-client").then(mod => ({ default: mod.CitasPageClient })), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Cargando citas...</p>
            </div>
        </div>
    )
})

interface CitasClientWrapperProps {
    citas: Cita[]
}

export function CitasClientWrapper({ citas }: CitasClientWrapperProps) {
    return <CitasPageClient citas={citas} />
}
