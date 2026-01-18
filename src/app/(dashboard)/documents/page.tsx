"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MainContainer } from "@/components/layout/MainContainer";
import { DocumentSidebarLeft } from "@/components/documents/DocumentSidebarLeft";
import { DocumentList, DocumentItem } from "@/components/documents/DocumentList";
import { FolderGrid } from "@/components/documents/FolderGrid";
import { DocumentDetails } from "@/components/documents/DocumentDetails";
import { DocumentToolbar } from "@/components/documents/DocumentToolbar";
import { FileGrid } from "@/components/documents/FileGrid";
import { UploadStatusCard } from "@/components/documents/UploadStatusCard";
import { MoveDocumentModal } from "@/components/documents/MoveDocumentModal";
import { SharedDocumentMenu } from "@/components/documents/SharedDocumentMenu";
import { AIInsightsPanel } from "@/components/documents/AIInsightsPanel";
import { EmptySearchResults } from "@/components/documents/EmptySearchResults";
import { SourceIntelligencePanel } from "@/components/documents/SourceIntelligencePanel";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDocuments } from "@/hooks/useDocuments";
import { useDirectories } from "@/hooks/useDirectories";
import {
  LayoutGrid, List, Info, ChevronDown, X, ChevronRight,
  UserPlus, Download, FolderInput, Trash2, Zap, Upload
} from "lucide-react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { processDropItems } from '@/utils/file-upload';
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

// Componente DropZoneOverlay
const DropZoneOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-blue-50/90 border-4 border-dashed border-blue-400 rounded-lg z-50 flex items-center justify-center">
      <div className="text-center">
        <Upload size={48} className="mx-auto text-blue-500 mb-2" />
        <p className="text-lg font-semibold text-blue-700">Solte os arquivos aqui</p>
        <p className="text-sm text-blue-600 mt-1">Upload instantâneo e seguro</p>
      </div>
    </div>
  );
};

// Dados iniciais com tipagem correta e hierarquia de teste
const initialItems: DocumentItem[] = [
  // Root Folders
  { id: 'f1', name: ".ipynb_checkpoints", owner: "eu", ownerId: 'u1', date: "18 de jul. de 2025", size: "—", type: 'folder', parentId: null, permissions: ['edit', 'admin'] },
  {
    id: 'f2',
    name: "backup",
    owner: "eu",
    ownerId: 'u1',
    date: "27 de jul. de 2025",
    size: "—",
    type: 'folder',
    parentId: null,
    permissions: ['edit'],
    health: 'warning',
    tags: ['Backup', 'Arquivado'],
    category: 'Sistema'
  },

  // Root Files
  {
    id: 'a1',
    name: "Contrato_Venda_2025.pdf",
    owner: "eu",
    ownerId: 'u1',
    date: "24 de ago. de 2025",
    size: "1 KB",
    type: 'file',
    parentId: null,
    permissions: ['edit', 'admin'],
    version: 3,
    versionHistory: [
      { version: 3, date: "24 de ago. de 2025", author: "Ricardo Silva", authorId: 'u1', size: "1 KB", comment: "Ajustes finais nas cláusulas", hash: "a3f5e9b2c1d4" },
      { version: 2, date: "20 de ago. de 2025", author: "Ricardo Silva", authorId: 'u1', size: "980 B", comment: "Revisão jurídica", hash: "b2e4d8a1c3f5" },
      { version: 1, date: "15 de ago. de 2025", author: "Ricardo Silva", authorId: 'u1', size: "950 B", comment: "Versão inicial", hash: "c1d3e7b2a4f6" }
    ],
    tags: ['Contrato', 'Vendas', 'Importante'],
    category: 'Jurídico',
    metadata: {
      'Cliente': 'Empresa XYZ Ltda',
      'Valor': 'R$ 150.000,00',
      'Prazo': '12 meses'
    },
    contentPreview: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS celebrado entre CONTRATANTE e CONTRATADA para fornecimento de soluções tecnológicas com prazo de 12 meses e valor total de R$ 150.000,00",
    icpCertificate: {
      type: 'A3',
      issuer: 'AC Certisign RFB G5',
      subject: 'Ricardo Silva:12345678900',
      validFrom: '10 de jan. de 2024',
      validUntil: '10 de jan. de 2026',
      serialNumber: '4F:A2:B1:C3:D4:E5:F6:A7:B8:C9',
      isValid: true
    }
  },
  {
    id: 'a2',
    name: "Adi Wijaya - Data Engineering...",
    owner: "eu",
    ownerId: 'u2',
    date: "30 de out. de 2024",
    size: "45,2 MB",
    type: 'file',
    parentId: null,
    permissions: ['read'],
    tags: ['Dados', 'Engenharia'],
    contentPreview: "Documento técnico sobre arquitetura de dados e pipelines ETL para processamento em larga escala"
  },

  // Nested in 'backup' (f2)
  { id: 'f3', name: "Projetos Antigos", owner: "eu", ownerId: 'u1', date: "01 de jan. de 2025", size: "—", type: 'folder', parentId: 'f2', permissions: ['edit'] },
  {
    id: 'a3',
    name: "Relatorio_v1.pdf",
    owner: "eu",
    ownerId: 'u1',
    date: "10 de jan. de 2025",
    size: "2 MB",
    type: 'file',
    parentId: 'f2',
    permissions: ['edit'],
    version: 1,
    tags: ['Relatório', 'Financeiro'],
    category: 'Documentação',
    contentPreview: "Relatório financeiro do primeiro trimestre de 2025 com análise de receitas e despesas operacionais"
  },

  // Nested in 'Projetos Antigos' (f3)
  {
    id: 'a4',
    name: "Código_Legado.zip",
    owner: "eu",
    ownerId: 'u1',
    date: "05 de jan. de 2025",
    size: "150 MB",
    type: 'file',
    parentId: 'f3',
    permissions: ['edit'],
    health: 'critical',
    tags: ['Código', 'Legado', 'Arquivado'],
    category: 'Desenvolvimento',
    metadata: {
      'Linguagem': 'Python 2.7',
      'Status': 'Descontinuado'
    }
  },
];

