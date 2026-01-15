"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  MoreVertical, FileText, FileType, FileArchive, UserPlus, FolderInput, Link2, Trash2,
  Download, Pencil, Zap, ArrowRight, CornerUpRight, Star, Info, ShieldAlert, Activity,
  ShieldCheck, AlertTriangle, XCircle, FileSignature
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignatureStore } from "@/store/signatureStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { DocumentItem } from "./DocumentList";
import { QuickLookHover } from "./QuickLookHover";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { FileThumbnail } from "./FileThumbnail";
import { useState } from "react";

interface FileGridProps {
  items: DocumentItem[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  onMoveRequest: (id: string) => void;
  onShareRequest: (id: string) => void;
  onMoveItems?: (sourceIds: string[], targetId: string) => void;
  onDelete?: (id: string) => void;
  draggedId?: string | null;
  handleDragStart?: (e: React.DragEvent, id: string) => void;
}

export const FileGrid = ({ items, onSelect, selectedId, onMoveRequest, onShareRequest, draggedId, handleDragStart, onDelete }: FileGridProps) => {
  const router = useRouter();
  const { setSelectedFile, setStep, sealedDocuments } = useSignatureStore();
  const files = items.filter(item => item.type === 'file');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const handleStartEsign = (item: DocumentItem) => {
    // 1. Simula arquivo
    const dummyFile = new File(["dummy content"], item.name, { type: "application/pdf" });

    // 2. Define na store
    setSelectedFile(dummyFile);
    setStep('prepare');

    // 3. Navega
    router.push('/signature');
  };

  // Funções auxiliares para o Heatmap de Compliance
  const getHealthStyles = (health?: string) => {
    switch (health) {
      case 'healthy': return 'hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]';
      case 'warning': return 'border-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.1)] animate-pulse-subtle hover:border-orange-400';
      case 'critical': return 'border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:border-red-500';
      default: return 'border-slate-200 hover:shadow-md';
    }
  };

  const getHealthIcon = (health?: string) => {
    switch (health) {
      case 'healthy': return <ShieldCheck size={14} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-orange-500" />;
      case 'critical': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {files.map((file) => {
        const isSelected = selectedId === file.id;
        const isPdf = file.name.toLowerCase().endsWith('.pdf');
        const isZip = file.name.toLowerCase().endsWith('.zip');
        const isDraggingMe = draggedId === file.id;

        const aiContext = file.health === 'critical' ? "Documento contém riscos críticos de conformidade." :
          file.health === 'warning' ? "Revisão sugerida: Cláusulas padrão ausentes." :
            "Documento validado e seguro.";

        const aiRelevance = file.health === 'critical' ? 20 :
          file.health === 'warning' ? 65 :
            98;

        return (
          <QuickLookHover
            key={file.id}
            docName={file.name}
            docType={isPdf ? 'pdf' : isZip ? 'zip' : 'docx'}
            docSize={file.size}
            aiRelevance={aiRelevance}
            aiContext={aiContext}
            onPreview={() => setPreviewDoc(file)}
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart?.(e, file.id)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(file.id);
              }}
              className={`
              bg-white rounded-xl overflow-hidden transition-all cursor-pointer group border
              ${isSelected
                  ? "ring-2 ring-blue-500 shadow-md border-blue-500"
                  : getHealthStyles(file.health)
                }
              ${isDraggingMe ? "opacity-40" : ""}
            `}
            >
              {/* Cabeçalho do Card */}
              <div className={`p-2.5 flex items-center justify-between border-b ${isSelected ? "bg-orange-100 border-orange-200" : "bg-orange-50/50 border-orange-100/50"}`}>
                <div className="flex items-center gap-2 truncate">
                  {isPdf ? (
                    <FileType className="text-red-500 shrink-0" size={16} />
                  ) : isZip ? (
                    <FileArchive className="text-slate-500 shrink-0" size={16} />
                  ) : (
                    <FileText className="text-blue-500 shrink-0" size={16} />
                  )}
                  <span className={`text-xs font-medium truncate ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                    {file.name}
                  </span>
                  {/* Status Badge for Grid */}
                  {sealedDocuments.some(d => d.name === file.name && d.status === 'in_progress') && (
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 ml-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-orange-700 uppercase tracking-tight">Assinando</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Ícone de Saúde no Cabeçalho */}
                  {!isSelected && getHealthIcon(file.health)}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:bg-slate-200 rounded-full" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 py-2 shadow-xl border-slate-200">

                      {/* Opção de Assinatura (NOVO) */}
                      {true && (
                        <>
                          <DropdownMenuItem
                            className="gap-3 py-2 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEsign(file);
                            }}
                          >
                            <FileSignature size={18} className="text-blue-600" />
                            Preparar Assinatura
                            <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">e-Sign</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      <DropdownMenuItem className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                        <Download size={18} className="text-slate-500" /> Baixar
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                        <Pencil size={18} className="text-slate-500" /> Renomear
                        <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+E</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="gap-3 py-2 text-[#f97316] font-bold">
                        <Zap size={18} className="fill-[#f97316]" /> Resuma este arquivo
                        <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Novo</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer font-medium text-slate-700" onClick={(e) => { e.stopPropagation(); onShareRequest(file.id); }}>
                          <UserPlus size={18} className="text-slate-500" /> Compartilhar
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-64 shadow-xl">
                          <DropdownMenuItem className="gap-2 font-medium" onClick={(e) => { e.stopPropagation(); onShareRequest(file.id); }}>
                            <UserPlus size={16} className="text-slate-500" /> Compartilhar
                            <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+A</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-medium">
                            <Link2 size={16} className="text-slate-500" /> Copiar link
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                          <FolderInput size={18} className="text-slate-500" /> Organizar
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-64 shadow-xl">
                          <DropdownMenuItem className="gap-2 flex justify-between font-medium" onClick={(e) => { e.stopPropagation(); onMoveRequest(file.id); }}>
                            <div className="flex items-center gap-2"><ArrowRight size={16} className="text-slate-500" /> Mover</div>
                            <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+M</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="gap-2 flex justify-between font-medium">
                            <div className="flex items-center gap-2"><CornerUpRight size={16} className="text-slate-500" /> Adicionar atalho</div>
                            <span className="text-[10px] text-slate-400 font-medium">Ctrl+Alt+R</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="gap-2 flex justify-between font-medium">
                            <div className="flex items-center gap-2"><Star size={16} className="text-slate-500" /> Adicionar a &quot;Com estrela&quot;</div>
                            <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+S</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                          <Info size={18} className="text-slate-500" /> Informações do arquivo
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-72 shadow-xl">
                          <DropdownMenuItem className="gap-2 font-medium">
                            <Info size={16} className="text-slate-500" /> Detalhes
                            <span className="ml-auto text-[10px] text-slate-400 font-medium">Alt+V, depois D</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-medium">
                            <ShieldAlert size={16} className="text-slate-500" /> Limitações de segurança
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 font-medium">
                            <Activity size={16} className="text-slate-500" /> Atividade
                            <span className="ml-auto text-[10px] text-slate-400 font-medium">Alt+V, depois A</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="text-red-600 gap-3 py-2 flex justify-between group cursor-pointer font-bold hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); onDelete?.(file.id); }}
                      >
                        <div className="flex items-center gap-3"><Trash2 size={18} className="text-red-500" /> Mover para lixeira</div>
                        <span className="text-[10px] text-red-400 group-hover:text-red-600 font-bold uppercase">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Área de Preview com Status de Compliance Integrado */}
              {/* Área de Preview com Status de Compliance Integrado */}
              <div className={`aspect-4/3 flex items-center justify-center relative overflow-hidden transition-colors border-b-0
                ${file.health === 'critical' ? 'bg-red-50/30' :
                  file.health === 'warning' ? 'bg-orange-50/30' : 'bg-slate-50'}
              `}>
                <FileThumbnail name={file.name} health={file.health as any} />

                {/* Status Badge Overlay */}
                {file.health && (
                  <div className="absolute top-2 right-2">
                    <span className={`text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-full border shadow-sm ${file.health === 'healthy' ? 'bg-white text-green-700 border-green-200' :
                      file.health === 'warning' ? 'bg-white text-orange-700 border-orange-200' :
                        'bg-white text-red-700 border-red-200'
                      }`}>
                      {file.health === 'healthy' ? 'OK' : file.health === 'warning' ? 'Alert' : 'Risco'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </QuickLookHover>
        );
      })}

      {/* Modal de Preview */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          docName={previewDoc.name}
          docType={previewDoc.name.split('.').pop() || 'file'}
        />
      )}
    </div>
  );
};