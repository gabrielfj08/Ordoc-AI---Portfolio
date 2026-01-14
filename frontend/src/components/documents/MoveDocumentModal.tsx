"use client";

import React, { useState } from "react";
import { X, Folder, ChevronRight, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MoveDocumentModalProps {
  itemName: string;
  itemType: "file" | "folder";
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
}

// Mock de estrutura de pastas - substituir por dados reais depois
interface FolderNode {
  id: string;
  name: string;
  icon?: React.ElementType;
  children: FolderNode[];
}

const folderStructure: FolderNode[] = [
  {
    id: 'root',
    name: 'Meu Drive',
    icon: Home,
    children: [
      {
        id: 'f1', name: 'Projetos', children: [
          { id: 'f1-1', name: 'OrdocAI', children: [] },
          { id: 'f1-2', name: 'PriceOps', children: [] },
        ]
      },
      { id: 'f2', name: 'Documentos', children: [] },
      { id: 'f3', name: 'Imagens', children: [] },
      { id: 'f4', name: 'Backup', children: [] },
    ]
  }
];

export function MoveDocumentModal({ itemName, itemType, onClose, onMove }: MoveDocumentModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folders: typeof folderStructure, level = 0): React.ReactNode => {
    return folders.map((folder) => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedFolder === folder.id;
      const hasChildren = folder.children && folder.children.length > 0;
      const Icon = folder.icon || Folder;

      return (
        <div key={folder.id}>
          <div
            onClick={() => {
              setSelectedFolder(folder.id);
              if (hasChildren) toggleFolder(folder.id);
            }}
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg
              transition-colors
              ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'}
            `}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
          >
            {hasChildren && (
              <ChevronRight
                size={16}
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            )}
            {!hasChildren && <div className="w-4" />}

            <Icon size={18} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />

            <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
              {folder.name}
            </span>
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-2">
              {renderFolderTree(folder.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Mover {itemType === 'folder' ? 'pasta' : 'arquivo'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-medium text-slate-700">{itemName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Pesquisar pastas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderFolderTree(folderStructure)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-600">
            {selectedFolder ? (
              <>Destino selecionado</>
            ) : (
              <>Selecione uma pasta de destino</>
            )}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => {
                if (selectedFolder) {
                  onMove(selectedFolder);
                }
              }}
              disabled={!selectedFolder}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white"
            >
              Mover para aqui
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}