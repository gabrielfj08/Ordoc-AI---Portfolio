'use client';

import { useState, useEffect } from 'react';
import { documentService } from '@/services/documents';
import { Loader2, FileQuestion } from 'lucide-react';

interface DocumentPreviewProps {
    documentId: string;
    mimeType: string;
    className?: string;
}

export function DocumentPreview({ documentId, mimeType, className = '' }: DocumentPreviewProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPreview = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const blob = await documentService.download(documentId);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
            } catch (err: any) {
                console.error('Failed to load preview:', err);
                setError(err.response?.data?.detail || 'Erro ao carregar preview');
            } finally {
                setIsLoading(false);
            }
        };

        // Apenas carregar preview para tipos suportados
        if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
            loadPreview();
        } else {
            setIsLoading(false);
            setError('Preview não disponível para este tipo de arquivo');
        }

        // Cleanup
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [documentId, mimeType]);

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Carregando preview...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
                <FileQuestion className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    if (!previewUrl) {
        return null;
    }

    // Preview de imagem
    if (mimeType.startsWith('image/')) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-slate-50 p-2 ${className}`}>
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg bg-white"
                />
            </div>
        );
    }

    // Preview de PDF - Usando object para maior compatibilidade e visual limpo
    if (mimeType === 'application/pdf') {
        const viewerUrl = `${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
        return (
            <div className={`w-full h-full bg-white flex flex-col items-center justify-start ${className}`}>
                <object
                    data={viewerUrl}
                    type="application/pdf"
                    className="w-full h-full border-0"
                >
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-0"
                        title="PDF Preview"
                    />
                </object>
            </div>
        );
    }

    return null;
}
