'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Bot, Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AIAssistant = () => {
    return (
        <aside className="flex flex-col gap-4">

            {/* Assistente de IA */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    OrdocAI Assistant
                </h2>
                <p className="text-xs text-muted-foreground mb-3">
                    IA analisou seus documentos e processos.
                </p>
                <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-primary/5 px-3 py-2 border border-primary/10">
                        <p className="font-semibold text-primary mb-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Sugestão de automação
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            8 contratos similares foram processados. Posso criar um template e workflow automático?
                        </p>
                        <button className="mt-2 text-[11px] font-medium text-primary hover:underline">
                            Criar automação →
                        </button>
                    </div>
                    <div className="rounded-xl bg-secondary px-3 py-2">
                        <p className="font-semibold text-foreground mb-0.5">📊 Estatísticas da semana</p>
                        <p className="text-muted-foreground">
                            124 docs processados • 89% aprovados de primeira
                        </p>
                    </div>
                </div>
            </Card>

            {/* Ações rápidas geradas pela IA */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500" /> Ações rápidas (IA)
                    </h2>
                    <span className="text-[10px] text-muted-foreground">Geradas agora</span>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2 group cursor-pointer hover:bg-secondary/50 p-1.5 rounded-md transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive group-hover:scale-110 transition-transform"></span>
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Assinar Contrato TI (vence 14h)</p>
                            <p className="text-[10px]">Certificado A1 válido • Crítico</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-2 group cursor-pointer hover:bg-secondary/50 p-1.5 rounded-md transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-110 transition-transform"></span>
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Aprovar 3 orçamentos</p>
                            <p className="text-[10px]">Total: R$ 890k • Parecer anexo</p>
                        </div>
                    </li>
                </ul>
            </Card>

            {/* Docs Recentes Minimalista */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-700">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-foreground">Docs Recentes</h2>
                    <Button variant="link" className="h-auto p-0 text-xs">+ Upload</Button>
                </div>
                <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-600">PDF</div>
                        <span className="text-muted-foreground truncate max-w-[150px]">Contrato_2025.pdf</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">DOC</div>
                        <span className="text-muted-foreground truncate max-w-[150px]">Decreto_123.docx</span>
                    </li>
                </ul>
            </Card>

        </aside>
    );
};
