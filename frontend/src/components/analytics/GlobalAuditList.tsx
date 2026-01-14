"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Shield,
    Search,
    Download,
    Filter,
    CheckCircle2,
    XCircle,
    TrendingUp,
    User,
    Calendar,
    MapPin,
    Monitor,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditEntry {
    id: string;
    timestamp: Date;
    user: {
        id: string;
        name: string;
        email: string;
    };
    action: "create" | "read" | "update" | "delete" | "sign" | "share" | "download";
    resource: {
        type: "document" | "process" | "user" | "setting";
        id: string;
        name: string;
    };
    metadata: {
        ip: string;
        location: string;
        device: string;
        success: boolean;
        reason?: string;
    };
    hash: string;
}

// Mock data
const mockAuditData: AuditEntry[] = [
    {
        id: "1",
        timestamp: new Date("2026-01-12T15:30:00"),
        user: { id: "u1", name: "Ana Silva", email: "ana.silva@ordoc.ai" },
        action: "sign",
        resource: { type: "document", id: "doc123", name: "Contrato de Prestação de Serviços #042" },
        metadata: { ip: "192.168.1.100", location: "São Paulo, SP", device: "Chrome 120 / Windows 11", success: true },
        hash: "a7f3c9e2d1b4f8a6c3e5d7b9f2a4c6e8",
    },
    {
        id: "2",
        timestamp: new Date("2026-01-12T14:45:00"),
        user: { id: "u2", name: "Carlos Mendes", email: "carlos.mendes@ordoc.ai" },
        action: "download",
        resource: { type: "document", id: "doc456", name: "Licitação Pública #2024-001" },
        metadata: { ip: "10.0.0.50", location: "Brasília, DF", device: "Firefox 121 / macOS 14", success: true },
        hash: "b8e4d0f3e2c5a9b7d1f4e6c8a2b5d7f9",
    },
    {
        id: "3",
        timestamp: new Date("2026-01-12T14:20:00"),
        user: { id: "u3", name: "Maria Santos", email: "maria.santos@ordoc.ai" },
        action: "delete",
        resource: { type: "document", id: "doc789", name: "Rascunho - NDA Empresa XYZ" },
        metadata: { ip: "172.16.0.25", location: "Rio de Janeiro, RJ", device: "Edge 120 / Windows 11", success: false, reason: "Permissão negada - documento em uso" },
        hash: "c9f5e1a4d3b6c8e2f7a9d1b4c6e8f2a5",
    },
];

const actionLabels = {
    create: "Criação",
    read: "Leitura",
    update: "Atualização",
    delete: "Exclusão",
    sign: "Assinatura",
    share: "Compartilhamento",
    download: "Download",
};

export const GlobalAuditList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const filteredData = mockAuditData.filter((entry) => {
        const matchesSearch =
            entry.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.metadata.ip.includes(searchTerm);
        const matchesAction = !selectedAction || entry.action === selectedAction;
        return matchesSearch && matchesAction;
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-600 rounded-lg">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">
                                Trilha de Auditoria Global
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                Registro imutável de todas as ações críticas do sistema
                            </p>
                        </div>
                    </div>


                </div>
            </CardHeader>

            <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Buscar por usuário, documento, IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            size="sm"
                            onClick={() => setSelectedAction(null)}
                            className={`whitespace-nowrap ${selectedAction === null
                                    ? "bg-orange-600 text-white hover:bg-orange-700"
                                    : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                                }`}
                        >
                            Todas
                        </Button>
                        {Object.entries(actionLabels).map(([action, label]) => (
                            <Button
                                key={action}
                                size="sm"
                                onClick={() => setSelectedAction(action)}
                                className={`whitespace-nowrap ${selectedAction === action
                                        ? "bg-orange-600 text-white hover:bg-orange-700"
                                        : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                                    }`}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Audit List */}
                <div className="space-y-3">
                    {filteredData.map((entry) => {
                        return (
                            <div
                                key={entry.id}
                                className="p-4 border border-orange-200 rounded-lg bg-orange-50 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                                            <TrendingUp size={18} className="text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-slate-800 text-sm">
                                                    {actionLabels[entry.action]}
                                                </h4>
                                                <Badge
                                                    className={`text-xs ${entry.metadata.success
                                                        ? "bg-orange-100 text-orange-700 border-orange-200"
                                                        : "bg-red-100 text-red-700 border-red-200"
                                                        }`}
                                                >
                                                    {entry.metadata.success ? (
                                                        <>
                                                            <CheckCircle2 size={12} className="mr-1" />
                                                            Sucesso
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={12} className="mr-1" />
                                                            Falha
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">{entry.resource.name}</p>

                                            {!entry.metadata.success && entry.metadata.reason && (
                                                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 mb-2">
                                                    <strong>Motivo:</strong> {entry.metadata.reason}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <User size={12} />
                                                    <span>{entry.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    <span>{formatDate(entry.timestamp)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} />
                                                    <span>{entry.metadata.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Monitor size={12} />
                                                    <span className="truncate">{entry.metadata.device}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hash de Integridade */}
                                <div className="mt-3 pt-3 border-t border-orange-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} className="text-orange-600" />
                                            <span className="text-xs text-slate-500">Hash de Integridade:</span>
                                            <code className="text-xs font-mono bg-orange-100 px-2 py-0.5 rounded text-orange-700">
                                                {entry.hash}
                                            </code>
                                        </div>
                                        <span className="text-xs text-slate-400">IP: {entry.metadata.ip}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <Shield className="mx-auto text-slate-300 mb-3" size={48} />
                        <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
                        <p className="text-sm text-slate-400 mt-1">Tente ajustar os filtros de busca</p>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-2">
                        <Shield size={16} className="text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-orange-800 mb-1">Garantia de Imutabilidade</h4>
                            <p className="text-xs text-orange-700">
                                Todos os registros são protegidos por hash criptográfico SHA-256 e armazenados de forma imutável.
                                Qualquer tentativa de alteração invalidará o hash e será detectada automaticamente.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
