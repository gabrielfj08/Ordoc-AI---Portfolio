import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { dashboardService } from '@/services/dashboard';
import { Button } from '@/components/ui/button';
import {
    Upload,
    X,
    FileText,
    Brain,
    FolderInput,
    CheckCircle2,
    Loader2,
    MoveRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface SmartUploadDialogProps {
    children: React.ReactNode;
    onUploadComplete?: () => void;
}

interface UploadFile {
    file: File;
    status: 'pending' | 'analyzing' | 'ready' | 'uploading' | 'complete' | 'error';
    suggestedFolder?: {
        id: string;
        name: string;
        confidence: number;
        reason: string;
    };
    progress: number;
}

// Mock folders for suggestion
const AVAILABLE_FOLDERS = [
    { id: '1', name: 'Contratos' },
    { id: '2', name: 'Financeiro' },
    { id: '3', name: 'RH' },
    { id: '4', name: 'Marketing' },
    { id: '5', name: 'Projetos' },
    { id: 'root', name: 'Meu Drive' }
];

export const SmartUploadDialog: React.FC<SmartUploadDialogProps> = ({ children, onUploadComplete }) => {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const analyzeFile = async (file: File): Promise<{ folderId: string, reason: string, confidence: number }> => {
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

        const name = file.name.toLowerCase();

        if (name.includes('contrato') || name.includes('aditivo') || name.includes('nda')) {
            return { folderId: '1', reason: 'Detectado documento jurídico', confidence: 0.95 };
        }
        if (name.includes('fatura') || name.includes('nota') || name.includes('recibo') || name.includes('pagamento')) {
            return { folderId: '2', reason: 'Documento financeiro identificado', confidence: 0.92 };
        }
        if (name.includes('cv') || name.includes('curriculo') || name.includes('ferias')) {
            return { folderId: '3', reason: 'Documento relacionado a RH', confidence: 0.88 };
        }
        if (name.includes('briefing') || name.includes('post') || name.includes('campanha')) {
            return { folderId: '4', reason: 'Ativo de marketing detectado', confidence: 0.85 };
        }

        return { folderId: 'root', reason: 'Nenhuma categoria específica detectada', confidence: 0.4 };
    };

    const handleFiles = async (newFiles: File[]) => {
        const uploadFiles: UploadFile[] = newFiles.map(f => ({
            file: f,
            status: 'pending',
            progress: 0
        }));

        setFiles(prev => [...prev, ...uploadFiles]);

        // Process analysis one by one (or parallel)
        const updatedFiles = [...files, ...uploadFiles];

        // Trigger analysis for new files
        for (let i = files.length; i < updatedFiles.length; i++) {
            setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'analyzing' } : f));

            const analysis = await analyzeFile(updatedFiles[i].file);
            const folder = AVAILABLE_FOLDERS.find(f => f.id === analysis.folderId) || AVAILABLE_FOLDERS[5];

            setFiles(prev => prev.map((f, idx) => idx === i ? {
                ...f,
                status: 'ready',
                suggestedFolder: {
                    id: analysis.folderId,
                    name: folder.name,
                    reason: analysis.reason,
                    confidence: analysis.confidence
                }
            } : f));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleUpload = async () => {
        // Simulate upload process
        const unfinished = files.filter(f => f.status === 'ready');
        if (unfinished.length === 0) return;

        // Set all ready files to uploading
        setFiles(prev => prev.map(f => f.status === 'ready' ? { ...f, status: 'uploading' } : f));

        // Simulate progress per file
        for (const fileObj of unfinished) {
            // Register mock document in service
            await dashboardService.uploadDocumentMock(fileObj.file, fileObj.suggestedFolder?.name || 'Meu Drive');

            // Simular progresso visual
            for (let i = 0; i <= 100; i += 20) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setFiles(prev => prev.map(f => f.file === fileObj.file ? { ...f, progress: i } : f));
            }
            setFiles(prev => prev.map(f => f.file === fileObj.file ? { ...f, status: 'complete', progress: 100 } : f));
        }

        setTimeout(() => {
            if (onUploadComplete) onUploadComplete();
            setOpen(false);
            setFiles([]);
        }, 800);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-orange-600" /> Upload Inteligente
                    </DialogTitle>
                    <DialogDescription className="hidden">
                        Faça upload de documentos com análise automática de pasta e organização inteligente.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-2">
                    {/* Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-border hover:border-orange-400/50 hover:bg-accent/30'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                        />
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                                <Upload className="w-6 h-6 text-orange-600" />
                            </div>
                            <p className="font-medium text-foreground">Clique para selecionar ou arraste arquivos aqui</p>
                            <p className="text-xs">Identificaremos automaticamente a melhor pasta para organizar seus documentos.</p>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-3 bg-card border rounded-lg animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-sm font-medium truncate">{file.file.name}</p>
                                                <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(idx)} disabled={file.status === 'uploading' || file.status === 'complete'}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* AI Analysis / Suggestion */}
                                    {file.status === 'analyzing' && (
                                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded animate-pulse">
                                            <Brain className="w-3 h-3" />
                                            Analisando conteúdo para sugerir pasta...
                                        </div>
                                    )}

                                    {(file.status === 'ready' || file.status === 'uploading' || file.status === 'complete') && file.suggestedFolder && (
                                        <div className="flex items-center justify-between gap-2 p-2 bg-secondary/30 rounded text-xs">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 gap-1 pl-1">
                                                    <Brain className="w-3 h-3" /> IA Sugere
                                                </Badge>
                                                <MoveRight className="w-3 h-3 text-muted-foreground" />
                                                <div className="flex items-center gap-1 font-medium text-foreground">
                                                    <FolderInput className="w-3.5 h-3.5 text-orange-500" />
                                                    {file.suggestedFolder.name}
                                                </div>
                                            </div>
                                            {file.status === 'ready' && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className="text-muted-foreground hover:text-foreground underline decoration-dashed">
                                                            Por quê?
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{file.suggestedFolder.reason}</p>
                                                            <p className="text-xs opacity-70 mt-1">Confiança: {(file.suggestedFolder.confidence * 100).toFixed(0)}%</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress */}
                                    {file.status === 'uploading' && (
                                        <div className="space-y-1">
                                            <Progress value={file.progress} className="h-1.5" />
                                            <p className="text-[10px] text-right text-muted-foreground">Enviando para {file.suggestedFolder?.name}...</p>
                                        </div>
                                    )}

                                    {file.status === 'complete' && (
                                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                            <CheckCircle2 className="w-3 h-3" /> Upload concluído
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={files.some(f => f.status === 'uploading')}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                        disabled={files.length === 0 || files.some(f => f.status === 'analyzing' || f.status === 'uploading' || f.status === 'complete')}
                        onClick={handleUpload}
                    >
                        {files.some(f => f.status === 'uploading') ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                        ) : (
                            <><Upload className="w-4 h-4" /> Confirmar Upload</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
