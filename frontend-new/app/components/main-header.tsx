"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { OrdocLogo } from "@/components/ordoc-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Search,
    Bell,
    Settings,
    FileText,
    Workflow,
    PenTool,
    BarChart3,
    Calendar,
    Grid3x3,
    Menu,
    ChevronLeft,
} from "lucide-react"
import { AppDrawer } from "./app-drawer"
import { useNotifications } from "@/hooks/use-notifications"
import { useAlerts } from "@/hooks/use-alerts"
import { useAppStore } from "@/stores/app-store"
import { useLogout } from "@/hooks/queries/use-auth-query"
import { UserPreferencesDialog } from "@/components/settings/user-preferences-dialog"

interface MainHeaderProps {
    showSidebarToggle?: boolean
    sidebarCollapsed?: boolean
    onSidebarToggle?: () => void
}

export function MainHeader({ showSidebarToggle, sidebarCollapsed, onSidebarToggle }: MainHeaderProps) {
    const pathname = usePathname()
    const [appDrawerOpen, setAppDrawerOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [isPreferencesOpen, setPreferencesOpen] = useState(false)

    // Seletores granulares para evitar re-renderizações desnecessárias
    const user = useAppStore((state) => state.user)
    const isAuthenticated = useAppStore((state) => state.isAuthenticated)

    const { mutate: logout } = useLogout()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
    const { unreadCount: aiAlertsCount } = useAlerts()

    // Não mostrar header na página de login
    if (pathname === '/login') {
        return null
    }

    // Iniciais do usuário
    const userInitials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'U'
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Usuário'
    const userRole = user?.organization?.name || 'Sem organização'

    const navItems = [
        { id: "my-day", label: "Meu Dia", icon: Calendar, href: "/my-day" },
        { id: "documents", label: "Documentos", icon: FileText, href: "/documents" },
        { id: "processes", label: "Processos", icon: Workflow, href: "/processes" },
        { id: "signatures", label: "Assinaturas", icon: PenTool, href: "/signatures" },
        { id: "analyses", label: "Análises", icon: BarChart3, href: "/analyses" },
    ]

    const isActive = (href: string) => pathname?.startsWith(href)

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
                    {showSidebarToggle && onSidebarToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-secondary/50 transition-all"
                            onClick={onSidebarToggle}
                        >
                            {sidebarCollapsed ? <Menu className="size-5" /> : <ChevronLeft className="size-5" />}
                        </Button>
                    )}

                    <OrdocLogo />

                    <nav className="hidden md:flex items-center gap-2 ml-6">
                        {navItems.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                size="sm"
                                className={`gap-2 rounded-full px-4 transition-all ${isActive(item.href)
                                    ? "bg-orange-600/10 text-primary hover:bg-orange-600/20"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    }`}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-4" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <div className="flex-1" />

                    <div
                        className={`hidden lg:flex relative transition-all duration-300 ${searchFocused ? "w-[500px]" : "w-96"
                            }`}
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                            placeholder="Buscar em Ordoc"
                            className={`pl-12 pr-4 h-11 rounded-full bg-secondary/30 border-transparent transition-all ${searchFocused ? "bg-background shadow-lg border-border" : "hover:bg-secondary/50"
                                }`}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary/50">
                                <Bell className="size-5" />
                                {/* Badge combinado de notificações + alertas IA */}
                                {(unreadCount + aiAlertsCount) > 0 && (
                                    <>
                                        <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full animate-pulse" />
                                        <span className="absolute -top-1 -right-1 size-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {(unreadCount + aiAlertsCount) > 9 ? '9+' : (unreadCount + aiAlertsCount)}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-96 p-0">
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Notificações</h3>
                                    <div className="flex items-center gap-2">
                                        {aiAlertsCount > 0 && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                🤖 {aiAlertsCount} IA
                                            </span>
                                        )}
                                        {unreadCount > 0 && (
                                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-medium">
                                                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Bell className="size-12 mx-auto mb-3 opacity-20" />
                                        <p>Nenhuma notificação</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => {
                                        // Determinar ícone baseado no tipo
                                        const getTypeIcon = () => {
                                            switch (notif.type) {
                                                case 'task':
                                                    return <Workflow className="size-4 text-blue-500" />
                                                case 'approval':
                                                    return <FileText className="size-4 text-green-500" />
                                                case 'deadline':
                                                    return <Calendar className="size-4 text-red-500" />
                                                default:
                                                    return <Bell className="size-4 text-orange-500" />
                                            }
                                        }

                                        return (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b hover:bg-secondary/30 cursor-pointer transition-colors ${notif.status !== 'read' ? "bg-orange-600/5" : ""
                                                    }`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {getTypeIcon()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-sm">{notif.subject}</p>
                                                            {notif.status !== 'read' && (
                                                                <div className="size-2 rounded-full bg-primary shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-1">{notif.body}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(notif.created_at).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <div className="p-3 border-t">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full rounded-full text-sm mb-2"
                                        onClick={markAllAsRead}
                                    >
                                        Marcar todas como lidas
                                    </Button>
                                )}
                                <Button variant="ghost" className="w-full rounded-full text-sm">
                                    Ver todas as notificações
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-secondary/50"
                        onClick={() => setAppDrawerOpen(!appDrawerOpen)}
                    >
                        <Grid3x3 className="size-5" />
                    </Button>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-3 rounded-full hover:bg-secondary/50 pl-2 pr-4">
                                <Avatar className="size-8 ring-2 ring-primary/20">
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden lg:inline text-sm font-medium">{user?.first_name || 'Usuário'}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2">
                            <DropdownMenuLabel className="p-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-12 ring-2 ring-primary/20">
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold">{userName}</p>
                                        <p className="text-xs text-muted-foreground">{userRole}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="rounded-lg cursor-pointer"
                                onClick={() => setPreferencesOpen(true)}
                            >
                                <Settings className="mr-3 size-4" />
                                Preferências
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-lg text-destructive cursor-pointer"
                                onClick={() => logout()}
                            >
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <AppDrawer isOpen={appDrawerOpen} onClose={() => setAppDrawerOpen(false)} />
            <UserPreferencesDialog open={isPreferencesOpen} onOpenChange={setPreferencesOpen} />
        </>
    )
}
