"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Calendar,
    Building2,
    Menu,
    X,
    ChevronRight,
    UserCog
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserMenu } from "./user-menu"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
    children: React.ReactNode
    user?: {
        name?: string | null
        email?: string | null
        role?: string
    }
}

export function AppLayout({ children, user }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
        { name: "Pacientes", href: "/pacientes", icon: Users, roles: ["ADMIN", "DOCTOR"] },
        { name: "Doctores", href: "/doctores", icon: Stethoscope, roles: ["ADMIN"] },
        { name: "Consultorios", href: "/consultorios", icon: Building2, roles: ["ADMIN"] },
        { name: "Citas", href: "/citas", icon: Calendar, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
        { name: "Usuarios", href: "/usuarios", icon: UserCog, roles: ["ADMIN"] },
    ].filter(item => !user?.role || item.roles.includes(user.role))

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar para desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
                    {/* Logo y nombre */}
                    <div className="flex h-16 shrink-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-foreground">Clínica Médica</span>
                            <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                                const Icon = item.icon

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5 shrink-0",
                                                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                                            )} />
                                            {item.name}
                                            {isActive && (
                                                <ChevronRight className="ml-auto h-4 w-4" />
                                            )}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Usuario */}
                    <div className="mt-auto border-t border-border pt-4">
                        <UserMenu user={user} variant="sidebar" />
                    </div>
                </div>
            </aside>

            {/* Sidebar móvil */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 z-50 flex w-72 flex-col lg:hidden">
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
                            <div className="flex h-16 shrink-0 items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <Stethoscope className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-foreground">Clínica Médica</span>
                                        <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href ||
                                            (item.href !== "/dashboard" && pathname.startsWith(item.href))
                                        const Icon = item.icon

                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    )}
                                                >
                                                    <Icon className={cn(
                                                        "h-5 w-5 shrink-0",
                                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                                                    )} />
                                                    {item.name}
                                                    {isActive && (
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    )}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>

                            <div className="mt-auto border-t border-border pt-4">
                                <UserMenu user={user} variant="sidebar" />
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* Contenido principal */}
            <div className="lg:pl-72">
                {/* Header superior */}
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Abrir sidebar</span>
                    </Button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1" />
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <ModeToggle />
                            <div className="hidden lg:block">
                                <UserMenu user={user} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="py-8">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

