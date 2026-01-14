"use client";

import * as React from "react";
import {
  FileText, MoreVertical, Folder, ChevronUp, Share2, Download,
  Pencil, FolderInput, Star, Trash2, Zap,
  UserPlus, Info, Link2,
  ShieldAlert, Activity, Search, CornerUpRight, ArrowRight,
  FileSignature
} from "lucide-react";
import { QuickLookHover } from "./QuickLookHover";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { useRouter } from "next/navigation";
import { useSignatureStore } from "@/store/signatureStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
// Removed useDragAndDrop

// Importação do hook de permissões planejado
// import { usePermissions } from "@/hooks/usePermissions";

import { DocumentVersion, ICPCertificateInfo } from "@/types/document";

export interface DocumentItem {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  date: string;
  size: string;
  type: 'folder' | 'file';
  parentId?: string | null;
  permissions: unknown[]; // Usando unknown[] para evitar 'any', ideal seria importar o tipo Permission
  health?: 'healthy' | 'warning' | 'critical';

  // Versionamento
  version?: number;
  versionHistory?: DocumentVersion[];

  // Taxonomia e Metadados
  tags?: string[];
  category?: string;
  metadata?: Record<string, string>;

  // Full-Text Search
  contentPreview?: string;

  // ICP-Brasil
  icpCertificate?: ICPCertificateInfo;
}

interface DocumentListProps {
  items: DocumentItem[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  onMoveRequest: (id: string) => void;
  onShareRequest: (id: string) => void;
  onNavigate?: (folderId: string) => void;

  // DnD Props
  draggedId?: string | null;
  dropTargetId?: string | null;
  handleDragStart?: (e: React.DragEvent, id: string) => void;
  handleDragOver?: (e: React.DragEvent, targetId: string, isFolder: boolean) => void;
  handleDragLeave?: (e: React.DragEvent) => void;
  handleDrop?: (e: React.DragEvent, targetId: string) => void;
}

export const DocumentList = ({
  items,
  onSelect,
  selectedId,
  onMoveRequest,
  onShareRequest,
  onNavigate,
  // DnD Props
  draggedId,
  dropTargetId,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop
}: DocumentListProps) => {

  const [previewDoc, setPreviewDoc] = React.useState<DocumentItem | null>(null);

  const folderColors = [
    '#ac725e', '#d06b64', '#f83a22', '#fa573c', '#ff7537', '#ffad46',
    '#fbe983', '#fad165', '#92e1c0', '#42d692', '#16a765', '#7bd148'
  ];

  return (
    <div className="w-full bg-white select-none">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-[13px] text-slate-700 font-medium">
            <th className="px-4 py-2 hover:bg-slate-50 cursor-pointer w-[40%] group font-semibold">
              <div className="flex items-center gap-1">
                Nome <ChevronUp size={14} className="text-blue-600" />
              </div>
            </th>
            <th className="px-4 py-2 hidden md:table-cell w-[15%]">Proprietário</th>
            <th className="px-4 py-2 hidden lg:table-cell w-[20%] text-center">Última modificação</th>
            <th className="px-4 py-2 hidden md:table-cell w-[10%] text-center">Tamanho</th>
            <th className="px-4 py-2 text-right w-[15%] font-semibold">Classificação</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <DocumentRow
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              isDropTarget={dropTargetId === item.id}
              isDraggingMe={draggedId === item.id}
              onSelect={onSelect}
              onNavigate={onNavigate}
              onMoveRequest={onMoveRequest}
              onShareRequest={onShareRequest}
              folderColors={folderColors}
              onPreview={() => setPreviewDoc(item)}
              dndHandlers={{
                onDragStart: (e: React.DragEvent) => handleDragStart?.(e, item.id),
                onDragOver: (e: React.DragEvent) => handleDragOver?.(e, item.id, item.type === 'folder'),
                onDragLeave: handleDragLeave,
                onDrop: (e: React.DragEvent) => handleDrop?.(e, item.id)
              }}
            />
          ))}
        </tbody>
      </table>

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

