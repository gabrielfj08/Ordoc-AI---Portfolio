"use client";

import { useState } from "react";
import {
    FileCheck, Clock, AlertCircle, ShieldCheck,
    ArrowUpRight, Filter, Search as SearchIcon, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    useMySignatureRequests,
    usePendingSignatureRequests,
    useSignatureRequests,
} from "@/hooks/queries/useSignature";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "next/navigation";

interface SignatureDashboardProps {
    onNew: () => void;
    onViewRequest?: (id: string) => void;
}

export const SignatureDashboard = ({ onNew, onViewRequest }: SignatureDashboardProps) => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q")?.toLowerCase() || "";

    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

    // Buscar dados reais do backend
    const { data: myRequestsData, isLoading: isLoadingMy } = useMySignatureRequests();
    const { data: pendingData, isLoading: isLoadingPending } = usePendingSignatureRequests();

    const { data: allRequestsData, isLoading: isLoadingAll } = useSignatureRequests({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
        page_size: 50,
    });

    // Dados agregados
    const myRequests = myRequestsData?.results || [];
    const pendingRequests = pendingData?.results || [];
    const allRequests = allRequestsData?.results || [];

    // Estatísticas calculadas
    const stats = {
        awaitingMe: pendingRequests.filter(r => r.status === 'pending').length,
        awaitingOthers: allRequests.filter(r => r.status === 'in_progress').length,
        completedThisMonth: allRequests.filter(r => {
            if (r.status !== 'completed' || !r.completed_at) return false;
            const completedDate = new Date(r.completed_at);
            const now = new Date();
            return completedDate.getMonth() === now.getMonth() &&
                completedDate.getFullYear() === now.getFullYear();
        }).length,
        totalSealed: allRequests.filter(r => r.status === 'completed').length,
    };

    // Filtrar requests por busca
    const filteredRequests = allRequests.filter(request => {
        if (!searchQuery) return true;

        const matchesTitle = request.title?.toLowerCase().includes(searchQuery);
        const matchesDescription = request.description?.toLowerCase().includes(searchQuery);
        const matchesDocument = request.document_name?.toLowerCase().includes(searchQuery);

        return matchesTitle || matchesDescription || matchesDocument;
    });

    const isLoading = isLoadingMy || isLoadingPending || isLoadingAll;

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string; className: string }> = {
            draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-700' },
            pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
            in_progress: { label: 'Em Progresso', className: 'bg-blue-100 text-blue-700' },
            completed: { label: 'Concluído', className: 'bg-green-100 text-green-700' },
            cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
            expired: { label: 'Expirado', className: 'bg-orange-100 text-orange-700' },
            rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-700' },
        };

        const variant = variants[status] || variants.draft;
        return <Badge className={variant.className}>{variant.label}</Badge>;
    };

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
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-24 animate-pulse" />
                        ))}
                    </>
                ) : (
                    <>
                        <StatCard
                            icon={Clock}
                            label="Aguardando Você"
                            value={stats.awaitingMe.toString()}
                            color="text-orange-600"
                            bg="bg-orange-50"
                        />
                        <StatCard
                            icon={AlertCircle}
                            label="Pendentes com Terceiros"
                            value={stats.awaitingOthers.toString()}
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <StatCard
                            icon={FileCheck}
                            label="Concluídos (Mês)"
                            value={stats.completedThisMonth.toString()}
                            color="text-green-600"
                            bg="bg-green-50"
                        />
                        <StatCard
                            icon={ShieldCheck}
                            label="Documentos Selados"
                            value={stats.totalSealed.toString()}
                            color="text-purple-600"
                            bg="bg-purple-50"
                        />
                    </>
                )}
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
                                    <input
                                        type="text"
                                        placeholder="Filtrar solicitações..."
                                        className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-full text-xs outline-none focus:ring-2 focus:ring-orange-100 w-64"
                                        defaultValue={searchQuery}
                                        onChange={(e) => {
                                            const params = new URLSearchParams(searchParams);
                                            if (e.target.value) {
                                                params.set('q', e.target.value);
                                            } else {
                                                params.delete('q');
                                            }
                                            window.history.pushState({}, '', `?${params.toString()}`);
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => {
                                        const newFilter = statusFilter === 'all' ? 'pending' :
                                            statusFilter === 'pending' ? 'in_progress' :
                                                statusFilter === 'in_progress' ? 'completed' : 'all';
                                        setStatusFilter(newFilter);
                                    }}
                                >
                                    <Filter size={16} />
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-12 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <FileCheck size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-medium">Nenhuma solicitação encontrada</p>
                                <p className="text-sm mt-1">
                                    {searchQuery
                                        ? 'Tente outro termo de busca'
                                        : 'Clique em "Preparar Novo Documento" para começar'}
                                </p>
                            </div>
                        ) : (
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
                                        {filteredRequests.map((request) => (
                                            <ContractRow
                                                key={request.id}
                                                request={request}
                                                onView={() => onViewRequest?.(request.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Painel de Inteligência de Compliance */}
                <aside className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={80} className="text-white" />
                        </div>
                        <h3 className="font-bold mb-2 flex items-center gap-2 relative z-10">
                            <ShieldCheck size={18} className="text-orange-100" />
                            Integridade Blockchain
                        </h3>
                        <p className="text-xs text-orange-50 leading-relaxed mb-4 relative z-10">
                            Todos os documentos finalizados no Ordoc são selados com hash SHA-256 e registrados para auditoria imutável.
                        </p>
                        <Button className="w-full bg-white/20 hover:bg-white/30 border-none text-white text-xs rounded-xl backdrop-blur-sm relative z-10">
                            Verificar Certificado
                        </Button>
                    </div>

                    {stats.awaitingMe > 0 && (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                            <h3 className="font-bold text-orange-800 text-sm mb-3">Alertas da IA Ordoc</h3>
                            <ul className="space-y-4">
                                <li className="text-xs text-orange-700 flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1" />
                                    <span>
                                        Você tem {stats.awaitingMe} {stats.awaitingMe === 1 ? 'documento aguardando' : 'documentos aguardando'} sua assinatura.
                                    </span>
                                </li>
                                {stats.awaitingOthers > 0 && (
                                    <li className="text-xs text-orange-700 flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1" />
                                        <span>
                                            {stats.awaitingOthers} {stats.awaitingOthers === 1 ? 'assinatura pendente' : 'assinaturas pendentes'} de terceiros.
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
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
    request: any;
    onView: () => void;
}

const ContractRow = ({ request, onView }: ContractRowProps) => {
    const progress = request.progress_percentage || 0;
    const highlight = request.status === 'pending';

    const getStatusInfo = (status: string) => {
        const map: Record<string, { label: string; color: string }> = {
            draft: { label: 'Rascunho', color: 'text-gray-600' },
            pending: { label: 'Aguardando Você', color: 'text-orange-600' },
            in_progress: { label: 'Em Progresso', color: 'text-blue-600' },
            completed: { label: 'Concluído', color: 'text-green-600' },
            cancelled: { label: 'Cancelado', color: 'text-red-600' },
            expired: { label: 'Expirado', color: 'text-gray-600' },
            rejected: { label: 'Rejeitado', color: 'text-red-600' },
        };
        return map[status] || map.draft;
    };

    const statusInfo = getStatusInfo(request.status);

    return (
        <tr
            className={`hover:bg-slate-50 transition-colors cursor-pointer ${highlight ? "bg-orange-50/30" : ""}`}
            onClick={onView}
        >
            <td className="px-6 py-4 font-medium text-slate-700">
                <div>
                    <div className="font-semibold">{request.title}</div>
                    {request.document_name && (
                        <div className="text-xs text-slate-400 mt-0.5">{request.document_name}</div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                    <span className={`text-[10px] font-bold uppercase ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex -space-x-2">
                    {request.signers && request.signers.length > 0 ? (
                        <>
                            {request.signers.slice(0, 2).map((signer: any, idx: number) => (
                                <div
                                    key={signer.id || idx}
                                    className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold"
                                    title={signer.full_name}
                                >
                                    {signer.full_name?.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {request.signers.length > 2 && (
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                    +{request.signers.length - 2}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-xs text-slate-400">Nenhum</div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-slate-500 text-xs">
                {formatDistanceToNow(new Date(request.updated_at || request.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                })}
            </td>
            <td className="px-6 py-4 text-right">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-orange-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                >
                    <ArrowUpRight size={18} />
                </Button>
            </td>
        </tr>
    );
};