import { toast } from "sonner";
import { documentService } from "@/services/documents";

import { useQueryClient } from "@tanstack/react-query";

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Estados para Modal de Confirmação
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    data: any;
    ids: string[];
  }>({
    isOpen: false,
    data: null,
    ids: []
  });

  // Função de Deleção
  const handleDelete = async (id: string, confirmed: boolean = false) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    try {
      if (item.type === 'folder') {
        await documentService.deleteDirectory(id);
      } else {
        const result = await documentService.bulkTrash([id], confirmed);

        // Verifica se precisa de confirmação (shared/non-owned)
        if (result && result.requires_confirmation) {
          setConfirmationModal({
            isOpen: true,
            data: result,
            ids: [id]
          });
          return;
        }
      }

      toast.success(`${item.type === 'folder' ? 'Pasta' : 'Arquivo'} movido para lixeira`);

      // Invalidar queries para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['directories'] });
      queryClient.invalidateQueries({ queryKey: ['directory-tree'] });

    } catch (error) {
      console.error(error);
      toast.error("Erro ao mover para lixeira");
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmationModal.ids.length > 0) {
      try {
        // Re-tenta a deleção com confirmed=true
        // Supondo que seja arquivo (folder delete nao tem confirmacao implementada no front ainda)
        await documentService.bulkTrash(confirmationModal.ids, true);

        toast.success("Itens movidos para lixeira");
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['directories'] });

        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao confirmar exclusão");
      }
    }
  };
  // Estados de UI
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Estados de Navegação
  const [activeContext, setActiveContext] = useState<string>('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Deep Link: Selecionar item via URL (?id=...)
  const highlightedId = searchParams.get("id");

  React.useEffect(() => {
    if (highlightedId) {
      setSelectedItem(highlightedId);
      setIsDetailsOpen(true);
    }
  }, [highlightedId]);

  // Multi-selection and Intelligence Panel
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showIntelligencePanel, setShowIntelligencePanel] = useState(false);

  // Filtro de Busca
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  // **INTEGRAÇÃO REAL COM BACKEND**
  const { documents, isLoading: isLoadingDocs } = useDocuments({
    directory: currentFolderId || undefined,
    search: searchQuery || undefined,
    page: 1,
    pageSize: 100,
    // Fix: use inTrash instead of status='trashed' which caused 400 errors
    inTrash: activeContext === 'trash',
  });

  const { directories, isLoading: isLoadingDirs } = useDirectories({
    parentDirectory: currentFolderId || undefined,
    inTrash: activeContext === 'trash',
  });

  // Combinar documentos e diretórios no formato esperado pelos componentes
  const items: DocumentItem[] = [
    ...directories.map(dir => ({
      id: dir.id,
      name: dir.name,
      owner: "eu", // TODO: pegar do backend
      ownerId: 'u1',
      date: new Date(dir.created_at).toLocaleDateString('pt-BR'),
      size: "—",
      type: 'folder' as const,
      parentId: dir.parent_directory || null,
      permissions: ['edit', 'admin'] as ('read' | 'edit' | 'admin')[],
    })),
    ...documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      owner: doc.created_by?.first_name || doc.created_by_name || "Sistema", // Use created_by or fallback
      ownerId: doc.created_by?.id || 'system',
      date: new Date(doc.created_at).toLocaleDateString('pt-BR'),
      size: `${(doc.file_size / 1024).toFixed(1)} KB`,
      type: 'file' as const,
      parentId: doc.directory || null,
      permissions: ['edit'] as ('read' | 'edit' | 'admin')[],
      tags: doc.tags?.map(t => t.name) || [], // Map Tag objects to strings
      is_favorited: doc.is_favorited,
    })),
  ];

  const isLoading = isLoadingDocs || isLoadingDirs;

  // Breadcrumbs: array de { id, name }
  const getBreadcrumbs = () => {
    const path = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = items.find(i => i.id === currentId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId || null;
      } else {
        break;
      }
    }
    return path;
  };
  const breadcrumbs = getBreadcrumbs();

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Estado para controlar qual item está sendo movido/compartilhado
  const [itemToMove, setItemToMove] = useState<DocumentItem | null>(null);
  const [itemToShare, setItemToShare] = useState<DocumentItem | null>(null);

  const dragCounter = useRef(0);

  // Motor de upload para gerenciar o estado
  const { uploads, uploadFile, clearCompleted } = useFileUpload();

  // Lógica de Filtragem Unificada
  const filteredItems = items.filter(item => {
    // 1. Busca Global (Google Drive behavior: ignore folders if searching)
    if (searchQuery) {
      const matchesName = item.name.toLowerCase().includes(searchQuery);
      const matchesContent = item.contentPreview?.toLowerCase().includes(searchQuery) || false;
      const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(searchQuery)) || false;
      const matchesMetadata = item.metadata
        ? Object.values(item.metadata).some(value => value.toLowerCase().includes(searchQuery))
        : false;
      const matchesCategory = item.category?.toLowerCase().includes(searchQuery) || false;

      return matchesName || matchesContent || matchesTags || matchesMetadata || matchesCategory;
    }

    // 2. Filtro por Contexto
    // 2. Filtro por Contexto
    if (activeContext === 'my-drive') {
      // Backend já filtra por view='inbox' (active)
      // Navegação Hierárquica: Se não há busca, respeita a pasta atual
      return item.parentId === (currentFolderId || null);
    }

    if (activeContext === 'shared-with-me') {
      // Backend já filtra por view='shared'
      return true;
    }

    if (activeContext === 'trash') {
      return true;
    }

    // Default catch-all
    return true;
  });

  // Função de Navegação
  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItem(null); // Limpar seleção ao navegar
  };

  // Buscar item selecionado
  const getSelectedItemData = () => {
    return items.find(item => item.id === selectedItem); // Busca em 'items' para garantir que encontre mesmo se não filtrado
  };

  const selectedItemData = getSelectedItemData();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Verifica se estamos arrastando arquivos do SO (Upload)
    const isFileUpload = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files");

    if (isFileUpload) {
      dragCounter.current++;
      setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFileUpload = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files");

    if (isFileUpload) {
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDraggingFile(false);
      }
    }
  };



  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isFileUpload = e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files");

    if (isFileUpload) {
      setIsDraggingFile(false);
      dragCounter.current = 0;

      // Use recursive processor for folders and files
      if (e.dataTransfer.items) {
        processDropItems(e.dataTransfer.items, currentFolderId || null, async (file: File, parentId?: string) => {
          await uploadFile(file, parentId);
        }).then(() => {
          // Invalidate queries to refresh list
          queryClient.invalidateQueries({ queryKey: ['documents'] });
          queryClient.invalidateQueries({ queryKey: ['directories'] });
        });
      } else {
        // Fallback for older browsers (unlikely)
        Array.from(e.dataTransfer.files).forEach(file => {
          uploadFile(file, currentFolderId || undefined);
        });
      }
    }
  };

  // Função para abrir modal de mover
  const openMoveModal = (item: DocumentItem) => {
    setItemToMove(item);
    setIsMoveModalOpen(true);
  };

  // Função para abrir modal de compartilhar
  const openShareModal = (item: DocumentItem) => {
    setItemToShare(item);
    setIsShareModalOpen(true);
  };

  // Função chamada pelo modal para efetivar o movimento
  const handleMoveDocument = (targetFolderId: string) => {
    if (itemToMove) {
      console.log(`Movendo ${itemToMove.name} para pasta ${targetFolderId}`);

      // TODO: Implementar com useDocumentActions.move()
      // await move({ id: itemToMove.id, directoryId: targetFolderId });

      if (selectedItem === itemToMove.id) {
        setSelectedItem(null);
      }

      setIsMoveModalOpen(false);
      setItemToMove(null);
    }
  };

  // Handler para Drag and Drop (Movimentação direta)
  const handleMoveItems = async (sourceIds: string[], targetId: string) => {
    // Caso 1: Mover para lixeira
    if (targetId === 'trash') {
      try {
        // Processa um por um para reutilizar handleDelete (que já tem toast e invalidate)
        // Idealmente faríamos um bulkDelete aqui se sourceIds for array
        for (const id of sourceIds) {
          await handleDelete(id);
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // Caso 2: Mover para outra pasta
    console.log(`[Page] Drag & Drop Move Request: ${sourceIds.join(', ')} -> ${targetId}`);
    try {
      // TODO: Implementar bulkMove no service
      // Por enquanto, apenas log, pois requires backend support for move
      toast.info("Movimentação de pasta em desenvolvimento");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao mover itens");
    }
  };

  const {
    draggedId: itemDraggedId,
    dropTargetId: itemDropTargetId,
    handleDragStart: handleItemDragStart,
    handleDragOver: handleItemDragOver,
    handleDragLeave: handleItemDragLeave,
    handleDrop: handleItemDrop
  } = useDragAndDrop((draggedId, targetId) => {
    handleMoveItems([draggedId], targetId);
  });

  return (
    <MainContainer>
      <div className="relative h-full flex flex-col -m-8">
        {/* Toolbar de Seleção */}


        {/* Área de Conteúdo */}
        <div className="flex-1 flex bg-white">
          <aside
            className="w-64 hidden lg:block border-r border-slate-100 p-4 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <DocumentSidebarLeft
              activeContext={activeContext}
              onContextChange={setActiveContext}
              currentFolderId={currentFolderId}
              dropTargetId={itemDropTargetId}
              handleDragOver={handleItemDragOver}
              handleDragLeave={handleItemDragLeave}
              handleDrop={handleItemDrop}
              onUploadFile={uploadFile}
            />
          </aside>

          <main
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="flex-1 overflow-y-auto relative bg-white p-8"
            onClick={() => setSelectedItem(null)}
          >
            <DropZoneOverlay isVisible={isDraggingFile} />

            {/* Cabeçalho de Navegação (Breadcrumbs) - SEMPRE VISÍVEL */}
            <div className="flex items-center justify-between mb-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 group">
                {/* Breadcrumbs UI */}
                <div className="flex items-center text-xl font-medium text-slate-800">
                  <button
                    onClick={() => handleNavigate(null)}
                    className={`hover:bg-slate-100 px-2 py-1 rounded-md transition-colors flex items-center gap-2 ${!currentFolderId ? '' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {activeContext === 'my-drive' ? 'Meu Drive' :
                      activeContext === 'shared-with-me' ? 'Compartilhados comigo' : 'Documentos'}
                  </button>

                  {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb.id}>
                      <ChevronRight size={16} className="text-slate-400 mx-1" />
                      <button
                        onClick={() => handleNavigate(crumb.id)}
                        className="hover:bg-slate-100 px-2 py-1 rounded-md transition-colors truncate max-w-150px"
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Dropdown de opções da pasta atual */}
                <ChevronDown size={18} className="text-slate-500 cursor-pointer hover:text-[#f97316] ml-2" />
              </div>

              {/* View Toggles */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button onClick={(e) => { e.stopPropagation(); setViewMode("list"); }} className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-[#f97316]" : "text-slate-500 hover:text-slate-700"}`}><List size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setViewMode("grid"); }} className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-[#f97316]" : "text-slate-500 hover:text-slate-700"}`}><LayoutGrid size={18} /></button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsDetailsOpen(!isDetailsOpen); }} className={`p-2 rounded-full transition-colors ${isDetailsOpen ? "text-[#f97316] bg-orange-50" : "text-slate-500 hover:bg-slate-100"}`}><Info size={20} /></button>
              </div>
            </div>

            {selectedItem ? (
              /* Toolbar de Seleção (Substitui APENAS os Filtros) */
              <div className="mb-6 h-10 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                <div
                  className="w-full bg-blue-50 rounded-lg px-3 py-1 flex items-center justify-between transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="hover:bg-blue-100 p-1 rounded-md transition-colors"
                      title="Cancelar seleção"
                    >
                      <X size={16} className="text-blue-700" />
                    </button>

                    <span className="text-xs font-semibold text-blue-900">
                      1 item selecionado
                    </span>

                    <button className="flex items-center gap-1.5 hover:bg-blue-100 px-3 py-1 rounded-md text-[11px] font-bold transition-all text-blue-700">
                      <Zap size={12} className="text-[#f97316] fill-[#f97316]" />
                      Resuma este item
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedItem && !selectedDocuments.includes(selectedItem)) {
                          setSelectedDocuments([...selectedDocuments, selectedItem]);
                        }
                        setShowIntelligencePanel(true);
                      }}
                      className="flex items-center gap-1.5 hover:bg-purple-100 px-3 py-1 rounded-md text-[11px] font-bold transition-all text-purple-700 bg-purple-50"
                    >
                      <Zap size={12} className="text-purple-600" />
                      Análise Cognitiva
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-blue-700 mr-1">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => selectedItemData && openShareModal(selectedItemData)} title="Compartilhar" className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"><UserPlus size={16} /></button>
                      <button title="Download" className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"><Download size={16} /></button>
                      <button onClick={() => selectedItemData && openMoveModal(selectedItemData)} title="Mover" className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"><FolderInput size={16} /></button>
                      <div className="w-px h-4 bg-blue-200 mx-1"></div>
                      <button onClick={() => {/* Delete Logic */ }} title="Lixeira" className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <button onClick={() => setSelectedItem(null)} className="text-[10px] font-bold text-blue-600 hover:underline ml-2 uppercase tracking-wide">Limpar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 animate-in fade-in duration-300"><DocumentToolbar /></div>
            )}

            {/* Sort Row (Sempre visível) */}
            <div className="flex items-center px-2 text-slate-500 mb-4 animate-in fade-in duration-300">
              <button className="flex items-center gap-1 text-xs font-semibold hover:bg-slate-100 px-2 py-1 rounded transition-colors group">
                Nome <ChevronDown size={14} className="rotate-180 text-blue-500" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="animate-in fade-in duration-300">
              {filteredItems.length === 0 ? (
                <EmptySearchResults
                  onDeepSearch={() => { }}
                  isExtended={!!currentFolderId} // Se estiver numa pasta funda, mostra que pode expandir busca
                />
              ) : viewMode === "grid" ? (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pastas</h2>
                    <FolderGrid
                      items={filteredItems}
                      onSelect={(id) => setSelectedItem(id === selectedItem ? null : id)}
                      selectedId={selectedItem}
                      onMoveRequest={(id) => { const item = items.find(i => i.id === id); if (item) openMoveModal(item); }}
                      onShareRequest={(id) => { const item = items.find(i => i.id === id); if (item) openShareModal(item); }}
                      onNavigate={handleNavigate}
                      onDelete={handleDelete}
                      draggedId={itemDraggedId}
                      dropTargetId={itemDropTargetId}
                      handleDragStart={handleItemDragStart}
                      handleDragOver={handleItemDragOver}
                      handleDragLeave={handleItemDragLeave}
                      handleDrop={handleItemDrop}
                    />
                  </section>
                  <section className="space-y-4 pt-4">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Arquivos</h2>
                    <FileGrid
                      items={filteredItems}
                      onSelect={(id) => setSelectedItem(id === selectedItem ? null : id)}
                      selectedId={selectedItem}
                      onMoveRequest={(id) => items.find(i => i.id === id) && openMoveModal(items.find(i => i.id === id)!)}
                      onShareRequest={(id) => items.find(i => i.id === id) && openShareModal(items.find(i => i.id === id)!)}
                      draggedId={itemDraggedId}
                      handleDragStart={handleItemDragStart}
                    />
                  </section>
                </div>
              ) : (
                <section className="space-y-4">
                  <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Arquivos e Pastas</h2>
                  <DocumentList
                    items={filteredItems}
                    onSelect={(id) => setSelectedItem(id === selectedItem ? null : id)}
                    selectedId={selectedItem}
                    onMoveRequest={(id) => items.find(i => i.id === id) && openMoveModal(items.find(i => i.id === id)!)}
                    onShareRequest={(id) => items.find(i => i.id === id) && openShareModal(items.find(i => i.id === id)!)}
                    onNavigate={handleNavigate}
                    draggedId={itemDraggedId}
                    dropTargetId={itemDropTargetId}
                    handleDragStart={handleItemDragStart}
                    handleDragOver={handleItemDragOver}
                    handleDragLeave={handleItemDragLeave}
                    handleDrop={handleItemDrop}
                  />
                </section>
              )}
            </div>

            {uploads.length > 0 && <UploadStatusCard uploads={uploads} onClear={clearCompleted} />}
          </main>

          {isDetailsOpen && (
            <aside className="hidden xl:block w-[400px] shrink-0 h-full border-l border-slate-100 bg-white" onClick={(e) => e.stopPropagation()}>
              {showAIPanel && selectedItemData ? (
                <AIInsightsPanel item={selectedItemData} onClose={() => setIsDetailsOpen(false)} onBack={() => setShowAIPanel(false)} />
              ) : (
                <DocumentDetails onClose={() => setIsDetailsOpen(false)} item={selectedItemData || null} onGenerateSummary={() => setShowAIPanel(true)} />
              )}
            </aside>
          )}
        </div>

        {isMoveModalOpen && itemToMove && <MoveDocumentModal itemName={itemToMove.name} itemType={itemToMove.type} onClose={() => setIsMoveModalOpen(false)} onMove={handleMoveDocument} />}
        {isShareModalOpen && itemToShare && <SharedDocumentMenu itemName={itemToShare.name} itemType={itemToShare.type} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />}

        {/* Source Intelligence Panel */}
        <SourceIntelligencePanel
          selectedDocuments={items.filter(item => selectedDocuments.includes(item.id))}
          isOpen={showIntelligencePanel}
          onClose={() => setShowIntelligencePanel(false)}
          onRemoveDocument={(id) => {
            setSelectedDocuments(prev => prev.filter(docId => docId !== id));
          }}
          onGenerateAnalysis={(documents) => {
            console.log('Análise gerada para:', documents);
          }}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirmDelete}
          title="Atenção Necessária"
          description={confirmationModal.data?.confirmation_message || "Existem restrições para esta ação."}
          warnings={confirmationModal.data?.warnings}
        />
      </div>
    </MainContainer>
  );
}