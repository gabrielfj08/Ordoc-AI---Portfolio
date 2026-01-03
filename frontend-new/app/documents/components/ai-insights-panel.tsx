"use client"

import { useSearchParams } from "next/navigation"
import { Sparkles, ArrowRight, FileText, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIInsightsPanel() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')

    if (!query) return null

    // Mock logic for demonstration
    const isContract = query.toLowerCase().includes('contrato')
    const isDeadline = query.toLowerCase().includes('prazo') || query.toLowerCase().includes('venc')

    return (
        <div className="mx-4 mt-4 mb-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 bg-white/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex items-start gap-3 relative z-10">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-2 rounded-lg shadow-sm shrink-0">
                    <Sparkles className="size-5" />
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                        Insights de IA para "{query}"
                        <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded uppercase tracking-wider">Beta</span>
                    </h3>

                    <div className="mt-2 space-y-2 text-sm text-purple-800/80">
                        {isContract ? (
                            <p>
                                Com base nos contratos encontrados, identifiquei <strong>3 documentos</strong> que requerem atenção.
                                Há cláusulas de renovação automática próximas. Sugiro revisar os termos.
                            </p>
                        ) : isDeadline ? (
                            <p>
                                Identifiquei prazos críticos relacionados à sua busca.
                                Recomendo criar tarefas no <strong>Meu Dia</strong> para acompanhar os vencimentos desta semana.
                            </p>
                        ) : (
                            <p>
                                Encontrei documentos relevantes. A inteligência da plataforma sugere agrupar estes arquivos por tag
                                para facilitar a gestão futura.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white text-purple-700 border-purple-200 shadow-sm text-xs h-8">
                        <Calendar className="size-3.5 mr-1.5" />
                        Criar Tarefa
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white text-purple-700 border-purple-200 shadow-sm text-xs h-8">
                        <FileText className="size-3.5 mr-1.5" />
                        Resumir
                    </Button>
                </div>
            </div>
        </div>
    )
}
