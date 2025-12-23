'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    FileText,
    Filter,
    X,
    Loader2,
    Sparkles,
    Calendar,
    Folder,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import searchService, { SearchResult, SearchFilters } from '@/services/search';

interface SmartFilterPreset {
    id: string;
    name: string;
    description: string;
    icon: string;
    query?: string;
    filters: SearchFilters;
}

// Intelligent filter presets based on common patterns
const smartFilterPresets: SmartFilterPreset[] = [
    {
        id: 'recent-contracts',
        name: 'Contratos Recentes',
        description: 'Documentos jurídicos dos últimos 30 dias',
        icon: '📋',
        query: 'contrato',
        filters: {
            date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            mime_type: 'application/pdf'
        }
    },
    {
        id: 'pending-signatures',
        name: 'Pendentes de Assinatura',
        description: 'Documentos aguardando assinatura',
        icon: '✍️',
        query: 'assinatura pendente',
        filters: {
            status: 'active'
        }
    },
    {
        id: 'financial-docs',
        name: 'Documentos Financeiros',
        description: 'Faturas, recibos e comprovantes',
        icon: '💰',
        query: 'fatura OR recibo OR pagamento',
        filters: {}
    },
    {
        id: 'this-week',
        name: 'Desta Semana',
        description: 'Todos os documentos da semana atual',
        icon: '📅',
        filters: {
            date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    }
];

export const SearchView = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [totalHits, setTotalHits] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const handleSearch = async (searchQuery?: string) => {
        const q = searchQuery !== undefined ? searchQuery : query;
        if (!q.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        try {
            const response = await searchService.searchDocuments(q, filters);
            setResults(response.documents);
            setTotalHits(response.total_hits);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
            setTotalHits(0);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearFilters = () => {
        setFilters({});
        setActivePreset(null);
    };

    const applyPreset = (preset: SmartFilterPreset) => {
        setActivePreset(preset.id);
        setFilters(preset.filters);
        if (preset.query) {
            setQuery(preset.query);
            handleSearch(preset.query);
        } else {
            handleSearch('*');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const highlightText = (text: string, highlights?: { [key: string]: string[] }): string => {
        if (!highlights || Object.keys(highlights).length === 0) {
            return text.substring(0, 200) + (text.length > 200 ? '...' : '');
        }
        // Usar o primeiro highlight disponível
        const firstHighlight = Object.values(highlights)[0]?.[0];
        if (firstHighlight) {
            return firstHighlight;
        }
        return text.substring(0, 200) + (text.length > 200 ? '...' : '');
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType?.includes('pdf')) return '📄';
        if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
        if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return '📊';
        if (mimeType?.includes('image')) return '🖼️';
        return '📎';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Busca Semântica</h2>
                    <p className="text-xs text-muted-foreground">
                        Busca inteligente por conteúdo, contexto e significado
                    </p>
                </div>
            </div>

            {/* Smart Filter Presets */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-semibold text-foreground">Filtros Inteligentes</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {smartFilterPresets.map((preset) => (
                        <Card
                            key={preset.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                activePreset === preset.id
                                    ? 'border-orange-400 bg-orange-50/50 shadow-sm'
                                    : 'border-border hover:border-orange-300'
                            }`}
                            onClick={() => applyPreset(preset)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <div className="text-2xl shrink-0">{preset.icon}</div>
                                    <div className="min-w-0">
                                        <h4 className={`text-sm font-medium mb-0.5 ${activePreset === preset.id ? 'text-orange-700' : 'text-foreground'}`}>
                                            {preset.name}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                                            {preset.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Busque por conteúdo, palavras-chave, conceitos..."
                        className="pl-10 h-11 bg-background"
                    />
                </div>
                <Button
                    onClick={() => handleSearch()}
                    disabled={!query.trim() || isSearching}
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2 h-11 px-6"
                >
                    {isSearching ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
                    ) : (
                        <><Search className="w-4 h-4" /> Buscar</>
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2 h-11"
                >
                    <Filter className="w-4 h-4" />
                    Filtros
                    {Object.keys(filters).filter(k => filters[k as keyof SearchFilters]).length > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700">
                            {Object.keys(filters).filter(k => filters[k as keyof SearchFilters]).length}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card className="border-border/50 bg-secondary/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold">Filtros de Busca</h3>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Limpar Filtros
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Tipo de Arquivo</label>
                                <Select
                                    value={filters.mime_type}
                                    onValueChange={(value) => setFilters({ ...filters, mime_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos os tipos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos os tipos</SelectItem>
                                        <SelectItem value="application/pdf">PDF</SelectItem>
                                        <SelectItem value="application/msword">Word</SelectItem>
                                        <SelectItem value="application/vnd.ms-excel">Excel</SelectItem>
                                        <SelectItem value="image">Imagens</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos os status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos os status</SelectItem>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="archived">Arquivado</SelectItem>
                                        <SelectItem value="deleted">Deletado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Data</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={filters.date_from || ''}
                                        onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results Stats */}
            {hasSearched && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isSearching ? (
                        <span>Buscando documentos...</span>
                    ) : (
                        <>
                            <span className="font-medium text-foreground">{totalHits}</span>
                            {totalHits === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                            {query && (
                                <>
                                    para <span className="font-medium text-foreground">"{query}"</span>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Results */}
            {hasSearched && !isSearching && (
                <div className="space-y-3">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <Card
                                key={result.document_id}
                                className="group cursor-pointer hover:border-orange-300 hover:shadow-md transition-all duration-200"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl shrink-0">
                                            {getFileIcon(result.mime_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground group-hover:text-orange-600 transition-colors line-clamp-1">
                                                        {result.filename}
                                                    </h3>
                                                    {result.directory_name && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                            <Folder className="w-3 h-3" />
                                                            {result.directory_name}
                                                        </div>
                                                    )}
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-orange-100 text-orange-700 shrink-0"
                                                >
                                                    {Math.round(result.score * 100)}% relevante
                                                </Badge>
                                            </div>

                                            {/* Content Preview with Highlights */}
                                            {result.content && (
                                                <p
                                                    className="text-sm text-muted-foreground line-clamp-2 mb-3"
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightText(result.content, result.highlights)
                                                    }}
                                                />
                                            )}

                                            {/* Metadata */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(result.created_at)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {formatFileSize(result.file_size)}
                                                </div>
                                                {result.mime_type && (
                                                    <Badge variant="outline" className="text-[10px] py-0">
                                                        {result.mime_type.split('/')[1]?.toUpperCase()}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                            <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-medium">Nenhum resultado encontrado</p>
                            <p className="text-xs mt-1">Tente ajustar os termos de busca ou filtros</p>
                        </div>
                    )}
                </div>
            )}

            {/* Initial State */}
            {!hasSearched && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="font-medium text-foreground mb-2">Busca Semântica Inteligente</p>
                    <p className="text-sm text-center max-w-md">
                        Digite palavras-chave, conceitos ou perguntas. A IA buscará por significado e contexto, não apenas palavras exatas.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => { setQuery('contrato de prestação de serviços'); handleSearch('contrato de prestação de serviços'); }}
                        >
                            contrato de prestação de serviços
                        </Badge>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => { setQuery('fatura do mês passado'); handleSearch('fatura do mês passado'); }}
                        >
                            fatura do mês passado
                        </Badge>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => { setQuery('relatório de vendas'); handleSearch('relatório de vendas'); }}
                        >
                            relatório de vendas
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );
};
