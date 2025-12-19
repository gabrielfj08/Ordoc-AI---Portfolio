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
} from '@heroicons/react/24/outline';
import { FolderOpenIcon } from '@heroicons/react/24/solid';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { toast } from '@/components/ui/use-toast';

// Import services
import DirectoryService from '@/services/ordoc-air/directories';
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
  created_by: {
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
  created_by: {
    id: string;
    username: string;
  };
  version: number;
  is_ocr_processed: boolean;
  tags: string[];
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
  const { data: directoriesData, isLoading: isLoadingDirs } = useQuery({
    queryKey: ['directories', currentDirectory],
    queryFn: async () => {
      const params = currentDirectory ? { parent: currentDirectory } : {};
      return await DirectoryService.list(params);
    },
  });

  // Fetch documents
  const { data: documentsData, isLoading: isLoadingDocs } = useQuery({
    queryKey: ['documents', currentDirectory],
    queryFn: async () => {
      const params = currentDirectory ? { directory: currentDirectory } : {};
      return await DocumentService.list(params);
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
      return await DirectoryService.create(payload);
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
        description: error.response?.data?.message || 'Ocorreu um erro ao criar a pasta.',
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
      toast({
        title: 'Erro no upload',
        description: error.response?.data?.message || 'Ocorreu um erro ao enviar o documento.',
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
      toast({
        title: 'Documento excluído',
        description: 'O documento foi movido para a lixeira.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.response?.data?.message || 'Ocorreu um erro ao excluir o documento.',
        variant: 'destructive',
      });
    },
  });

  const directories: Directory[] = directoriesData?.results || directoriesData || [];
  const documents: Document[] = documentsData?.results || documentsData || [];
  const isLoading = isLoadingDirs || isLoadingDocs;

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
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    if (index === 0) {
      setCurrentDirectory(null);
    } else {
      setCurrentDirectory(newBreadcrumbs[index].id);
    }
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

        {/* Content - render document and directory tables here */}
        {/* ... rest of the component ... */}

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
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
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
