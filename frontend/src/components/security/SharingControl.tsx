"use client";

import { ShieldAlert, Globe, Link2, XCircle, FileText, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SharingControl = () => {
    const activeShares = [
        {
            id: 1,
            document: "Contrato_Internacional_v2.pdf",
            sharedWith: "juridico@partner.com",
            expiresIn: "7 dias",
            accessCount: 12
        },
        {
            id: 2,
            document: "Proposta_Comercial_2026.pdf",
            sharedWith: "comercial@cliente.com.br",
            expiresIn: "2 dias",
            accessCount: 5
        },
        {
            id: 3,
            document: "Relatório_Auditoria_Q4.pdf",
            sharedWith: "auditoria@externa.com",
            expiresIn: "14 dias",
            accessCount: 23
        }
    ];

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-foreground">Soberania de Compartilhamento</h3>
                    <p className="text-xs text-muted-foreground">Controle todos os acessos externos aos seus ativos.</p>
                </div>
                <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl text-xs font-bold uppercase flex items-center gap-2">
                    <Globe size={14} />
                    {activeShares.length} Links Ativos
                </div>
            </div>

            <div className="space-y-3">
                {activeShares.map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="p-2 bg-background rounded-xl shadow-sm">
                                <FileText size={18} className="text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-foreground">{share.document}</p>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <User size={12} />
                                        {share.sharedWith}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar size={12} />
                                        Expira em {share.expiresIn}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {share.accessCount} acessos
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-red-500 hover:bg-red-50 gap-2 text-xs shrink-0">
                            <XCircle size={14} /> Revogar
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    <ShieldAlert size={16} className="mr-2" />
                    Revogar Todos os Acessos Externos
                </Button>
            </div>
        </div>
    );
};
