'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Users2, Clock, Star,
  Trash2, HardDrive, Plus, Share2,
  FolderPlus, Upload, FolderUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreateFolderDialog } from './CreateFolderDialog';
// Removed unused useFileUpload import since we use prop now
import { processInputFiles } from '@/utils/file-upload';
import { useQueryClient } from "@tanstack/react-query";

interface SidebarProps {
  activeContext?: string;
  onContextChange?: (context: string) => void;
  currentFolderId?: string | null;

  // DnD Props (Received from Parent)
  draggedId?: string | null;
  dropTargetId?: string | null;
  handleDragOver?: (e: React.DragEvent, targetId: string, isFolder: boolean) => void;
  handleDragLeave?: (e: React.DragEvent) => void;
  handleDrop?: (e: React.DragEvent, targetId: string) => void;

  // Upload Prop
  onUploadFile?: (file: File, parentId?: string) => Promise<void>;
}

const menuItems = [
  { id: 'my-drive', icon: HardDrive, label: "Meu Drive", isDropTarget: true },
  { id: 'shared-drives', icon: Share2, label: "Drives compartilhados", isDropTarget: true },
  { id: 'shared-with-me', icon: Users2, label: "Compartilhados comigo", isDropTarget: false },
  { id: 'recent', icon: Clock, label: "Recentes", isDropTarget: false },
  { id: 'starred', icon: Star, label: "Com estrela", isDropTarget: true },
  { id: 'trash', icon: Trash2, label: "Lixeira", isDropTarget: true },
];

export const DocumentSidebarLeft = ({
  activeContext = 'my-drive',
  onContextChange,
  currentFolderId,
  // Destructure DnD props
  dropTargetId,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  onUploadFile
}: SidebarProps) => {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  // Removed local useFileUpload
  const queryClient = useQueryClient();

  // Force webkitdirectory attribute (React support is inconsistent)
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (onUploadFile) onUploadFile(file, currentFolderId || undefined);
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('[Sidebar] Files selected:', files);
    if (files && files.length > 0) {
      console.log(`[Sidebar] Processing ${files.length} files from input...`);
      // Use processInputFiles to handle recursion and filtering
      processInputFiles(files, currentFolderId || undefined, async (file, parentId) => {
        if (onUploadFile) await onUploadFile(file, parentId);
      }).then(() => {
        // Invalidate queries to refresh list
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['directories'] });
      });
    }
    // Reset input
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: "", directory: "" } as any)}
        multiple
        onChange={handleFolderUpload}
        className="hidden"
      />

      {/* Botão Novo com Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-orange-50 gap-3 px-6 h-12 rounded-2xl transition-all w-full">
            <Plus className="text-[#f97316]" size={24} />
            <span className="font-semibold">Novo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setIsCreateFolderOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>Nova pasta</span>
            <span className="ml-auto text-xs text-muted-foreground">Alt+C, depois F</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload de arquivo</span>
            <span className="ml-auto text-xs text-muted-foreground">Alt+C, depois U</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
            <FolderUp className="mr-2 h-4 w-4" />
            <span>Upload de pasta</span>
            <span className="ml-auto text-xs text-muted-foreground">Alt+C, depois I</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Criar Pasta - Controlado por estado */}
      <CreateFolderDialog
        parentDirectoryId={currentFolderId || undefined}
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onSuccess={() => {
          console.log('Pasta criada!');
        }}
      />

      {/* Menu de Navegação */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = activeContext === item.id;
          const isDropTarget = dropTargetId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onContextChange?.(item.id)}

              // Drag & Drop Handlers (Only if passed and item is target)
              onDragOver={(e) => (item.isDropTarget && handleDragOver) ? handleDragOver(e, item.id, true) : undefined}
              onDragLeave={(item.isDropTarget && handleDragLeave) ? handleDragLeave : undefined}
              onDrop={(e) => (item.isDropTarget && handleDrop) ? handleDrop(e, item.id) : undefined}

              className={`flex items-center gap-4 px-4 py-2 rounded-full cursor-pointer transition-all border border-transparent ${isActive
                ? "bg-orange-50 text-[#f97316] font-bold"
                : isDropTarget
                  ? "bg-blue-50 border-blue-200 text-blue-700 scale-105 shadow-sm" // Drop Feedback
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <item.icon size={20} className={isActive ? "text-[#f97316]" : isDropTarget ? "text-blue-600" : "text-slate-500"} />
              <span className="text-sm">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Indicador de Armazenamento */}
      <div className="px-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Armazenamento</span>
        </div>
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className="bg-[#f97316] h-full w-[65%]" />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">24,35 GB de 4 TB usados</p>
      </div>
    </div>
  );
};