"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, UploadProgress } from '@/services/documents';
import { toast } from 'sonner';

export interface FileUploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'waiting' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export const useFileUpload = () => {
  const [uploads, setUploads] = useState<FileUploadStatus[]>([]);
  const queryClient = useQueryClient();

  const uploadFile = useCallback(async (file: File, directoryId?: string) => {
    const fileId = Math.random().toString(36).substring(7);

    // Adiciona o ficheiro à fila de espera
    const newUpload: FileUploadStatus = {
      id: fileId,
      name: file.name,
      progress: 0,
      status: 'uploading'
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      // Upload real usando documentService
      await documentService.upload(
        file,
        directoryId,
        (progressData: UploadProgress) => {
          setUploads(prev => prev.map(u =>
            u.id === fileId
              ? { ...u, progress: progressData.percentage }
              : u
          ));
        }
      );

      // Marca como completo
      setUploads(prev => prev.map(u =>
        u.id === fileId
          ? { ...u, progress: 100, status: 'complete' }
          : u
      ));

      // Invalida queries para atualizar lista
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      toast.success(`${file.name} enviado com sucesso!`);
    } catch (error: any) {
      console.error('Upload failed:', error);

      setUploads(prev => prev.map(u =>
        u.id === fileId
          ? {
            ...u,
            status: 'error',
            error: error.response?.data?.detail || 'Erro no upload'
          }
          : u
      ));

      toast.error(`Erro ao enviar ${file.name}`);
    }
  }, [queryClient]);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'complete'));
  }, []);

  const clearAll = useCallback(() => {
    setUploads([]);
  }, []);

  const retryUpload = useCallback((uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId);
    if (upload && upload.status === 'error') {
      // Remove o upload com erro e tenta novamente
      setUploads(prev => prev.filter(u => u.id !== uploadId));
      // Aqui precisaríamos do File original, por isso vamos apenas remover
      toast.info('Selecione o arquivo novamente para tentar o upload');
    }
  }, [uploads]);

  return {
    uploads,
    uploadFile,
    clearCompleted,
    clearAll,
    retryUpload,
  };
};