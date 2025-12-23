'use client';



import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    History,
    AlertCircle,
    Info,
    FileText,
    Download,
    Share2,
    Trash2,
    X,
    Maximize2,
    Loader2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { DocumentCard } from './document-card';
import { CategoriesView } from './categories-view';
import { TemplatesView } from './templates-view';
import { SignPendingView } from './signatures/sign-pending-view';
import { SignSignedView } from './signatures/sign-signed-view';
import { SignHistoryView } from './signatures/sign-history-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartUploadDialog } from './smart-upload-dialog';

// Types
interface Directory {
    id: string | number;
    name: string;
    healthStatus?: 'healthy' | 'needs_attention' | 'critical';
    pendingActions?: number;
    insights?: any[];
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
    const queryClient = useQueryClient();

    // Derived state from URL
    const currentView = searchParams.get('docView') || 'files'; // files, categories, templates, sign_pending, sign_signed, sign_history
    const currentDirId = searchParams.get('folder');
    const currentFolderName = searchParams.get('folderName');

    const [previewDocument, setPreviewDocument] = useState<any | null>(null);
    const [csvData, setCsvData] = useState<string[][] | null>(null);
    const [isLoadingCsv, setIsLoadingCsv] = useState(false);

    const handleCardClick = (doc: any) => {
        setPreviewDocument(doc);
        setCsvData(null); // Reset CSV data
    };

    // Effect to parse CSV if applicable
    useEffect(() => {
        if (previewDocument?.previewUrl && (previewDocument.type === 'CSV' || previewDocument.filename?.toLowerCase().endsWith('.csv'))) {
            setIsLoadingCsv(true);
            fetch(previewDocument.previewUrl)
                .then(res => res.text())
                .then(text => {
                    // Simple CSV Parser
                    const rows = text.split('\n').filter(r => r.trim() !== '');
                    const data = rows.map(r => {
                        // Handle simple comma or semicolon
                        if (r.indexOf(';') > -1) return r.split(';');
                        return r.split(',');
                    });
                    setCsvData(data);
                })
                .catch(err => console.error("Failed to parse CSV", err))
                .finally(() => setIsLoadingCsv(false));
        } else {
            setCsvData(null);
        }
    }, [previewDocument]);

    // Helper para verificar tipos
    const isImage = (filename?: string) => filename?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const isPDF = (filename?: string) => filename?.match(/\.pdf$/i);

