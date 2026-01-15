"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, UploadProgress } from '@/services/documents';
import intelligenceService from '@/services/intelligence';
import { toast } from 'sonner';

export interface FileUploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'waiting' | 'uploading' | 'analyzing' | 'complete' | 'error';
  error?: string;
  documentId?: string;
  analysisStatus?: 'pending' | 'analyzing' | 'complete' | 'failed';
}

export const useFileUpload = (options?: { autoAnalyze?: boolean }) => {
  const [uploads, setUploads] = useState<FileUploadStatus[]>([]);
  const queryClient = useQueryClient();
  const autoAnalyze = options?.autoAnalyze !== false; // true por padrão

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
      const uploadResult = await documentService.upload(
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

      const documentId = uploadResult?.id || uploadResult?.data?.id;

      // Marca upload como completo
      setUploads(prev => prev.map(u =>
        u.id === fileId
          ? {
              ...u,
              progress: 100,
              status: autoAnalyze ? 'analyzing' : 'complete',
              documentId,
              analysisStatus: autoAnalyze ? 'pending' : undefined
            }
          : u
      ));

      // Invalida queries para atualizar lista
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      toast.success(`${file.name} enviado com sucesso!`);

      // Análise automática com IA (se habilitado)
      if (autoAnalyze && documentId) {
        setUploads(prev => prev.map(u =>
          u.id === fileId
            ? { ...u, analysisStatus: 'analyzing' }
            : u
        ));

        toast.info(`Analisando ${file.name} com IA...`, { duration: 2000 });

        try {
          // Dispara análise assíncrona (não bloqueia UI)
          intelligenceService.analyzeDocument({
            document_id: documentId,
            document_content: '', // Backend extrai do arquivo
            analysis_depth: 'quick', // quick para não travar
          }).then((analysisResult) => {
            setUploads(prev => prev.map(u =>
              u.id === fileId
                ? { ...u, status: 'complete', analysisStatus: 'complete' }
                : u
            ));

            // Invalida queries de intelligence para atualizar alertas
            queryClient.invalidateQueries({ queryKey: ['intelligence'] });

            // Mostra toast apenas se houver alertas importantes
            if (analysisResult.alerts && analysisResult.alerts.length > 0) {
              const criticalAlerts = analysisResult.alerts.filter(a =>
                a.severity === 'critical' || a.severity === 'high'
              );

              if (criticalAlerts.length > 0) {
                toast.warning(
                  `${criticalAlerts.length} alerta(s) identificado(s) em ${file.name}`,
                  { duration: 5000 }
                );
              } else {
                toast.success(`${file.name} analisado com sucesso!`);
              }
            }
          }).catch((analysisError) => {
            console.error('Analysis failed:', analysisError);
            setUploads(prev => prev.map(u =>
              u.id === fileId
                ? { ...u, status: 'complete', analysisStatus: 'failed' }
                : u
            ));
            // Não mostra toast de erro de análise para não poluir UI
            // O documento já foi enviado com sucesso
          });
        } catch (error) {
          console.error('Failed to trigger analysis:', error);
        }
      }

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
  }, [queryClient, autoAnalyze]);

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