"use client";

import { Shield, Key, Smartphone, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const IdentityControl = () => {
    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="mb-6">
                <h3 className="text-lg font-black text-foreground">Punho Digital</h3>
                <p className="text-xs text-muted-foreground">Gerencie suas credenciais e assinaturas eletrônicas.</p>
            </div>

            <div className="space-y-4">
                {/* Certificado Digital */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-xl">
                                <Shield size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Certificado Digital ICP-Brasil</p>
                                <p className="text-xs text-muted-foreground">Válido até 15/08/2026</p>
                            </div>
                        </div>
                        <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                            Renovar Certificado
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs text-red-600">
                            Revogar
                        </Button>
                    </div>
                </div>

                {/* MFA */}
                <div className="p-4 bg-muted border border-border rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500 rounded-xl">
                                <Smartphone size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Autenticação de Dois Fatores (MFA)</p>
                                <p className="text-xs text-muted-foreground">Dispositivo: iPhone 14 Pro</p>
                            </div>
                        </div>
                        <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                        Gerenciar Dispositivos
                    </Button>
                </div>

                {/* Chaves de API */}
                <div className="p-4 bg-muted border border-border rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-xl">
                                <Key size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Chaves de API</p>
                                <p className="text-xs text-muted-foreground">2 chaves ativas para integrações</p>
                            </div>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                        Ver Chaves
                    </Button>
                </div>
            </div>
        </div>
    );
};
