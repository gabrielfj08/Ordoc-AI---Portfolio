"use client";

import {
    FileCheck, Clock, AlertCircle, ShieldCheck,
    ArrowUpRight, Filter, Search as SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureDashboardProps {
    onNew: () => void;
}

export const SignatureDashboard = ({ onNew }: SignatureDashboardProps) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Cabeçalho de Ação Imediata */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Assinaturas e-Sign</h1>
                    <p className="text-slate-500 text-sm">Controle de validade jurídica e fluxos de assinatura em tempo real.</p>
                </div>
                <Button
                    onClick={onNew}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-orange-200 transition-all hover:scale-105"
                >
                    + Preparar Novo Documento
                </Button>
            </header>

            {/* Cards de Métricas de Negócio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Clock} label="Aguardando Você" value="3" color="text-orange-600" bg="bg-orange-50" />
                <StatCard icon={AlertCircle} label="Pendentes com Terceiros" value="12" color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={FileCheck} label="Concluídos (Mês)" value="45" color="text-green-600" bg="bg-green-50" />
                <StatCard icon={ShieldCheck} label="Documentos Selados" value="158" color="text-purple-600" bg="bg-purple-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tabela de Fluxos Ativos */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Fluxos de Assinatura Ativos</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" placeholder="Filtrar contratos..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-xs outline-none focus:ring-2 focus:ring-orange-100 w-64" />
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full"><Filter size={16} /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Documento</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Signatários</th>
                                        <th className="px-6 py-4">Última Atividade</th>
                                        <th className="px-6 py-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <ContractRow name="Contrato de Parceria - Adsum" status="Em Progresso" progress={66} date="Hoje, 14:20" />
                                    <ContractRow name="NDA - Projeto Alpha" status="Aguardando Você" progress={0} date="Ontem" highlight />
                                    <ContractRow name="Termo de Uso - v2" status="Concluído" progress={100} date="2 Jan, 2026" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Painel de Inteligência de Compliance */}
                <aside className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={80} className="text-white" />
                        </div>
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-orange-100" />
                            Integridade Blockchain
                        </h3>
                        <p className="text-xs text-orange-50 leading-relaxed mb-4">
                            Todos os documentos finalizados no Ordoc são selados com hash SHA-256 e registrados para auditoria imutável.
                        </p>
                        <Button className="w-full bg-white/20 hover:bg-white/30 border-none text-white text-xs rounded-xl backdrop-blur-sm">
                            Verificar Certificado
                        </Button>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                        <h3 className="font-bold text-orange-800 text-sm mb-3">Alertas da IA Ordoc</h3>
                        <ul className="space-y-4">
                            <li className="text-xs text-orange-700 flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1" />
                                <span>3 contratos vencem em menos de 15 dias. Deseja criar termos de aditamento?</span>
                            </li>
                            <li className="text-xs text-orange-700 flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1" />
                                <span>Assinatura pendente do CEO da &quot;Empresa X&quot; há 4 dias. Enviar lembrete inteligente?</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

// Sub-componentes
interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    color: string;
    bg: string;
}

const StatCard = ({ icon: Icon, label, value, color, bg }: StatCardProps) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

interface ContractRowProps {
    name: string;
    status: string;
    progress: number;
    date: string;
    highlight?: boolean;
}

const ContractRow = ({ name, status, progress, date, highlight }: ContractRowProps) => (
    <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${highlight ? "bg-orange-50/30" : ""}`}>
        <td className="px-6 py-4 font-medium text-slate-700">{name}</td>
        <td className="px-6 py-4">
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">{status}</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">+2</div>
            </div>
        </td>
        <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
        <td className="px-6 py-4 text-right">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-600"><ArrowUpRight size={18} /></Button>
        </td>
    </tr>
);
