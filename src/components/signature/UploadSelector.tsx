"use client";

import { UploadCloud, FileText, X, CheckCircle, AlertCircle, FolderOpen } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/queries/useDocuments";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface UploadSelectorProps {
    onFileReady: (file: File) => void;
    onDocumentSelected?: (documentId: string) => void;
    onCancel: () => void;
}

export const UploadSelector = ({ onFileReady, onDocumentSelected, onCancel }: UploadSelectorProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Buscar documentos existentes
    const { data: documentsData, isLoading } = useDocuments({
        page: 1,
        pageSize: 20,
    });
    const documents = documentsData?.results || [];

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Validar tipo
        if (file.type !== "application/pdf") {
            return { valid: false, error: "Apenas arquivos PDF são aceitos" };
        }

        // Validar tamanho (máximo 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB em bytes
        if (file.size > maxSize) {
            return { valid: false, error: "Arquivo muito grande. Máximo: 50MB" };
        }

        // Validar nome do arquivo
        if (file.name.length > 255) {
            return { valid: false, error: "Nome do arquivo muito longo" };
        }

        return { valid: true };
    };

    const handleFileSelect = (file: File) => {
        setError(null);

        const validation = validateFile(file);
        if (!validation.valid) {
            setError(validation.error || "Arquivo inválido");
            toast.error(validation.error || "Arquivo inválido");
            return;
        }

        setSelectedFile(file);
        toast.success("Arquivo selecionado com sucesso!");
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleProceed = () => {
        if (selectedFile) {
            onFileReady(selectedFile);
        }
    };

    const handleDocumentClick = (documentId: string) => {
        if (onDocumentSelected) {
            onDocumentSelected(documentId);
            toast.success("Documento selecionado!");
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-4xl space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Selecione o Documento</h2>
                    <p className="text-slate-500">Faça upload de um novo arquivo ou escolha um documento existente</p>
                </div>

                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Novo Upload
                        </TabsTrigger>
                        <TabsTrigger value="existing">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            Documentos Existentes
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: NOVO UPLOAD */}
                    <TabsContent value="upload" className="space-y-6">
                        {!selectedFile ? (
                            <div
                                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300
                                ${dragActive
                                    ? "border-orange-500 bg-orange-50 scale-102"
                                    : error
                                        ? "border-red-300 bg-red-50"
                                        : "border-slate-200 hover:border-orange-300 hover:bg-slate-50"
                                }
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleChange}
                                />

                                <div className="flex flex-col items-center gap-4 pointer-events-none">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors
                                        ${dragActive
                                            ? "bg-orange-100 text-orange-600"
                                            : error
                                                ? "bg-red-100 text-red-600"
                                                : "bg-slate-100 text-slate-400"
                                        }
                                    `}>
                                        {error ? (
                                            <AlertCircle size={40} />
                                        ) : dragActive ? (
                                            <FileText size={40} />
                                        ) : (
                                            <UploadCloud size={40} />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-slate-700">
                                            {error ? error : "Clique ou arraste seu arquivo PDF aqui"}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Suporta apenas arquivos PDF até 50MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Card className="p-6 bg-green-50 border-green-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {formatFileSize(selectedFile.size)} • PDF
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setError(null);
                                                }}
                                                className="text-slate-500 hover:text-red-600"
                                            >
                                                <X size={18} />
                                            </Button>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <Badge variant="outline" className="bg-white">
                                                <FileText className="h-3 w-3 mr-1" />
                                                Pronto para preparar
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <div className="flex justify-center gap-4">
                            <Button variant="ghost" onClick={onCancel} className="text-slate-500">
                                Voltar
                            </Button>
                            <Button
                                onClick={handleProceed}
                                disabled={!selectedFile}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                            >
                                Continuar
                            </Button>
                        </div>
                    </TabsContent>

                    {/* TAB: DOCUMENTOS EXISTENTES */}
                    <TabsContent value="existing" className="space-y-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <Card key={i} className="p-4 h-24 animate-pulse bg-slate-100" />
                                ))}
                            </div>
                        ) : documents.length === 0 ? (
                            <Card className="p-12 text-center">
                                <FolderOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">Nenhum documento encontrado</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Faça upload de um novo documento para começar
                                </p>
                            </Card>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                    {documents
                                        .filter(doc => doc.mime_type === 'application/pdf')
                                        .map((doc) => (
                                            <Card
                                                key={doc.id}
                                                className="p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => handleDocumentClick(doc.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-800 truncate">
                                                            {doc.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                                                        </p>
                                                        {doc.tags && doc.tags.length > 0 && (
                                                            <div className="flex gap-1 mt-2 flex-wrap">
                                                                {doc.tags.slice(0, 2).map((tag) => (
                                                                    <Badge key={tag.id} variant="secondary" className="text-xs">
                                                                        {tag.name}
                                                                    </Badge>
                                                                ))}
                                                                {doc.tags.length > 2 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        +{doc.tags.length - 2}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>

                                <div className="flex justify-center">
                                    <Button variant="ghost" onClick={onCancel} className="text-slate-500">
                                        Voltar
                                    </Button>
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
