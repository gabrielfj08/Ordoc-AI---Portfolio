"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BulkImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImportComplete?: () => void;
}

interface ImportResult {
    success: number;
    errors: number;
    details: {
        email: string;
        status: "success" | "error";
        message?: string;
    }[];
}

export const BulkImportDialog = ({
    open,
    onOpenChange,
    onImportComplete,
}: BulkImportDialogProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const csvContent = [
            "email,name,role,send_welcome_email",
            "usuario1@exemplo.com,João Silva,organization_member,true",
            "usuario2@exemplo.com,Maria Santos,organization_member,false",
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "template-importacao-usuarios.csv";
        link.click();

        toast.success("Template baixado com sucesso!");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith(".csv")) {
            toast.error("Formato inválido", {
                description: "Apenas arquivos CSV são aceitos",
            });
            return;
        }

        setFile(selectedFile);
        setImportResult(null);
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Selecione um arquivo CSV");
            return;
        }

        setIsUploading(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/v1/ordoc-cloud/users/bulk_import/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao importar usuários");
            }

            const result: ImportResult = await response.json();
            setImportResult(result);

            if (result.success > 0) {
                toast.success(`${result.success} usuário(s) importado(s) com sucesso!`, {
                    description:
                        result.errors > 0
                            ? `${result.errors} erro(s) encontrado(s)`
                            : undefined,
                });

                if (onImportComplete) {
                    onImportComplete();
                }
            } else {
                toast.error("Nenhum usuário foi importado", {
                    description: "Verifique os erros abaixo",
                });
            }
        } catch (error: any) {
            console.error("Erro ao importar:", error);
            toast.error("Erro ao importar usuários", {
                description: error.message || "Tente novamente",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setImportResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">
                        Importação em Massa (CSV)
                    </DialogTitle>
                    <DialogDescription>
                        Importe múltiplos usuários de uma vez usando um arquivo CSV
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Instruções */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-foreground mb-2">
                            Como funciona:
                        </h4>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Baixe o template CSV clicando no botão abaixo</li>
                            <li>Preencha com os dados dos usuários</li>
                            <li>
                                Colunas: <code>email</code>, <code>name</code>, <code>role</code>,{" "}
                                <code>send_welcome_email</code>
                            </li>
                            <li>Faça upload do arquivo preenchido</li>
                        </ol>
                    </div>

                    {/* Download Template */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={downloadTemplate}
                    >
                        <Download size={14} className="mr-2" />
                        Baixar Template CSV
                    </Button>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8">
                        <div className="flex flex-col items-center gap-4">
                            {file ? (
                                <>
                                    <FileText size={48} className="text-green-600" />
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleReset}
                                    >
                                        Trocar Arquivo
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Upload size={48} className="text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-foreground mb-1">
                                            Selecione o arquivo CSV
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Arraste e solte ou clique para selecionar
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Selecionar Arquivo
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Resultado da importação */}
                    {importResult && (
                        <div className="bg-muted rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-foreground">
                                    Resultado da Importação
                                </h4>
                                <div className="flex gap-3 text-xs">
                                    <span className="text-green-600 font-semibold">
                                        ✓ {importResult.success} sucesso
                                    </span>
                                    <span className="text-red-600 font-semibold">
                                        ✗ {importResult.errors} erros
                                    </span>
                                </div>
                            </div>

                            {/* Lista de resultados */}
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {importResult.details.map((detail, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start gap-2 p-2 rounded ${
                                            detail.status === "success"
                                                ? "bg-green-50"
                                                : "bg-red-50"
                                        }`}
                                    >
                                        {detail.status === "success" ? (
                                            <CheckCircle2
                                                size={16}
                                                className="text-green-600 mt-0.5 flex-shrink-0"
                                            />
                                        ) : (
                                            <AlertCircle
                                                size={16}
                                                className="text-red-600 mt-0.5 flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-foreground">
                                                {detail.email}
                                            </p>
                                            {detail.message && (
                                                <p className="text-xs text-muted-foreground">
                                                    {detail.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            handleReset();
                            onOpenChange(false);
                        }}
                        disabled={isUploading}
                    >
                        {importResult ? "Fechar" : "Cancelar"}
                    </Button>
                    {!importResult && (
                        <Button
                            onClick={handleImport}
                            disabled={!file || isUploading}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <Upload size={14} className="mr-2" />
                                    Importar Usuários
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
