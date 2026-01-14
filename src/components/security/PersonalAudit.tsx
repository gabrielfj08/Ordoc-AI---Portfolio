"use client";

import { Eye, Download, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PersonalAudit = () => {
    const auditLogs = [
        { id: 1, action: "Visualizou", document: "Contrato_Fornecedor_ABC.pdf", timestamp: "Há 2 horas", ip: "192.168.1.100" },
        { id: 2, action: "Assinou", document: "Termo_Aditivo_2026.pdf", timestamp: "Há 5 horas", ip: "192.168.1.100" },
        { id: 3, action: "Baixou", document: "Relatório_Mensal_Dez.pdf", timestamp: "Ontem às 14:30", ip: "192.168.1.100" },
        { id: 4, action: "Compartilhou", document: "Proposta_Comercial.pdf", timestamp: "2 dias atrás", ip: "192.168.1.100" },
        { id: 5, action: "Visualizou", document: "NF_2024_12345.pdf", timestamp: "3 dias atrás", ip: "192.168.1.100" },
    ];

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-foreground">Auditoria Pessoal</h3>
                    <p className="text-xs text-muted-foreground">Histórico completo das suas ações na plataforma.</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                    <Download size={14} className="mr-2" />
                    Exportar Log
                </Button>
            </div>

            <div className="space-y-2">
                {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-3 bg-muted rounded-xl border border-border hover:bg-muted/80 transition-colors">
                        <div className="p-2 bg-background rounded-lg">
                            {log.action === "Visualizou" && <Eye size={14} className="text-blue-600" />}
                            {log.action === "Assinou" && <FileText size={14} className="text-green-600" />}
                            {log.action === "Baixou" && <Download size={14} className="text-orange-600" />}
                            {log.action === "Compartilhou" && <FileText size={14} className="text-purple-600" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">
                                <span className="text-orange-600">{log.action}</span> {log.document}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock size={10} />
                                    {log.timestamp}
                                </p>
                                <p className="text-xs text-muted-foreground">IP: {log.ip}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
