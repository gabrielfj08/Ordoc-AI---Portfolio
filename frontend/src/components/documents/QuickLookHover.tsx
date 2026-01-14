"use client";

import {
    FileText, FileSpreadsheet, FileImage, FileBox,
    MoreHorizontal, Eye, Download, Share2, Zap
} from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface QuickLookHoverProps {
    children: React.ReactNode;
    docName: string;
    docType: 'pdf' | 'xlsx' | 'docx' | 'image' | 'zip';
    docSize: string;
    aiRelevance?: number; // 0-100
    aiContext?: string;
    previewUrl?: string;
    onPreview?: () => void;
}

export const QuickLookHover = ({
    children,
    docName,
    docType,
    docSize,
    aiRelevance,
    aiContext,
    previewUrl,
    onPreview
}: QuickLookHoverProps) => {

    // 1. Identificação Iconográfica
    const getIcon = () => {
        switch (docType) {
            case 'pdf': return <FileText className="text-red-500" size={32} />;
            case 'xlsx': return <FileSpreadsheet className="text-green-500" size={32} />;
            case 'image': return <FileImage className="text-blue-500" size={32} />;
            default: return <FileBox className="text-slate-500" size={32} />;
        }
    };

    // 2. Mock de Preview Visual (Snapshot)
    const getPreviewBg = () => {
        if (docType === 'pdf') return "bg-white border-b-4 border-slate-200"; // Simula página branca
        if (docType === 'xlsx') return "bg-emerald-50 border-b-4 border-emerald-200";
        return "bg-slate-100";
    };

    return (
        <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div onClick={(e) => {
                    // Se houver um onPreview e o usuário clicar no trigger, podemos abrir?
                    // O trigger geralmente é o card do arquivo.
                    // O FileGrid já tem onClick para selecionar.
                    // Vamos manter o comportamento do pai para o trigger,
                    // mas podemos adicionar um botão específico no hover se necessário.
                }}>
                    {children}
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                className="w-72 p-0 overflow-hidden border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                side="right"
                align="start"
                sideOffset={16}
            >

                {/* Visual Header (Thumbnail) */}
                <div className={`h-40 w-full relative group flex items-center justify-center overflow-hidden ${getPreviewBg()}`}>

                    {/* Fake Document Content (Miniatura Cognitiva) */}
                    <div className="w-3/4 h-full bg-white shadow-sm border border-slate-100 mt-4 mx-auto p-3 space-y-2 opacity-80 scale-95 group-hover:scale-100 transition-transform duration-500">
                        <div className="w-1/3 h-2 bg-slate-200 rounded-full" />
                        <div className="space-y-1">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                            <div className="w-2/3 h-1.5 bg-slate-100 rounded-full" />
                        </div>
                        {docType === 'xlsx' && (
                            <div className="grid grid-cols-3 gap-1 mt-2">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-2 bg-emerald-100 rounded-sm" />)}
                            </div>
                        )}
                        {docType === 'image' && (
                            <div className="w-full h-16 bg-blue-50 rounded-md mt-2" />
                        )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 backdrop-blur-[1px]">
                        <div className="flex gap-2 scale-90 group-hover:scale-100 transition-all delay-75">
                            <Button
                                size="icon"
                                className="rounded-full h-9 w-9 bg-white text-slate-700 hover:bg-slate-100 shadow-lg border border-slate-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPreview?.();
                                }}
                            >
                                <Eye size={16} />
                            </Button>
                            <Button size="icon" className="rounded-full h-9 w-9 bg-slate-900 text-white hover:bg-slate-800 shadow-lg border border-slate-800">
                                <Download size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Badge de Relevância IA */}
                    {aiRelevance && (
                        <div className="absolute top-2 right-2 flex gap-1">
                            <Badge className={`border-none shadow-sm ${aiRelevance > 80 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500"
                                }`}>
                                {aiRelevance}% Relevante
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 bg-white">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                            {getIcon()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-sm text-slate-800 truncate" title={docName}>{docName}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{docSize} • {docType.toUpperCase()}</p>
                        </div>
                    </div>

                    {/* AI Context Analysis */}
                    {aiContext && (
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 flex gap-2 items-start mt-2">
                            <Zap size={14} className="text-purple-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-purple-700 leading-relaxed font-medium">
                                {aiContext}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-slate-400">Valido pela IA Ordoc</span>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-7 w-7"><Share2 size={14} /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal size={14} /></Button>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
