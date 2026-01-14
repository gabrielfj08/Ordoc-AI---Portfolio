"use client";

import { Settings, Globe, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GlobalSettings = () => {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[40px] p-6">
            <div className="mb-6">
                <h3 className="text-lg font-black">Configurações Globais da Organização</h3>
                <p className="text-xs text-white/70">Diretrizes macro que a IA segue para todos os usuários.</p>
            </div>

            <div className="space-y-4">
                {/* Regulamentações */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-orange-500 rounded-xl">
                            <Shield size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">Regulamentações Aplicáveis</p>
                            <p className="text-xs text-white/60 mt-1">Frameworks de compliance que a IA deve priorizar</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-bold">
                            Lei 14.133
                        </span>
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-bold">
                            LGPD
                        </span>
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-bold">
                            ISO 9001
                        </span>
                        <button className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold hover:bg-white/20">
                            + Adicionar
                        </button>
                    </div>
                </div>

                {/* Idioma Padrão */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500 rounded-xl">
                                <Globe size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Idioma Padrão da Organização</p>
                                <p className="text-xs text-white/60 mt-1">Português (Brasil)</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Alterar
                        </Button>
                    </div>
                </div>

                {/* Notificações Globais */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-500 rounded-xl">
                                <Bell size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Notificações Críticas</p>
                                <p className="text-xs text-white/60 mt-1">Alertar todos os administradores sobre eventos de segurança</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 rounded-full p-0.5 bg-orange-500">
                            <div className="w-5 h-5 bg-white rounded-full shadow-md translate-x-5 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <Settings size={16} className="mr-2" />
                    Salvar Configurações Globais
                </Button>
            </div>
        </div>
    );
};
