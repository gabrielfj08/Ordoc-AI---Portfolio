"use client";

import { Bell, FileSignature, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { usePendingSignatureRequests } from "@/hooks/queries/useSignature";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const NotificationCenter = () => {
    const router = useRouter();
    const { data: pendingRequests, isLoading } = usePendingSignatureRequests();

    const notifications = pendingRequests || [];
    const hasNotifications = notifications.length > 0;

    const handleNotificationClick = (requestId: string) => {
        router.push(`/signature?request=${requestId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative ml-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors outline-none">
                <Bell size={22} className="text-slate-600" strokeWidth={2.5} />
                {hasNotifications && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-96 p-2 rounded-3xl border-slate-100 shadow-2xl max-h-[500px] overflow-y-auto">
                <div className="p-4 border-b border-slate-50">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Notificações</h3>
                    {hasNotifications && (
                        <p className="text-[10px] text-slate-500 mt-1">
                            {notifications.length} {notifications.length === 1 ? 'assinatura pendente' : 'assinaturas pendentes'}
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-4">
                        <div className="flex gap-4 animate-pulse">
                            <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                            <div className="flex-1">
                                <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                                <div className="h-2 bg-slate-200 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-medium text-slate-500">Nenhuma notificação</p>
                        <p className="text-[10px] text-slate-400 mt-1">Você está em dia com suas assinaturas</p>
                    </div>
                ) : (
                    <>
                        {notifications.map((request) => {
                            const createdAt = request.created_at ? new Date(request.created_at) : new Date();
                            const timeAgo = formatDistanceToNow(createdAt, {
                                addSuffix: true,
                                locale: ptBR
                            });

                            return (
                                <DropdownMenuItem
                                    key={request.id}
                                    className="p-4 flex gap-4 cursor-pointer hover:bg-slate-50 rounded-2xl outline-none group"
                                    onClick={() => handleNotificationClick(request.id)}
                                >
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                                        <FileSignature size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">
                                            {request.title || request.document_name || 'Solicitação de Assinatura'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">
                                            {request.message || request.description || 'Documento aguardando sua assinatura'}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                            <Clock size={10} />
                                            <span>{timeAgo}</span>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}

                        <DropdownMenuSeparator />

                        <div
                            className="p-3 text-center cursor-pointer hover:bg-slate-50 rounded-2xl transition-colors"
                            onClick={() => router.push('/signature')}
                        >
                            <p className="text-xs font-semibold text-orange-600">Ver todas as assinaturas</p>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};