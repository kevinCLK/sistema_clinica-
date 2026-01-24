"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
    user?: {
        name?: string | null
        email?: string | null
    }
    variant?: "default" | "sidebar"
}

export function UserMenu({ user, variant = "default" }: UserMenuProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        window.location.href = "/login"
    }

    if (!mounted) {
        // Renderizar versión estática durante SSR
        if (variant === "sidebar") {
            return (
                <div className="flex items-center gap-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{user?.name || "Usuario"}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                    </div>
                </div>
            )
        }
        return (
            <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user?.name || "Usuario"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
            </Button>
        )
    }

    if (variant === "sidebar") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-auto py-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-sm font-medium">{user?.name || "Usuario"}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/perfil" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/perfil" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Configuración
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium">{user?.name || "Usuario"}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