interface DocumentRowProps {
  item: DocumentItem;
  isSelected: boolean;
  isDropTarget: boolean;
  isDraggingMe: boolean;
  onSelect: (id: string) => void;
  onNavigate?: (id: string) => void;
  onMoveRequest: (id: string) => void;
  onShareRequest: (id: string) => void;
  folderColors: string[];
  onPreview?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dndHandlers: Record<string, any>;
}

// Sub-componente Row separado para gerenciar a lógica de clique e estado interno se necessário
const DocumentRow = ({
  item,
  isSelected,
  isDropTarget,
  isDraggingMe,
  onSelect,
  onNavigate,
  onMoveRequest,
  onShareRequest,
  folderColors,
  onPreview,
  dndHandlers
}: DocumentRowProps) => {
  const router = useRouter();
  const { setSelectedFile, setStep, sealedDocuments } = useSignatureStore();
  const canEdit = true;
  const canShare = true;

  // Implementação Padrão "Google Drive" (Estados Não Excludentes)
  // onClick -> Seleciona imediatamente
  // onDoubleClick -> Navega (se for pasta)

  const handleStartEsign = () => {
    // 1. Simula arquivo
    // Em produção, aqui faríamos um fetch do blob
    const dummyFile = new File(["dummy content"], item.name, { type: "application/pdf" });

    // 2. Define na store
    setSelectedFile(dummyFile);
    setStep('prepare');

    // 3. Navega
    router.push('/signature');
  };

  return (
    <tr
      draggable
      {...dndHandlers}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (item.type === 'folder' && onNavigate) {
          onNavigate(item.id);
        }
      }}
      className={`border-b border-slate-100 transition-all group cursor-pointer 
        ${isSelected ? "bg-[#e8f0fe] hover:bg-[#d2e3fc]" : "hover:bg-slate-50"} 
        ${isDropTarget ? "bg-blue-100 ring-2 ring-blue-400 ring-inset" : ""} 
        ${isDraggingMe ? "opacity-40" : ""}
      `}
    >
      <td className="px-4 py-2.5 flex items-center gap-3">
        {item.type === 'folder' ? (
          <>
            <Folder className={isSelected || isDropTarget ? "text-blue-600 fill-blue-600" : "text-slate-500 fill-slate-500"} size={18} />
            <span className={`text-sm truncate max-w-50 ${isSelected ? "text-blue-700 font-medium" : "text-slate-700"}`}>
              {item.name}
            </span>
          </>
        ) : (
          <QuickLookHover
            docName={item.name}
            docType={item.name.endsWith('.pdf') ? 'pdf' : item.name.endsWith('.xlsx') ? 'xlsx' : 'docx'}
            docSize={item.size}
            aiRelevance={item.health === 'critical' ? 20 : item.health === 'warning' ? 65 : 95}
            aiContext={item.health === 'critical' ? "Risco Crítico Identificado" : "Conteúdo verificado pela IA"}
            onPreview={onPreview}
          >
            <div className="flex items-center gap-3">
              <FileText className={isSelected ? "text-blue-600" : "text-blue-500"} size={18} />
              <span className={`text-sm truncate max-w-50 ${isSelected ? "text-blue-700 font-medium" : "text-slate-700"}`}>
                {item.name}
              </span>
            </div>
          </QuickLookHover>
        )}

        {/* Status Badge - eSign Integration */}
        {sealedDocuments.some(d => d.name === item.name && d.status === 'in_progress') && (
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 ml-2 animate-in fade-in zoom-in-50 duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-orange-700 uppercase tracking-tight">Em Assinatura</span>
          </div>
        )}
      </td>

      <td className="px-4 py-2.5 hidden md:table-cell text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold uppercase">
            {item.owner.charAt(0)}
          </div>
          {item.owner}
        </div>
      </td>

      <td className="px-4 py-2.5 hidden lg:table-cell text-sm text-slate-600 text-center">{item.date}</td>
      <td className="px-4 py-2.5 hidden md:table-cell text-sm text-slate-600 text-center">{item.size}</td>

      <td className="px-4 py-2.5 text-right relative">
        <div className="flex items-center justify-end gap-1">
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 backdrop-blur-[1px] px-1 rounded-l-md">
            <Button variant="ghost" size="icon" disabled={!canShare} className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Share2 size={15} /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Download size={15} /></Button>
            <Button variant="ghost" size="icon" disabled={!canEdit} className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Pencil size={15} /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Star size={15} /></Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-200 rounded-full" onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 py-2 shadow-xl border-slate-200">

              {/* Opção de Assinatura (NOVO) */}
              {item.type === 'file' && (
                <>
                  <DropdownMenuItem
                    className="gap-3 py-2 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEsign();
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
              <DropdownMenuItem disabled={!canEdit} className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                <Pencil size={18} className="text-slate-500" /> Renomear
                <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+E</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* 3. Resuma (Feature Adsumtec) */}
              <DropdownMenuItem className="gap-3 py-2 text-[#f97316] font-bold">
                <Zap size={18} className="fill-[#f97316]" /> Resuma est{item.type === 'folder' ? 'a pasta' : 'e arquivo'}
                <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Novo</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* 4. Compartilhar */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!canShare} className="gap-3 py-2 cursor-pointer font-medium text-slate-700" onClick={(e) => { e.stopPropagation(); onShareRequest(item.id); }}>
                  <UserPlus size={18} className="text-slate-500" /> Compartilhar
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 shadow-xl">
                  <DropdownMenuItem className="gap-2 font-medium" onClick={(e) => { e.stopPropagation(); onShareRequest(item.id); }}>
                    <UserPlus size={16} className="text-slate-500" /> Compartilhar
                    <span className="ml-auto text-[10px] text-slate-400 font-medium">Ctrl+Alt+A</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 font-medium">
                    <Link2 size={16} className="text-slate-500" /> Copiar link
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* 5. Organizar */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!canEdit} className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                  <FolderInput size={18} className="text-slate-500" /> Organizar
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 shadow-xl">
                  <DropdownMenuItem className="gap-2 flex justify-between font-medium" onClick={(e) => { e.stopPropagation(); onMoveRequest(item.id); }}>
                    <div className="flex items-center gap-2"><ArrowRight size={16} className="text-slate-500" /> Mover</div>
                    <span className="text-[10px] text-slate-400 font-medium">Ctrl+Alt+M</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="gap-2 flex justify-between font-medium">
                    <div className="flex items-center gap-2"><CornerUpRight size={16} className="text-slate-500" /> Adicionar atalho</div>
                    <span className="text-[10px] text-slate-400 font-medium">Ctrl+Alt+R</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="gap-2 flex justify-between font-medium">
                    <div className="flex items-center gap-2"><Star size={16} className="text-slate-500" /> Adicionar a &quot;Com estrela&quot;</div>
                    <span className="text-[10px] text-slate-400 font-medium">Ctrl+Alt+S</span>
                  </DropdownMenuItem>

                  {item.type === 'folder' && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Cor da pasta</div>
                      <div className="grid grid-cols-6 gap-1.5 p-2">
                        {folderColors.map((color: string) => (
                          <div key={color} className="w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-all shadow-sm border border-black/5" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* 6. Informações */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                  <Info size={18} className="text-slate-500" /> Informações d{item.type === 'folder' ? 'a pasta' : 'o arquivo'}
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
                  {item.type === 'folder' && (
                    <DropdownMenuItem className="gap-2 font-medium">
                      <Search size={16} className="text-slate-500" /> Pesquisar em {item.name}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              {/* 7. Lixeira */}
              <DropdownMenuItem disabled={!canEdit} className="text-red-600 gap-3 py-2 flex justify-between group cursor-pointer font-bold hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Mover para lixeira", item.id);
                }}
              >
                <div className="flex items-center gap-3"><Trash2 size={18} className="text-red-500" /> Mover para lixeira</div>
                <span className="text-[10px] text-red-400 group-hover:text-red-600 font-bold uppercase">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};