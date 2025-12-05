'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

// Types
interface Directory {
  id: string;
  name: string;
  description?: string;
  path: string;
  parent_directory_id?: string;
  created_at: string;
  updated_at: string;
  created_by: {
    id: string;
    username: string;
  };
  subdirectories_count: number;
  documents_count: number;
}

interface Document {
  id: string;
  name: string;
  original_filename: string;
  description?: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  directory_id: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState<Directory | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'Meu Drive', path: '/' }
  ]);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  // Mock data para desenvolvimento
  React.useEffect(() => {
    // Simular carregamento de dados
    const mockDirectories: Directory[] = [
      {
        id: '1',
        name: 'Documentos Fiscais',
        description: 'Notas fiscais e documentos contábeis',
        path: '/documentos-fiscais',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        created_by: { id: '1', username: 'admin' },
        subdirectories_count: 3,
        documents_count: 45,
      },
      {
        id: '2',
        name: 'Contratos',
        description: 'Contratos com fornecedores e clientes',
        path: '/contratos',
        created_at: '2024-01-10T14:30:00Z',
        updated_at: '2024-01-20T09:15:00Z',
        created_by: { id: '1', username: 'admin' },
        subdirectories_count: 5,
        documents_count: 28,
      },
      {
        id: '3',
        name: 'RH',
        description: 'Documentos de recursos humanos',
        path: '/rh',
        created_at: '2024-01-05T08:00:00Z',
        updated_at: '2024-01-25T11:00:00Z',
        created_by: { id: '2', username: 'rh.manager' },
        subdirectories_count: 8,
        documents_count: 156,
      },
    ];

    const mockDocuments: Document[] = [
      {
        id: 'd1',
        name: 'Relatório Anual 2023',
        original_filename: 'relatorio-anual-2023.pdf',
        description: 'Relatório completo das atividades de 2023',
        file_type: 'application/pdf',
        file_size: 2457600, // 2.4 MB
        status: 'completed',
        directory_id: currentDirectory?.id || 'root',
        created_at: '2024-01-20T10:30:00Z',
        updated_at: '2024-01-20T10:30:00Z',
        created_by: { id: '1', username: 'admin' },
        version: 2,
        is_ocr_processed: true,
        tags: ['relatório', 'anual', '2023'],
      },
      {
        id: 'd2',
        name: 'Apresentação Q4',
        original_filename: 'apresentacao-q4.pptx',
        file_type: 'application/vnd.ms-powerpoint',
        file_size: 5242880, // 5 MB
        status: 'completed',
        directory_id: currentDirectory?.id || 'root',
        created_at: '2024-01-18T15:00:00Z',
        updated_at: '2024-01-18T15:00:00Z',
        created_by: { id: '1', username: 'admin' },
        version: 1,
        is_ocr_processed: false,
        tags: ['apresentação', 'Q4'],
      },
      {
        id: 'd3',
        name: 'Planilha Orçamento',
        original_filename: 'orcamento-2024.xlsx',
        description: 'Orçamento previsto para 2024',
        file_type: 'application/vnd.ms-excel',
        file_size: 1048576, // 1 MB
        status: 'processing',
        directory_id: currentDirectory?.id || 'root',
        created_at: '2024-01-25T09:00:00Z',
        updated_at: '2024-01-25T09:00:00Z',
        created_by: { id: '3', username: 'finance' },
        version: 1,
        is_ocr_processed: false,
        tags: ['orçamento', '2024', 'financeiro'],
      },
    ];

    setDirectories(mockDirectories);
    setDocuments(mockDocuments);
  }, [currentDirectory]);

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
    setCurrentDirectory(dir);
    setBreadcrumbs([...breadcrumbs, { id: dir.id, name: dir.name, path: dir.path }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    if (index === 0) {
      setCurrentDirectory(null);
    } else {
      // Buscar diretório do breadcrumb
      const dir = directories.find(d => d.id === newBreadcrumbs[index].id);
      if (dir) setCurrentDirectory(dir);
    }
  };

  const handleCreateFolder = () => {
    // TODO: Integrar com API
    console.log('Creating folder:', newFolderName, newFolderDescription);
    setShowCreateFolder(false);
    setNewFolderName('');
    setNewFolderDescription('');
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
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
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
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <DocumentsView
              documents={documents}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
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
              <Button onClick={handleCreateFolder} disabled={!newFolderName}>
                Criar Pasta
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
  formatFileSize,
  formatDate,
  getStatusBadge,
}: any) {
  const allItems = [...directories, ...documents];
  const allSelected = allItems.length > 0 && selectedItems.length === allItems.length;

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
          {directories.map((dir) => (
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
              <TableCell className="text-gray-500">
                {dir.documents_count} item(s)
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(dir.updated_at)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {dir.created_by.username}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Abrir</DropdownMenuItem>
                    <DropdownMenuItem>Renomear</DropdownMenuItem>
                    <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {documents.map((doc) => (
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
                {doc.created_by.username}
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
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
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
function FoldersView({ directories, selectedItems, onSelectItem, onOpenDirectory, formatDate }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {directories.map((dir: Directory) => (
        <Card
          key={dir.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onOpenDirectory(dir)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-1">{dir.name}</h3>
            {dir.description && (
              <p className="text-sm text-gray-500 mb-3">{dir.description}</p>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>{dir.documents_count} documentos</span>
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
  formatFileSize,
  formatDate,
  getStatusBadge,
}: any) {
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
          {documents.map((doc: Document) => (
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
                    <div className="text-sm text-gray-500">{doc.original_filename}</div>
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
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
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