    const handleAction = (action: 'download' | 'share' | 'delete', doc: any) => {
        console.log(`Action ${action} on doc ${doc.id}`);
        if (action === 'download') {
            const link = document.createElement('a');
            link.href = doc.previewUrl || '#';
            link.download = doc.filename || 'documento';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (action === 'share') {
            alert(`Compartilhar link de: ${doc.title}`);
        } else if (action === 'delete') {
            if (confirm(`Tem certeza que deseja excluir ${doc.title}?`)) {
                alert('Documento excluído (simulação).');
                queryClient.invalidateQueries({ queryKey: ['documents'] });
                setPreviewDocument(null);
            }
        }
    };

    const fetchDirectories = async (parentId: string | null) => {
        // TODO: Implement with real API when parentId support is added
        // For now, return root directories with insights
        if (parentId === null) {
            const { default: dashboardService } = await import('@/services/dashboard');
            const folders = await dashboardService.getFoldersWithInsights();
            return folders.map((f: any) => ({
                id: f.id,
                name: f.name,
                healthStatus: f.healthStatus || 'healthy',
                pendingActions: f.pendingActions || 0,
                insights: f.insights || []
            }));
        }
        return [];
    };

    const fetchDocuments = async (dirId: string | null) => {
        const { default: dashboardService } = await import('@/services/dashboard');

        if (dirId === null) {
            // Root level: show recent intelligent documents
            const docs = await dashboardService.getRecentDocumentsIntelligent();
            return docs.map((d: any) => ({
                id: d.id,
                title: d.name,
                filename: d.name,
                created_at: d.uploadedAt,
                suggested: d.suggested,
                suggestionReason: d.suggestionReason,
                relevanceScore: d.relevanceScore,
                previewUrl: d.previewUrl,
            }));
        }

        // TODO: Fetch documents for specific directory
        // For now returning empty if inside directory until folder logic is full
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

    const handleUploadComplete = () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['directories'] });
        // Optional: Show toast success
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
                            <SmartUploadDialog onUploadComplete={handleUploadComplete}>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                                    <Upload className="w-4 h-4" /> Upload
                                </Button>
                            </SmartUploadDialog>
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
                                    {(directories || []).map(dir => {
                                        const isHealthy = !dir.healthStatus || dir.healthStatus === 'healthy';
                                        const hasIssues = dir.healthStatus === 'needs_attention';
                                        const isCritical = dir.healthStatus === 'critical';

                                        const FolderContent = (
                                            <button
                                                onClick={() => handleNavigate(dir)}
                                                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors group ${isCritical ? 'hover:bg-red-50' : hasIssues ? 'hover:bg-yellow-50' : 'hover:bg-secondary/80'}`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="relative">
                                                        <Folder className={`w-4 h-4 ${isCritical ? 'text-red-500 fill-red-50' : hasIssues ? 'text-yellow-600 fill-yellow-50' : 'text-orange-400 fill-orange-50 group-hover:fill-orange-100'}`} />
                                                        {!isHealthy && (
                                                            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1 ring-white ${isCritical ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-sm font-medium truncate ${isCritical ? 'text-red-700' : hasIssues ? 'text-yellow-700' : 'text-foreground'}`}>
                                                        {dir.name}
                                                    </span>
                                                </div>

                                                {dir.pendingActions && dir.pendingActions > 0 && (
                                                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-background shadow-sm border">
                                                        {dir.pendingActions}
                                                    </Badge>
                                                )}
                                            </button>
                                        );

                                        if (dir.insights && dir.insights.length > 0) {
                                            return (
                                                <TooltipProvider key={dir.id}>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            {FolderContent}
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="max-w-[200px]" align="start">
                                                            <div className="flex flex-col gap-2">
                                                                <p className="font-semibold text-xs flex items-center gap-1.5">
                                                                    <Info className="w-3 h-3" /> Insights da Pasta
                                                                </p>
                                                                <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-3">
                                                                    {dir.insights.map((insight: any, idx: number) => (
                                                                        <li key={idx}>
                                                                            {insight.description}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        }

                                        return <div key={dir.id}>{FolderContent}</div>;
                                    })}
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
                                <section className="mb-8">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                        <Clock className="w-5 h-5 text-green-600" /> Recentes
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {documents.slice(0, 4).map((doc: any) => (
                                            <DocumentCard
                                                key={doc.id}
                                                title={doc.title}
                                                type={doc.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                                                updatedAt={formatDate(doc.created_at)}
                                                sharedBy={doc.sharedBy}
                                                suggested={doc.suggested}
                                                suggestionReason={doc.suggestionReason}
                                                relevanceScore={doc.relevanceScore}
                                                onClick={() => handleCardClick(doc)}
                                                onAction={(action) => handleAction(action, doc)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Files List */}
                            <section>
                                <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                    {currentFolderName || (documents && documents.length > 4 ? 'Outros Arquivos' : 'Arquivos')}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {(documents || [])
                                        .slice(currentDirId === null ? 4 : 0) // If root, skip first 4 (shown in Recents). If folder, show all.
                                        .map((doc: any) => (
                                            <DocumentCard
                                                key={doc.id}
                                                title={doc.title}
                                                type={doc.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                                                updatedAt={formatDate(doc.created_at)}
                                                sharedBy={doc.sharedBy}
                                                suggested={doc.suggested}
                                                suggestionReason={doc.suggestionReason}
                                                relevanceScore={doc.relevanceScore}
                                                onClick={() => handleCardClick(doc)}
                                                onAction={(action) => handleAction(action, doc)}
                                            />
                                        ))}
                                    {(documents || []).length === 0 && (
                                        <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                                            <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Esta pasta está vazia</p>
                                        </div>
                                    )}
                                    {currentDirId === null && documents && documents.length > 0 && documents.length <= 4 && (
                                        <p className="text-sm text-muted-foreground italic">Todos os documentos recentes estão listados acima.</p>
                                    )}
                                </div>
                            </section>
                        </>
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
            {/* Document Preview Modal */}
            <Dialog open={!!previewDocument} onOpenChange={(open) => !open && setPreviewDocument(null)}>
                <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">


                    // ...

                    <div className="flex items-center justify-between p-4 border-b bg-background z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold truncate max-w-[400px]">
                                    {previewDocument?.title || 'Documento'}
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    {previewDocument?.type} • {previewDocument?.updatedAt}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-secondary/20 flex flex-col items-center justify-center p-0 relative overflow-hidden">
                        {isLoadingCsv ? (
                            <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                                <p>Carregando CSV...</p>
                            </div>
                        ) : csvData ? (
                            <div className="w-full h-full overflow-auto bg-white p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {csvData[0]?.map((header, i) => (
                                                <TableHead key={i} className="whitespace-nowrap font-bold bg-muted/50">{header}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.slice(1).map((row, i) => (
                                            <TableRow key={i}>
                                                {row.map((cell, j) => (
                                                    <TableCell key={j} className="whitespace-nowrap">{cell}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : previewDocument?.previewUrl && isImage(previewDocument.filename) ? (
                            <div className="w-full h-full flex items-center justify-center bg-black/5">
                                <img
                                    src={previewDocument.previewUrl}
                                    className="max-w-full max-h-full object-contain shadow-lg"
                                    alt="Preview"
                                />
                            </div>
                        ) : previewDocument?.previewUrl && isPDF(previewDocument.filename) ? (
                            <iframe
                                src={previewDocument.previewUrl}
                                className="w-full h-full border-none bg-white"
                                title="Document Preview"
                            />
                        ) : (
                            /* Placeholder for unsupported types or when no previewUrl */
                            <div className="bg-white shadow-sm border rounded-xl w-[400px] h-[500px] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300 m-8">
                                <FileText className="w-24 h-24 text-gray-200 mb-6" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{previewDocument?.title}</h3>
                                <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
                                    Visualização não disponível para este formato.
                                </p>
                                {previewDocument?.previewUrl && (
                                    <Button
                                        className="gap-2 bg-orange-600 hover:bg-orange-700"
                                        onClick={() => handleAction('download', previewDocument)}
                                    >
                                        <Download className="w-4 h-4" /> Baixar para Visualizar
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t bg-background flex justify-between items-center">
                        <div className="text-xs text-muted-foreground flex gap-4">
                            <span>Tamanho: {previewDocument?.size || '2 MB'}</span>
                            <span>Criado em: {previewDocument?.updatedAt}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2" onClick={() => handleAction('share', previewDocument)}>
                                <Share2 className="w-4 h-4" /> Compartilhar
                            </Button>
                            <Button variant="default" onClick={() => setPreviewDocument(null)}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export { DocumentsView };
