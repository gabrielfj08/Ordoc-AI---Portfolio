'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderIcon,
  DocumentIcon,
  FolderPlusIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { FolderOpenIcon } from '@heroicons/react/24/solid';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useToast } from '@/components/ui/use-toast';

// Import services
import directoriesService from '@/services/ordoc-air/directories';
import { DocumentService } from '@/services/ordoc-air/documents';

// Types
interface Directory {
  id: string;
  name: string;
  description?: string;
  path: string;
  parent_directory?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    username: string;
  };
}

interface Document {
  id: string;
  name: string;
  description?: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  directory?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    username: string;
  };
  version: number;
  tags?: any[];
}

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

export default function MyAirPage() {
  return (
    <ProtectedRoute>
      <MyAirContent />
    </ProtectedRoute>
  );
}

function MyAirContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'Meu Drive', path: '/' }
  ]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch directories
  const { data: directoriesData, isLoading: isLoadingDirs, error: dirsError } = useQuery({
    queryKey: ['directories', currentDirectory],
    queryFn: async () => {
      try {
        const params = currentDirectory ? { parent: currentDirectory } : {};
        const result = await directoriesService.list(params);
        return result;
      } catch (error: any) {
        console.error('Error loading directories:', error);
        // Return empty array on error to avoid breaking the UI
        return { results: [] };
      }
    },
  });

  // Fetch documents
  const { data: documentsData, isLoading: isLoadingDocs, error: docsError } = useQuery({
    queryKey: ['documents', currentDirectory],
    queryFn: async () => {
      try {
        const params = currentDirectory ? { directory: currentDirectory } : {};
        const result = await DocumentService.list(params);
        return result;
      } catch (error: any) {
        console.error('Error loading documents:', error);
        // Return empty array on error
        return { results: [] };
      }
    },
  });

  // Create directory mutation
  const createDirectoryMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const payload: any = {
        name: data.name,
        description: data.description,
      };
      if (currentDirectory) {
        payload.parent_directory = currentDirectory;
      }
      return await directoriesService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directories'] });
      toast({
        title: 'Pasta criada',
        description: 'A pasta foi criada com sucesso.',
      });
      setShowCreateFolder(false);
      setNewFolderName('');
      setNewFolderDescription('');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar pasta',
        description: error.response?.data?.message || error.message || 'Ocorreu um erro ao criar a pasta.',
        variant: 'destructive',
      });
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const data: any = {
        name: file.name.split('.')[0],
      };
      if (currentDirectory) {
        data.directory = currentDirectory;
      }

      console.log('📤 Uploading document:', { file: file.name, data });
      return await DocumentService.uploadDocument(file, data, setUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Upload concluído',
        description: 'O documento foi enviado com sucesso.',
      });
      setShowUpload(false);
      setUploadFile(null);
      setUploadProgress(0);
    },
    onError: (error: any) => {
      console.error('❌ Upload error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Log complete error response as JSON
      console.error('📋 Full error response (JSON):', JSON.stringify(error.response, null, 2));
      console.error('📋 Error data only:', JSON.stringify(error.response?.data, null, 2));

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || Object.entries(error.response?.data || {})
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
        || error.message
        || 'Ocorreu um erro ao enviar o documento.';

      toast({
        title: 'Erro no upload',
        description: errorMessage,
        variant: 'destructive',
      });
      setUploadProgress(0);
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await DocumentService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setSelectedItems([]);
      toast({
        title: 'Documento excluído',
        description: 'O documento foi movido para a lixeira.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.response?.data?.message || error.message || 'Ocorreu um erro ao excluir o documento.',
        variant: 'destructive',
      });
    },
  });

  // Delete directory mutation
  const deleteDirectoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await directoriesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directories'] });
      setSelectedItems([]);
      toast({
        title: 'Pasta excluída',
        description: 'A pasta foi movida para a lixeira.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.response?.data?.message || error.message || 'Ocorreu um erro ao excluir a pasta.',
        variant: 'destructive',
      });
    },
  });

  const directories: Directory[] = directoriesData?.results || directoriesData || [];
  const documents: Document[] = documentsData?.results || documentsData || [];
  const isLoading = isLoadingDirs || isLoadingDocs;
  const hasError = dirsError || docsError;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = [...directories.map(d => d.id), ...documents.map(d => d.id)];
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleOpenDirectory = (dir: Directory) => {
    setCurrentDirectory(dir.id);
    setBreadcrumbs([...breadcrumbs, { id: dir.id, name: dir.name, path: dir.path }]);
    setSelectedItems([]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    if (index === 0) {
      setCurrentDirectory(null);
    } else {
      setCurrentDirectory(newBreadcrumbs[index].id);
    }
    setSelectedItems([]);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, informe o nome da pasta.',
        variant: 'destructive',
      });
      return;
    }
    createDirectoryMutation.mutate({
      name: newFolderName,
      description: newFolderDescription || undefined,
    });
  };

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: 'Arquivo não selecionado',
        description: 'Por favor, selecione um arquivo para enviar.',
        variant: 'destructive',
      });
      return;
    }
    uploadDocumentMutation.mutate(uploadFile);
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => {
      const isDirectory = directories.some(d => d.id === id);
      if (isDirectory) {
        deleteDirectoryMutation.mutate(id);
      } else {
        deleteDocumentMutation.mutate(id);
      }
    });
  };

  const getStatusBadge = (status: Document['status']) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-gray-500' },
      processing: { label: 'Processando', className: 'bg-blue-500' },
      completed: { label: 'Concluído', className: 'bg-green-500' },
      failed: { label: 'Falhou', className: 'bg-red-500' },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Drive</h1>
            <p className="text-gray-600 mt-1">Gerencie seus documentos e pastas</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowCreateFolder(true)} variant="outline">
              <FolderPlusIcon className="h-5 w-5 mr-2" />
              Nova Pasta
            </Button>
            <Button onClick={() => setShowUpload(true)}>
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Error message */}
        {hasError && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 flex items-center gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Modo de desenvolvimento</p>
                <p className="text-sm text-orange-700">
                  Conecte-se ao backend Django em http://localhost:8000 para visualizar dados reais.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              {index > 0 && <ChevronRightIcon className="h-4 w-4" />}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`hover:text-blue-600 transition-colors ${
                  index === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''
                }`}
              >
                {index === 0 ? <HomeIcon className="h-4 w-4 inline" /> : crumb.name}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Toolbar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar documentos e pastas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtros
              </Button>
              {selectedItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {selectedItems.length} selecionado(s)
                      <EllipsisVerticalIcon className="h-5 w-5 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mover</DropdownMenuItem>
                    <DropdownMenuItem>Copiar</DropdownMenuItem>
                    <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDeleteSelected}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="folders">
              Pastas ({directories.length})
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documentos ({documents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <AllItemsView
              directories={directories}
              documents={documents}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              onOpenDirectory={handleOpenDirectory}
              onDeleteDocument={deleteDocumentMutation.mutate}
              onDeleteDirectory={deleteDirectoryMutation.mutate}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="folders" className="mt-4">
            <FoldersView
              directories={directories}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onOpenDirectory={handleOpenDirectory}
              onDeleteDirectory={deleteDirectoryMutation.mutate}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <DocumentsView
              documents={documents}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onDeleteDocument={deleteDocumentMutation.mutate}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>

        {/* Create Folder Dialog */}
        <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Pasta</DialogTitle>
              <DialogDescription>
                Crie uma nova pasta para organizar seus documentos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da pasta *</label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Documentos Fiscais"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Descrição opcional"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName || createDirectoryMutation.isPending}
              >
                {createDirectoryMutation.isPending ? 'Criando...' : 'Criar Pasta'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de Documento</DialogTitle>
              <DialogDescription>
                Envie um documento para o diretório atual
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!uploadFile || uploadDocumentMutation.isPending}
              >
                {uploadDocumentMutation.isPending
                  ? `Enviando... ${uploadProgress}%`
                  : 'Enviar'
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Component: All Items View
function AllItemsView({
  directories,
  documents,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onOpenDirectory,
  onDeleteDocument,
  onDeleteDirectory,
  formatFileSize,
  formatDate,
  getStatusBadge,
}: any) {
  const allItems = [...directories, ...documents];
  const allSelected = allItems.length > 0 && selectedItems.length === allItems.length;

  if (allItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FolderOpenIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pasta vazia
          </h3>
          <p className="text-gray-600">
            Comece criando uma pasta ou fazendo upload de documentos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Modificado</TableHead>
            <TableHead>Criado por</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directories.map((dir: any) => (
            <TableRow key={dir.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedItems.includes(dir.id)}
                  onCheckedChange={() => onSelectItem(dir.id)}
                />
              </TableCell>
              <TableCell onClick={() => onOpenDirectory(dir)}>
                <div className="flex items-center gap-3">
                  <FolderIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">{dir.name}</div>
                    {dir.description && (
                      <div className="text-sm text-gray-500">{dir.description}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Pasta</Badge>
              </TableCell>
              <TableCell className="text-gray-500">-</TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(dir.updated_at)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {dir.created_by?.username || 'Sistema'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpenDirectory(dir)}>
                      Abrir
                    </DropdownMenuItem>
                    <DropdownMenuItem>Renomear</DropdownMenuItem>
                    <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteDirectory(dir.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {documents.map((doc: any) => (
            <TableRow key={doc.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(doc.id)}
                  onCheckedChange={() => onSelectItem(doc.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <DocumentIcon className="h-8 w-8 text-gray-500" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    {doc.description && (
                      <div className="text-sm text-gray-500">{doc.description}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(doc.status)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatFileSize(doc.file_size)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(doc.updated_at)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {doc.created_by?.username || 'Sistema'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Visualizar</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Renomear</DropdownMenuItem>
                    <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// Component: Folders View
function FoldersView({ directories, selectedItems, onSelectItem, onOpenDirectory, onDeleteDirectory, formatDate }: any) {
  if (directories.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FolderIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma pasta
          </h3>
          <p className="text-gray-600">
            Crie uma pasta para organizar seus documentos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {directories.map((dir: any) => (
        <Card
          key={dir.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onOpenDirectory(dir)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.includes(dir.id)}
                  onCheckedChange={() => onSelectItem(dir.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <FolderOpenIcon className="h-10 w-10 text-blue-500" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Abrir</DropdownMenuItem>
                  <DropdownMenuItem>Renomear</DropdownMenuItem>
                  <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDirectory(dir.id);
                    }}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-lg mb-1">{dir.name}</h3>
            {dir.description && (
              <p className="text-sm text-gray-500 mb-3">{dir.description}</p>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Pasta</span>
              <span>{formatDate(dir.updated_at)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Component: Documents View
function DocumentsView({
  documents,
  selectedItems,
  onSelectItem,
  onDeleteDocument,
  formatFileSize,
  formatDate,
  getStatusBadge,
}: any) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <DocumentIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum documento
          </h3>
          <p className="text-gray-600">
            Faça upload de documentos para começar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Modificado</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc: any) => (
            <TableRow key={doc.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(doc.id)}
                  onCheckedChange={() => onSelectItem(doc.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <DocumentIcon className="h-8 w-8 text-gray-500" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    {doc.description && (
                      <div className="text-sm text-gray-500">{doc.description}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(doc.status)}</TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatFileSize(doc.file_size)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">v{doc.version}</Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(doc.updated_at)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Visualizar</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Histórico de Versões</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
