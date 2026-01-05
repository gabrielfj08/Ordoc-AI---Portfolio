import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertTriangle, FileText, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ComplianceOverviewWidget() {
    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="size-5 text-primary" />
                        Conformidade LGPD
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Monitoramento de proteção de dados</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20 px-4 py-1.5 font-semibold">
                    Em Conformidade
                </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="size-4 text-primary" />
                        <span className="text-sm font-medium">Score de Privacidade</span>
                    </div>
                    <div className="text-2xl font-bold">98/100</div>
                    <div className="text-xs text-success mt-1">+2 pontos esta semana</div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="size-4 text-blue-500" />
                        <span className="text-sm font-medium">Consentimentos</span>
                    </div>
                    <div className="text-2xl font-bold">1,245</div>
                    <div className="text-xs text-muted-foreground mt-1">Registros ativos</div>
                </div>

                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="size-4 text-destructive" />
                        <span className="text-sm font-medium">Pendências</span>
                    </div>
                    <div className="text-2xl font-bold text-destructive">0</div>
                    <div className="text-xs text-muted-foreground mt-1">Ações críticas</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="w-full text-xs">Ver Relatório DPO</Button>
                <Button variant="outline" className="w-full text-xs">Mapeamento de Dados</Button>
            </div>
        </Card>
    )
}
