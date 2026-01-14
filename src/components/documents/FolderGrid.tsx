import React from "react";
import { Folder, MoreVertical, Download, Pencil, FolderInput, Trash2, Zap, UserPlus, Info, Link2, Search, ArrowRight, CornerUpRight, Star, ShieldAlert, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
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
// Removed useDragAndDrop import
import { DocumentItem } from "./DocumentList";

interface FolderGridProps {
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

// Sub-componente para gerenciar lógica de clique
const FolderCard = ({
  folder,
  isSelected,
  isDropTarget,
  isDraggingMe,
  onSelect,
  onNavigate,
  onMoveRequest,
  onShareRequest,
  dndHandlers
}: {
  folder: DocumentItem,
  isSelected: boolean,
  isDropTarget: boolean,
  isDraggingMe: boolean,
  onSelect: (id: string) => void;
  onNavigate?: (id: string) => void;
  onMoveRequest: (id: string) => void;
  onShareRequest: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dndHandlers: Record<string, any>;
}) => {
  const canEdit = true;
  const canShare = true;

  // Implementação Padrão "Google Drive" (Estados Não Excludentes)
  // onClick -> Seleciona imediatamente
  // onDoubleClick -> Navega (se for pasta)

  return (
    <div
      draggable
      {...dndHandlers}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(folder.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (onNavigate) onNavigate(folder.id);
      }}
      className={`
        group relative p-4 rounded-xl transition-all cursor-pointer border
        ${isSelected
          ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-300"
          : isDropTarget
            ? "bg-blue-100 border-blue-300 shadow-md ring-2 ring-blue-400 scale-[1.02]"
            : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
        }
        ${isDraggingMe ? "opacity-40" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <Folder
          size={40}
          className={`${isSelected || isDropTarget ? "fill-blue-500 text-blue-600" : "fill-slate-400 text-slate-500 group-hover:fill-blue-400 group-hover:text-blue-500"} transition-colors`}
        />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 text-slate-500 rounded-full">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 py-2 shadow-xl border-slate-200">
              <DropdownMenuItem className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                <Download size={18} className="text-slate-500" /> Baixar
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!canEdit} className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                <Pencil size={18} className="text-slate-500" /> Renomear
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-2 text-[#f97316] font-bold">
                <Zap size={18} className="fill-[#f97316]" /> Resuma esta pasta
                <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Novo</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Compartilhar */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!canShare} className="gap-3 py-2 cursor-pointer font-medium text-slate-700" onClick={(e) => { e.stopPropagation(); onShareRequest(folder.id); }}>
                  <UserPlus size={18} className="text-slate-500" /> Compartilhar
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 shadow-xl">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShareRequest(folder.id); }}>Compartilhar</DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 font-medium">
                    <Link2 size={16} className="text-slate-500" /> Copiar link
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Organizar */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!canEdit} className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                  <FolderInput size={18} className="text-slate-500" /> Organizar
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 shadow-xl">
                  <DropdownMenuItem className="gap-2 flex justify-between font-medium" onClick={(e) => { e.stopPropagation(); onMoveRequest(folder.id); }}>
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

                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Cor da pasta</div>
                  <div className="grid grid-cols-6 gap-1.5 p-2">
                    {[
                      "#ac725e", "#d06b64", "#f83a22", "#fa573c", "#ff7537", "#ffad46",
                      "#fbe983", "#fad165", "#92e1c0", "#42d692", "#16a765", "#7bd148",
                      "#b3dcfd", "#4986e7", "#2acaea", "#9f54e7", "#c27ba0", "#a4c2f4"
                    ].map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-all shadow-sm border border-black/5"
                        style={{ backgroundColor: color }}
                        onClick={(e) => { e.stopPropagation(); /* Logic to change color */ }}
                        title={color}
                      />
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Informações da pasta */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer font-medium text-slate-700">
                  <Info size={18} className="text-slate-500" /> Informações da pasta
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
                  <DropdownMenuItem className="gap-2 font-medium">
                    <Search size={16} className="text-slate-500" /> Pesquisar em {folder.name}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={!canEdit} className="text-red-600 gap-3 py-2 flex justify-between font-bold hover:bg-red-50">
                <div className="flex items-center gap-3"><Trash2 size={18} className="text-red-500" /> Mover para lixeira</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="font-medium text-sm text-slate-700 truncate pr-6">
        {folder.name}
      </div>
    </div>
  );
};

export const FolderGrid = ({
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
}: FolderGridProps) => {
  // Filtrar apenas pastas
  const folders = items.filter(item => item.type === 'folder');

  if (folders.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((folder) => {
        const isSelected = selectedId === folder.id;
        const isDraggingMe = draggedId === folder.id;
        const isDropTarget = dropTargetId === folder.id;

        const dndHandlers = {
          draggable: true,
          onDragStart: (e: React.DragEvent) => handleDragStart?.(e, folder.id),
          onDragOver: (e: React.DragEvent) => handleDragOver?.(e, folder.id, true),
          onDragLeave: handleDragLeave,
          onDrop: (e: React.DragEvent) => handleDrop?.(e, folder.id)
        };

        return (
          <FolderCard
            key={folder.id}
            folder={folder}
            isSelected={isSelected}
            isDropTarget={isDropTarget}
            isDraggingMe={isDraggingMe}
            onSelect={onSelect}
            onNavigate={onNavigate}
            onMoveRequest={onMoveRequest}
            onShareRequest={onShareRequest}
            dndHandlers={dndHandlers}
          />
        );
      })}
    </div>
  );
};