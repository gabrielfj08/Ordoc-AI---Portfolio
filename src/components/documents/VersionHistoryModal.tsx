"use client";

import React from "react";
import { X, Download, Eye, RotateCcw, Clock, User, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentVersion } from "@/types/document";

interface VersionHistoryModalProps {
    documentName: string;
    currentVersion: number;
    versions: DocumentVersion[];
    isOpen: boolean;
    onClose: () => void;
    onRestore?: (version: number) => void;
    onDownload?: (version: number) => void;
    onPreview?: (version: number) => void;
}

export function VersionHistoryModal({
    documentName,
    currentVersion,
    versions,
    isOpen,
    onClose,
    onRestore,
    onDownload,
    onPreview
}: VersionHistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Histórico de Versões</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">{documentName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Version List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {versions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Clock size={48} className="mb-4 text-slate-300" />
                            <p className="text-sm font-medium">Nenhuma versão anterior disponível</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version) => {
                                const isCurrent = version.version === currentVersion;

                                return (
                                    <div
                                        key={version.version}
                                        className={`border rounded-lg p-4 transition-all ${isCurrent
                                                ? "border-[#f97316] bg-orange-50/50"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-sm font-bold ${isCurrent ? "text-[#f97316]" : "text-slate-700"
                                                        }`}>
                                                        Versão {version.version}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f97316] text-white">
                                                            Atual
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock size={14} className="text-slate-400" />
                                                        <span>{version.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <User size={14} className="text-slate-400" />
                                                        <span>{version.author}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <HardDrive size={14} className="text-slate-400" />
                                                        <span>{version.size}</span>
                                                    </div>
                                                    {version.hash && (
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <span className="text-[10px] font-mono text-slate-400">
                                                                SHA: {version.hash.substring(0, 8)}...
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {version.comment && (
                                                    <p className="text-xs text-slate-600 mt-2 italic">
                                                        "{version.comment}"
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 ml-4">
                                                {onPreview && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onPreview(version.version)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                        title="Visualizar"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                )}
                                                {onDownload && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDownload(version.version)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-green-600 hover:bg-green-50"
                                                        title="Baixar"
                                                    >
                                                        <Download size={16} />
                                                    </Button>
                                                )}
                                                {!isCurrent && onRestore && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRestore(version.version)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-[#f97316] hover:bg-orange-50"
                                                        title="Restaurar"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-slate-200 bg-slate-50">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}
