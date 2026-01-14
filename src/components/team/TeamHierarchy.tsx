"use client";

import { Users, Crown, Shield, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TeamHierarchy = () => {
    const teamMembers = [
        { id: 1, name: "Ana Silva", role: "Administrador", access: "Total", avatar: "AS", color: "bg-orange-500" },
        { id: 2, name: "Carlos Mendes", role: "Gestor", access: "Departamental", avatar: "CM", color: "bg-blue-500" },
        { id: 3, name: "Beatriz Santos", role: "Analista", access: "Limitado", avatar: "BS", color: "bg-green-500" },
        { id: 4, name: "Daniel Costa", role: "Analista", access: "Limitado", avatar: "DC", color: "bg-purple-500" },
        { id: 5, name: "Elena Rodrigues", role: "Visualizador", access: "Somente Leitura", avatar: "ER", color: "bg-pink-500" },
    ];

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-foreground">Hierarquia de Confiança</h3>
                    <p className="text-xs text-muted-foreground">Níveis de acesso ao cérebro da IA e aos documentos.</p>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                    <Users size={14} className="mr-2" />
                    Convidar Membro
                </Button>
            </div>

            <div className="space-y-3">
                {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${member.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                                {member.avatar}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-foreground">{member.name}</p>
                                    {member.role === "Administrador" && <Crown size={14} className="text-orange-500" />}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-muted-foreground">{member.role}</span>
                                    <span className="text-xs text-orange-600 font-semibold">• {member.access}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-xs">
                                <Eye size={14} className="mr-1" />
                                Ver Atividade
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs">
                                <Edit size={14} className="mr-1" />
                                Editar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
