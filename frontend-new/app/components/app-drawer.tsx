"use client"

import { Card } from "@/components/ui/card"
import {
    Home,
    FolderKanban,
    Mail,
    Calendar,
    CheckCircle2,
    BarChart3,
    Workflow,
    PenTool,
    Settings,
} from "lucide-react"

interface AppDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
    const apps = [
        { name: "Ordoc", icon: Home, color: "bg-orange-600" },
        { name: "Drive", icon: FolderKanban, color: "bg-chart-2" },
        { name: "Mail", icon: Mail, color: "bg-destructive" },
        { name: "Calendar", icon: Calendar, color: "bg-chart-2" },
        { name: "Tasks", icon: CheckCircle2, color: "bg-success" },
        { name: "Analytics", icon: BarChart3, color: "bg-chart-4" },
        { name: "Workflow", icon: Workflow, color: "bg-chart-5" },
        { name: "Signatures", icon: PenTool, color: "bg-chart-1" },
        { name: "Settings", icon: Settings, color: "bg-muted-foreground" },
    ]

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" onClick={onClose} />

            <div className="fixed right-16 top-16 z-50 animate-in slide-in-from-top-5 duration-200">
                <Card className="w-80 p-6 shadow-2xl border-border/50">
                    <div className="grid grid-cols-3 gap-4">
                        {apps.map((app) => (
                            <button
                                key={app.name}
                                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-secondary/80 transition-all group"
                            >
                                <div
                                    className={`size-12 rounded-2xl ${app.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                >
                                    <app.icon className="size-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-center">{app.name}</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    )
}
