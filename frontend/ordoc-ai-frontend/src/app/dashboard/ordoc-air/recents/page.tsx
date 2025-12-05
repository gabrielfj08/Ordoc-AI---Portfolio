'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ClockIcon,
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
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
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from '@/components/ui/use-toast';

// Import services
import recentDocumentsService from '@/services/ordoc-air/recentDocuments';
import { DocumentService } from '@/services/ordoc-air/documents';

// Types
interface RecentDocument {
  id: string;
  name: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  accessed_at: string;
  created_at: string;
  accessed_count: number;
  directory_path: string;
  created_by: {
    id: string;
    username: string;
  };
  type: 'document' | 'folder';
}

export default function RecentsPage() {
  return (
    <ProtectedRoute>
      <RecentsContent />
    </ProtectedRoute>
  );
}

function RecentsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, month
  const [typeFilter, setTypeFilter] = useState('all'); // all, documents, folders

  // Fetch recent documents from API
  const { data: recentData, isLoading, error } = useQuery({
    queryKey: ['recent-documents', timeFilter],
    queryFn: async () => {
      try {
        const params: Record<string, any> = {};

        // Add time filter to params
        if (timeFilter === 'today') {
          params.days = 1;
        } else if (timeFilter === 'week') {
          params.days = 7;
        } else if (timeFilter === 'month') {
          params.days = 30;
        }

        const result = await recentDocumentsService.list(params);
        return result;
      } catch (error: any) {
        console.error('Error loading recent documents:', error);
        toast({
          title: 'Erro ao carregar documentos recentes',
          description: error.response?.data?.message || 'Ocorreu um erro ao carregar os documentos recentes.',
          variant: 'destructive',
        });
        return { results: [] };
      }
    },
  });

  const recentItems: RecentDocument[] = recentData?.results || recentData || [];

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minuto${diffMins !== 1 ? 's' : ''} atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
    } else if (diffDays < 7) {
      return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semana${weeks !== 1 ? 's' : ''} atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getFileTypeLabel = (fileType: string): string => {
    if (fileType === 'folder') return 'Pasta';
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word')) return 'Word';
    if (fileType.includes('excel')) return 'Excel';
    if (fileType.includes('powerpoint')) return 'PowerPoint';
    if (fileType.includes('image')) return 'Imagem';
    return 'Documento';
  };

  const filteredItems = recentItems.filter(item => {
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by type
    if (typeFilter !== 'all') {
      if (typeFilter === 'documents' && item.type !== 'document') return false;
      if (typeFilter === 'folders' && item.type !== 'folder') return false;
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const accessedDate = new Date(item.accessed_at);
      const now = new Date();
      const diffDays = (now.getTime() - accessedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (timeFilter === 'today' && diffDays > 1) return false;
      if (timeFilter === 'week' && diffDays > 7) return false;
      if (timeFilter === 'month' && diffDays > 30) return false;
    }

    return true;
  });

  const stats = {
    total: recentItems.length,
    documents: recentItems.filter(i => i.type === 'document').length,
    folders: recentItems.filter(i => i.type === 'folder').length,
    today: recentItems.filter(i => {
      const diff = (new Date().getTime() - new Date(i.accessed_at).getTime()) / (1000 * 60 * 60 * 24);
      return diff < 1;
    }).length,
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              Documentos Recentes
            </h1>
            <p className="text-gray-600 mt-1">Acesse rapidamente seus documentos mais utilizados</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Acessados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.today}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.documents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pastas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.folders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
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

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredItems.length}</span> de{' '}
            <span className="font-semibold">{recentItems.length}</span> itens
          </p>
        </div>

        {/* Recent Items Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Acessos</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum item recente encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.type === 'folder' ? (
                          <FolderIcon className="h-8 w-8 text-blue-500" />
                        ) : (
                          <DocumentIcon className="h-8 w-8 text-gray-500" />
                        )}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.original_filename}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getFileTypeLabel(item.file_type)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {item.directory_path}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatFileSize(item.file_size)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatRelativeTime(item.accessed_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {item.accessed_count}x
                      </Badge>
                    </TableCell>
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
                          {item.type === 'document' && (
                            <DropdownMenuItem onClick={() => handleDownload(item.id, item.original_filename)}>
                              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <ShareIcon className="h-4 w-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Remover dos Recentes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {item.type === 'folder' ? (
                    <FolderIcon className="h-12 w-12 text-blue-500 mb-2" />
                  ) : (
                    <DocumentIcon className="h-12 w-12 text-gray-500 mb-2" />
                  )}
                  <p className="text-sm font-medium text-center truncate w-full">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(item.accessed_at)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
