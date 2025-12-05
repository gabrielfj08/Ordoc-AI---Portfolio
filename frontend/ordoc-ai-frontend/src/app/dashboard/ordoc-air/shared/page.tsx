'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShareIcon,
  DocumentIcon,
  FolderIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from '@/components/ui/use-toast';

// Import services
import shareableLinksService from '@/services/ordoc-air/shareableLinks';
import { DocumentService } from '@/services/ordoc-air/documents';

// Types
interface SharedItem {
  id: string;
  name: string;
  type: 'document' | 'folder';
  path: string;
  file_type?: string;
  file_size?: number;
  shared_by: {
    id: string;
    username: string;
    email: string;
  };
  shared_at: string;
  permission: 'view' | 'edit' | 'comment';
  expires_at?: string;
  accessed_at?: string;
  is_favorite: boolean;
}

export default function SharedPage() {
  return (
    <ProtectedRoute>
      <SharedContent />
    </ProtectedRoute>
  );
}

function SharedContent() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionFilter, setPermissionFilter] = useState<'all' | 'view' | 'edit' | 'comment'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'documents' | 'folders'>('all');

  // Fetch shared items from API
  const { data: sharedData, isLoading, error } = useQuery({
    queryKey: ['shared-items', permissionFilter, typeFilter],
    queryFn: async () => {
      try {
        const params: Record<string, any> = {};

        // Add filters
        if (permissionFilter !== 'all') {
          params.permission = permissionFilter;
        }
        if (typeFilter === 'documents') {
          params.content_type = 'document';
        } else if (typeFilter === 'folders') {
          params.content_type = 'directory';
        }

        const result = await shareableLinksService.listSharedWithMe(params);
        return result;
      } catch (error: any) {
        console.error('Error loading shared items:', error);
        toast({
          title: 'Erro ao carregar itens compartilhados',
          description: error.response?.data?.message || 'Ocorreu um erro ao carregar os itens compartilhados.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  const sharedItems: SharedItem[] = (sharedData || []).map((link: any) => ({
    id: link.id,
    name: link.document?.name || link.directory?.name || 'Sem nome',
    type: link.document ? 'document' : 'folder',
    path: link.document?.directory_path || link.directory?.path || '/',
    file_type: link.document?.mime_type,
    file_size: link.document?.file_size,
    shared_by: {
      id: link.created_by?.id || '',
      username: link.created_by?.username || 'Desconhecido',
      email: link.created_by?.email || '',
    },
    shared_at: link.created_at,
    permission: link.permission_level,
    expires_at: link.expires_at,
    accessed_at: link.last_accessed_at,
    is_favorite: false, // This would need to come from user favorites
  }));

  // Mutation to revoke shared access
  const revokeAccessMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return await shareableLinksService.destroy(linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-items'] });
      toast({
        title: 'Acesso revogado',
        description: 'O compartilhamento foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao revogar acesso',
        description: error.response?.data?.message || 'Ocorreu um erro ao revogar o compartilhamento.',
        variant: 'destructive',
      });
    },
  });

  // Handler for downloading a document
  const handleDownload = async (documentId: string, documentName: string) => {
    try {
      const blob = await DocumentService.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download iniciado',
        description: `O documento "${documentName}" está sendo baixado.`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro no download',
        description: error.response?.data?.message || 'Ocorreu um erro ao baixar o documento.',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPermissionBadge = (permission: SharedItem['permission']) => {
    const config = {
      view: { label: 'Visualizar', className: 'bg-blue-100 text-blue-800' },
      edit: { label: 'Editar', className: 'bg-green-100 text-green-800' },
      comment: { label: 'Comentar', className: 'bg-purple-100 text-purple-800' },
    };
    const { label, className } = config[permission];
    return <Badge className={className}>{label}</Badge>;
  };

  const getFileTypeLabel = (fileType?: string): string => {
    if (!fileType) return 'Pasta';
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word')) return 'Word';
    if (fileType.includes('excel')) return 'Excel';
    if (fileType.includes('powerpoint')) return 'PowerPoint';
    return 'Documento';
  };

  const filteredItems = sharedItems.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (permissionFilter !== 'all' && item.permission !== permissionFilter) {
      return false;
    }
    if (typeFilter === 'documents' && item.type !== 'document') return false;
    if (typeFilter === 'folders' && item.type !== 'folder') return false;
    return true;
  });

  const sharedWithMe = filteredItems;
  const favorites = filteredItems.filter(i => i.is_favorite);
  const expiringItems = filteredItems.filter(i => i.expires_at);

  const stats = {
    total: sharedItems.length,
    documents: sharedItems.filter(i => i.type === 'document').length,
    folders: sharedItems.filter(i => i.type === 'folder').length,
    favorites: favorites.length,
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Banner - Development Mode */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Modo de desenvolvimento:</strong> Não foi possível conectar ao backend. Certifique-se de que o servidor está rodando em http://localhost:8000
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShareIcon className="h-8 w-8 text-blue-600" />
            Compartilhado Comigo
          </h1>
          <p className="text-gray-600 mt-1">Documentos e pastas que outros usuários compartilharam com você</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Compartilhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.documents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pastas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.folders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.favorites}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar itens compartilhados..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={permissionFilter} onValueChange={(v: any) => setPermissionFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas permissões</SelectItem>
                  <SelectItem value="view">Visualizar</SelectItem>
                  <SelectItem value="edit">Editar</SelectItem>
                  <SelectItem value="comment">Comentar</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="documents">Documentos</SelectItem>
                  <SelectItem value="folders">Pastas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos ({sharedWithMe.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos ({favorites.length})</TabsTrigger>
            <TabsTrigger value="expiring">Com Prazo ({expiringItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <SharedItemsTable items={sharedWithMe} getPermissionBadge={getPermissionBadge} formatDate={formatDate} formatFileSize={formatFileSize} getFileTypeLabel={getFileTypeLabel} />
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <SharedItemsTable items={favorites} getPermissionBadge={getPermissionBadge} formatDate={formatDate} formatFileSize={formatFileSize} getFileTypeLabel={getFileTypeLabel} />
          </TabsContent>

          <TabsContent value="expiring" className="mt-4">
            <SharedItemsTable items={expiringItems} getPermissionBadge={getPermissionBadge} formatDate={formatDate} formatFileSize={formatFileSize} getFileTypeLabel={getFileTypeLabel} showExpiry />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface SharedItemsTableProps {
  items: SharedItem[];
  getPermissionBadge: (permission: SharedItem['permission']) => JSX.Element;
  formatDate: (date: string) => string;
  formatFileSize: (size?: number) => string;
  getFileTypeLabel: (fileType?: string) => string;
  showExpiry?: boolean;
}

function SharedItemsTable({ items, getPermissionBadge, formatDate, formatFileSize, getFileTypeLabel, showExpiry }: SharedItemsTableProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ShareIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-600">Não há itens compartilhados nesta categoria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Compartilhado por</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Compartilhado em</TableHead>
            {showExpiry && <TableHead>Expira em</TableHead>}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {item.type === 'folder' ? (
                    <FolderIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  ) : (
                    <DocumentIcon className="h-8 w-8 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium flex items-center gap-2">
                      {item.name}
                      {item.is_favorite && (
                        <span className="text-yellow-500">★</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{item.path}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Badge variant="outline">{getFileTypeLabel(item.file_type)}</Badge>
                  {item.file_size && (
                    <div className="text-xs text-gray-500 mt-1">{formatFileSize(item.file_size)}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {item.shared_by.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{item.shared_by.username}</div>
                    <div className="text-xs text-gray-500">{item.shared_by.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getPermissionBadge(item.permission)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(item.shared_at)}
              </TableCell>
              {showExpiry && (
                <TableCell>
                  {item.expires_at ? (
                    <div className="text-sm">
                      <div className="text-orange-600 font-medium">
                        {formatDate(item.expires_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(item.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias restantes
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Sem prazo</span>
                  )}
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {item.type === 'folder' ? 'Abrir' : 'Visualizar'}
                    </DropdownMenuItem>
                    {item.permission === 'edit' && (
                      <DropdownMenuItem>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      {item.is_favorite ? (
                        <>★ Remover dos Favoritos</>
                      ) : (
                        <>☆ Adicionar aos Favoritos</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Deixar de compartilhar
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
