'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BarChart3, AlertCircle, Upload, PenTool, Workflow } from "lucide-react"
import { useRouter } from "next/navigation"

import { PrivacyBadge } from "@/components/common/privacy-badge"

interface AssistantWidgetProps {
    overview: any
    pending: {
        pending_signatures: number
        pending_approvals: number
    }
    privacyMode?: any
}

export function AssistantWidget({ overview, pending, privacyMode }: AssistantWidgetProps) {
    const router = useRouter()

    return (
        <Card className="p-5 border-orange-400 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl relative h-full flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <Sparkles className="size-6 text-orange-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl leading-tight">Assistente</h3>
                            {privacyMode?.mode === 'local' && (
                                <PrivacyBadge className="bg-white/20 text-white border-white/30" collapsed />
                            )}
                        </div>
                        <p className="text-xs text-orange-50/90 font-medium">Análise de documentos e processos em andamento.</p>
                    </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-[10px] uppercase tracking-wider h-6 px-3">
                    Atualizado agora
                </Badge>
            </div>

            {/* Bottom row - Suggestions only */}
            <div className="mt-2">
                <div
                    className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-inner cursor-pointer hover:bg-white/15 transition-all group/action"
                    onClick={() => router.push('/documents?action=pending')}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="size-4 text-white/80" />
                        <span className="text-xs font-bold text-white uppercase tracking-tight">Ações sugeridas hoje</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/5 hover:bg-white/20 transition-all group/item">
                            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                                <Upload className="size-4 text-white" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-bold text-white truncate">Upload de Documentos</span>
                                <span className="text-[9px] text-orange-50/70 truncate">Arraste para enviar</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/5 hover:bg-white/20 transition-all group/item cursor-pointer" onClick={() => router.push('/signatures')}>
                            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                                <PenTool className="size-4 text-white" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-bold text-white truncate">
                                    {pending.pending_signatures === 1 ? '1 Assinatura' : `${pending.pending_signatures} Assinaturas`}
                                </span>
                                <span className="text-[9px] text-orange-50/70 truncate">Aguardando você</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/5 hover:bg-white/20 transition-all group/item cursor-pointer" onClick={() => router.push('/processes')}>
                            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 shadow-sm">
                                <Workflow className="size-4 text-white" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-bold text-white truncate">
                                    {pending.pending_approvals === 1 ? '1 Aprovação' : `${pending.pending_approvals} Aprovações`}
                                </span>
                                <span className="text-[9px] text-orange-50/70 truncate">Tarefas pendentes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
