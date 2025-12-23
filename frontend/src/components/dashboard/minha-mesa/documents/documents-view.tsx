'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Folder,
    Search,
    Upload,
    Plus,
    Clock,
    Home,
    Grid,
    FileCode,
    Library,
    PenTool,
    BadgeCheck,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentCard } from './document-card';
import { CategoriesView } from './categories-view';
import { TemplatesView } from './templates-view';
import { FoldersView } from './folders-view';
import { SignPendingView } from './signatures/sign-pending-view';
import { SignSignedView } from './signatures/sign-signed-view';
import { SignHistoryView } from './signatures/sign-history-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface Directory {
    id: number;
    name: string;
}

// Helper para formatação de data
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `Há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
        if (diffHours < 24) return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
        if (diffDays < 7) return `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
        return date.toLocaleDateString('pt-BR');
    } catch {
        return dateString;
    }
};

const DocumentsView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Derived state from URL
    const currentView = searchParams.get('docView') || 'files'; // files, folders, categories, templates, sign_pending, sign_signed, sign_history
    const currentDirId = searchParams.get('folder') ? Number(searchParams.get('folder')) : null;
    const currentFolderName = searchParams.get('folderName');

    // --- Data Fetching Logic with Intelligence ---
    const fetchDirectories = async (parentId: number | null) => {
        // TODO: Implement with real API when parentId support is added
        // For now, return root directories
        if (parentId === null) {
            const { default: dashboardService } = await import('@/services/dashboard');
            const folders = await dashboardService.getFoldersWithInsights();
            return folders.map(f => ({ id: parseInt(f.id), name: f.name }));
        }
        return [];
    };

    const fetchDocuments = async (dirId: number | null) => {
        if (dirId === null) {
            // Root level: show recent intelligent documents
            const { default: dashboardService } = await import('@/services/dashboard');
            const docs = await dashboardService.getRecentDocumentsIntelligent();
            return docs.map(d => ({
                id: d.id,
                title: d.name,
                filename: d.name,
                created_at: d.uploadedAt,
                suggested: d.suggested,
                suggestionReason: d.suggestionReason,
                relevanceScore: d.relevanceScore,
            }));
        }
        // TODO: Fetch documents for specific directory
        return [];
    };

    const { data: directories } = useQuery({
        queryKey: ['directories', currentDirId],
        queryFn: () => fetchDirectories(currentDirId)
    });

    const { data: documents } = useQuery({
        queryKey: ['documents', currentDirId],
        queryFn: () => fetchDocuments(currentDirId)
    });

    // --- Navigation Handlers ---
    const handleNavigate = (dir: Directory) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('folder', dir.id.toString());
        params.set('folderName', dir.name);
        params.set('docView', 'files'); // Force files view
        router.push(`?${params.toString()}`);
    };

    const handleViewChange = (view: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('docView', view);
        if (view !== 'files') {
            params.delete('folder');
            params.delete('folderName');
        }
        router.push(`?${params.toString()}`);
    }

    const handleReset = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('folder');
        params.delete('folderName');
        params.set('docView', 'files');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Bar: Search & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    {/* Only show Back button if inside a specific folder in Files view */}
                    {currentView === 'files' && currentDirId !== null && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-primary gap-1 pl-0">
                            <Home className="w-4 h-4" /> Voltar ao Meu Drive
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar..." className="pl-9 w-[200px] h-9 bg-background" disabled title="Busca será implementada em breve" />
                    </div>

                    {currentView === 'files' && (
                        <>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                                <Upload className="w-4 h-4" /> Upload
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" /> Pasta
                            </Button>
                        </>
                    )}
                    {currentView === 'categories' && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                            <Plus className="w-4 h-4" /> Nova Categoria
                        </Button>
                    )}
                    {currentView === 'templates' && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                            <Plus className="w-4 h-4" /> Novo Template
                        </Button>
                    )}
                </div>
            </div>

            {/* View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Biblioteca */}
                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biblioteca</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            <button
                                onClick={() => handleViewChange('files')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'files' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <Folder className={`w-5 h-5 ${currentView === 'files' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Meu Drive</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('folders')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'folders' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <Library className={`w-5 h-5 ${currentView === 'folders' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Pastas com Insights</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('categories')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'categories' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <Grid className={`w-5 h-5 ${currentView === 'categories' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Categorias</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('templates')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'templates' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <FileCode className={`w-5 h-5 ${currentView === 'templates' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Templates</span>
                            </button>
                        </CardContent>
                    </Card>

                    {/* Assinaturas */}
                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assinaturas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            <button
                                onClick={() => handleViewChange('sign_pending')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'sign_pending' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <PenTool className={`w-5 h-5 ${currentView === 'sign_pending' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Pendentes</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('sign_signed')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'sign_signed' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <BadgeCheck className={`w-5 h-5 ${currentView === 'sign_signed' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Assinados</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('sign_history')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${currentView === 'sign_history' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <History className={`w-5 h-5 ${currentView === 'sign_history' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Histórico</span>
                            </button>
                        </CardContent>
                    </Card>

                    {/* Folder Structure (Only visible when in Files view) */}
                    {currentView === 'files' && (
                        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur animate-in fade-in slide-in-from-left-2 duration-300">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pastas</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="flex flex-col gap-1">
                                    {(directories || []).map(dir => (
                                        <button
                                            key={dir.id}
                                            onClick={() => handleNavigate(dir)}
                                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/80 text-left transition-colors group"
                                        >
                                            <Folder className="w-4 h-4 text-orange-400 fill-orange-50 group-hover:fill-orange-100" />
                                            <span className="text-sm font-medium text-foreground">{dir.name}</span>
                                        </button>
                                    ))}
                                    {directories?.length === 0 && (
                                        <p className="text-xs text-muted-foreground p-2">Nenhuma subpasta</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Files View */}
                    {currentView === 'files' && (
                        <>
                            {/* Recentes com IA */}
                            {currentDirId === null && documents && documents.length > 0 && (
                                <section>
                                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                        <Clock className="w-5 h-5 text-green-600" /> Recentes
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {documents.slice(0, 4).map((doc: any) => (
                                            <DocumentCard
                                                key={doc.id}
                                                title={doc.title}
                                                type={doc.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                                                updatedAt={formatDate(doc.created_at)}
                                                suggested={doc.suggested}
                                                suggestionReason={doc.suggestionReason}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Files List */}
                            {documents && documents.length > 4 && (
                                <section>
                                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                        {currentFolderName || 'Outros Arquivos'}
                                    </h2>
                                    <div className="flex flex-col gap-3">
                                        {documents.slice(4).map((doc: any) => (
                                            <DocumentCard
                                                key={doc.id}
                                                title={doc.title}
                                                type={doc.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                                                updatedAt={formatDate(doc.created_at)}
                                                suggested={doc.suggested}
                                                suggestionReason={doc.suggestionReason}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Empty State */}
                            {(!documents || documents.length === 0) && (
                                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                                    <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Nenhum documento encontrado</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Folders View */}
                    {currentView === 'folders' && (
                        <FoldersView />
                    )}

                    {/* Categories View */}
                    {currentView === 'categories' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Categorias do Sistema
                            </h2>
                            <CategoriesView />
                        </section>
                    )}

                    {/* Templates View */}
                    {currentView === 'templates' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Modelos de Documentos
                            </h2>
                            <TemplatesView />
                        </section>
                    )}

                    {/* Signatures: Pending */}
                    {currentView === 'sign_pending' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Pendentes de Assinatura
                            </h2>
                            <SignPendingView />
                        </section>
                    )}

                    {/* Signatures: Signed */}
                    {currentView === 'sign_signed' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Documentos Assinados
                            </h2>
                            <SignSignedView />
                        </section>
                    )}

                    {/* Signatures: History */}
                    {currentView === 'sign_history' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Histórico de Assinaturas
                            </h2>
                            <SignHistoryView />
                        </section>
                    )}

                </div>
            </div>
        </div>
    )
}

export { DocumentsView };
