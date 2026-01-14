"use client";

import {
    ShieldCheck, Fingerprint, Database,
    UserCheck, Link as LinkIcon, History
} from "lucide-react";

interface TimelineEvent {
    id: string;
    type: 'hash' | 'auth' | 'sign' | 'blockchain';
    label: string;
    date: string;
    detail: string;
    status: 'completed' | 'pending';
}

export const DocumentLineage = () => {
    const events: TimelineEvent[] = [
        {
            id: "1", type: "hash", label: "Hash SHA-256 Gerado",
            date: "09 Jan, 10:14", detail: "Integridade original selada localmente.", status: 'completed'
        },
        {
            id: "2", type: "auth", label: "Autenticação de Signatário",
            date: "09 Jan, 14:20", detail: "Ricardo (ID: u1) validado via MFA.", status: 'completed'
        },
        {
            id: "3", type: "sign", label: "Assinatura Digital Aplicada",
            date: "09 Jan, 14:21", detail: "Certificado PAdES injetado no PDF.", status: 'completed'
        },
        {
            id: "4", type: "blockchain", label: "Registro em Blockchain",
            date: "Pendente", detail: "A aguardar selagem no bloco #482.102.", status: 'pending'
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <History size={18} className="text-orange-600" />
                <h3 className="font-bold text-slate-800 text-sm">Linhagem do Documento</h3>
            </div>

            <div className="space-y-6">
                {events.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4">
                        {/* Linha Conectora */}
                        {index !== events.length - 1 && (
                            <div className="absolute left-[11px] top-6 w-[2px] h-10 bg-slate-100" />
                        )}

                        {/* Ícone de Status */}
                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${event.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {getIcon(event.type)}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-4">
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${event.status === 'completed' ? 'text-slate-800' : 'text-slate-400'
                                    }`}>
                                    {event.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{event.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                {event.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dashed border-slate-100">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Fingerprint size={20} className="text-slate-400" />
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">DNA (SHA-256)</p>
                        <p className="text-[10px] text-slate-600 truncate font-mono tracking-tighter">
                            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getIcon = (type: string) => {
    switch (type) {
        case 'hash': return <ShieldCheck size={14} />;
        case 'auth': return <UserCheck size={14} />;
        case 'sign': return <Database size={14} />;
        case 'blockchain': return <LinkIcon size={14} />;
        default: return <ShieldCheck size={14} />;
    }
};