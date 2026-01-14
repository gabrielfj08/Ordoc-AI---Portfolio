"use client";

import { Bell, Zap, AlertCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const NotificationCenter = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative ml-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors outline-none">
                <Bell size={22} className="text-slate-600" strokeWidth={2.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-2 rounded-3xl border-slate-100 shadow-2xl">
                <div className="p-4 border-b border-slate-50">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Alertas de IA Ordoc</h3>
                </div>

                <DropdownMenuItem className="p-4 flex gap-4 cursor-pointer hover:bg-slate-50 rounded-2xl outline-none group">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                        <Zap size={18} className="fill-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">Intervenção necessária em #P2</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">Certidão Negativa expirada detectada automaticamente.</p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-4 flex gap-4 cursor-pointer hover:bg-slate-50 rounded-2xl outline-none group">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">SLA Expirado: Licitação #04</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">O prazo de revisão jurídica foi ultrapassado.</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};