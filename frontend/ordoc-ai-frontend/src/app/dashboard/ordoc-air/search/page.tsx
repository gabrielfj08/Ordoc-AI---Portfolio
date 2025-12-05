'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentIcon,
  FolderIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Types
interface SearchResult {
  id: string;
  name: string;
  type: 'document' | 'folder';
  path: string;
  content_preview?: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  created_by: {
    id: string;
    username: string;
  };
  tags: string[];
  relevance_score: number;
  matched_content?: string;
}

interface SearchFilters {
  fileTypes: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  users: string[];
  tags: string[];
  minSize?: number;
  maxSize?: number;
}

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchContent />
    </ProtectedRoute>
  );
}

function SearchContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name'>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({
    fileTypes: [],
    dateRange: 'all',
    users: [],
    tags: [],
  });

  // Mock data para desenvolvimento
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      name: 'Relatório Anual 2023',
      type: 'document',
      path: '/Documentos/Relatórios',
      content_preview: 'Este relatório apresenta os resultados consolidados das operações de 2023...',
      matched_content: 'resultados <mark>consolidados</mark> das operações',
      file_type: 'application/pdf',
      file_size: 2457600,
      created_at: '2024-01-20T10:30:00Z',
      updated_at: '2024-01-20T10:30:00Z',
      created_by: { id: '1', username: 'admin' },
      tags: ['relatório', 'anual', '2023'],
      relevance_score: 0.95,
    },
    {
      id: '2',
      name: 'Contratos de Fornecedores',
      type: 'folder',
      path: '/Juridico/Contratos',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-25T11:00:00Z',
      created_by: { id: '2', username: 'legal.admin' },
      tags: ['contratos', 'fornecedores'],
      relevance_score: 0.88,
    },
    {
      id: '3',
      name: 'Planilha de Orçamento 2024',
      type: 'document',
      path: '/Financeiro',
      content_preview: 'Projeções orçamentárias para o exercício de 2024 consolidadas por departamento...',
      matched_content: 'orçamentárias para o exercício de 2024 <mark>consolidadas</mark>',
      file_type: 'application/vnd.ms-excel',
      file_size: 1048576,
      created_at: '2024-01-25T09:00:00Z',
      updated_at: '2024-01-25T09:00:00Z',
      created_by: { id: '3', username: 'finance' },
      tags: ['orçamento', '2024', 'financeiro'],
      relevance_score: 0.82,
    },
    {
      id: '4',
      name: 'Política de Segurança',
      type: 'document',
      path: '/Documentos/Políticas',
      content_preview: 'Diretrizes consolidadas sobre segurança da informação e proteção de dados...',
      matched_content: 'Diretrizes <mark>consolidadas</mark> sobre segurança',
      file_type: 'application/pdf',
      file_size: 524288,
      created_at: '2024-01-10T14:00:00Z',
      updated_at: '2024-01-22T16:30:00Z',
      created_by: { id: '4', username: 'security' },
      tags: ['política', 'segurança', 'TI'],
      relevance_score: 0.75,
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simular busca
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 800);
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(handleSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const formatFileSize = (bytes: number): string => {
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

  const getFileTypeLabel = (fileType?: string): string => {
    if (!fileType) return 'Pasta';
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word')) return 'Word';
    if (fileType.includes('excel')) return 'Excel';
    if (fileType.includes('powerpoint')) return 'PowerPoint';
    return 'Documento';
  };

  const activeFiltersCount =
    filters.fileTypes.length +
    (filters.dateRange !== 'all' ? 1 : 0) +
    filters.users.length +
    filters.tags.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
            Busca de Documentos
          </h1>
          <p className="text-gray-600 mt-1">Encontre documentos usando busca full-text com Apache Solr</p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, conteúdo, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 text-lg h-14"
                    autoFocus
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleSearch} size="lg" className="px-8">
                Buscar
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600">{activeFiltersCount}</Badge>
                )}
              </Button>

              <div className="flex-1"></div>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="date">Data de modificação</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtros Avançados</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* File Types */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Tipo de Arquivo</Label>
                  <div className="space-y-2">
                    {['PDF', 'Word', 'Excel', 'PowerPoint', 'Imagem'].map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox id={`type-${type}`} />
                        <label htmlFor={`type-${type}`} className="ml-2 text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Período</Label>
                  <Select value={filters.dateRange} onValueChange={(v: any) => setFilters({...filters, dateRange: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer data</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mês</SelectItem>
                      <SelectItem value="year">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Tags</Label>
                  <Input placeholder="Buscar tags..." />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      relatório
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      financeiro
                    </Badge>
                  </div>
                </div>

                {/* Size Range */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Tamanho</Label>
                  <div className="space-y-2">
                    <Input placeholder="Min (MB)" type="number" />
                    <Input placeholder="Max (MB)" type="number" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setFilters({
                  fileTypes: [],
                  dateRange: 'all',
                  users: [],
                  tags: [],
                })}>
                  Limpar Filtros
                </Button>
                <Button>Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {searchQuery && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {isSearching ? (
                  'Buscando...'
                ) : (
                  <>
                    Encontrados <span className="font-semibold">{searchResults.length}</span> resultado(s)
                    para "<span className="font-semibold">{searchQuery}</span>"
                  </>
                )}
              </p>
            </div>

            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {result.type === 'folder' ? (
                          <FolderIcon className="h-12 w-12 text-blue-500" />
                        ) : (
                          <DocumentIcon className="h-12 w-12 text-gray-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and badges */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                              {result.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                              <FolderIcon className="h-4 w-4" />
                              {result.path}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-800">
                              {Math.round(result.relevance_score * 100)}% relevante
                            </Badge>
                            <Badge variant="outline">{getFileTypeLabel(result.file_type)}</Badge>
                          </div>
                        </div>

                        {/* Content Preview */}
                        {result.content_preview && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              {result.matched_content ? (
                                <span dangerouslySetInnerHTML={{ __html: result.matched_content }} />
                              ) : (
                                result.content_preview
                              )}
                            </p>
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {result.file_size && (
                            <span className="flex items-center gap-1">
                              <DocumentIcon className="h-4 w-4" />
                              {formatFileSize(result.file_size)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(result.updated_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            {result.created_by.username}
                          </span>
                        </div>

                        {/* Tags */}
                        {result.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                              {result.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!isSearching && searchResults.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente usar termos diferentes ou ajuste os filtros de busca
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!searchQuery && !isSearching && (
          <Card>
            <CardContent className="p-12 text-center">
              <MagnifyingGlassIcon className="h-20 w-20 mx-auto mb-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Busca Full-Text Avançada
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Encontre documentos rapidamente usando nossa busca full-text powered by Apache Solr.
                Busque por nome, conteúdo, tags e muito mais.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="px-4 py-2">
                  Busca no conteúdo
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Busca por tags
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Filtros avançados
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Ordenação por relevância
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
