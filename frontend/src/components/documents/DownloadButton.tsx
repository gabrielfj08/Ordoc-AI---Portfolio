'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentService } from '@/services/documents';
import { toast } from 'sonner';

interface DownloadButtonProps {
    documentId: string;
    documentName: string;
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    showLabel?: boolean;
}

export function DownloadButton({
    documentId,
    documentName,
    variant = 'ghost',
    size = 'sm',
    className = '',
    showLabel = true
}: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsDownloading(true);
        try {
            const blob = await documentService.download(documentId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = documentName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`${documentName} baixado com sucesso!`);
        } catch (error: any) {
            console.error('Download failed:', error);
            toast.error(error.response?.data?.detail || 'Erro ao baixar documento');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={isDownloading}
            className={className}
            title="Download"
        >
            {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {showLabel && (
                <span className="ml-2">
                    {isDownloading ? 'Baixando...' : 'Download'}
                </span>
            )}
        </Button>
    );
}
