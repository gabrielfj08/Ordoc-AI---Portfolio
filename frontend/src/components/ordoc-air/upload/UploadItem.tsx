'use client';

import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DocumentService } from '@/services/ordoc-air/documents';
import intelligenceService from '@/services/intelligence';
import UploadProgress from './UploadProgress';
import { Brain, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface UploadItemProps {
  file: File;
  autoAnalyze?: boolean;
}

type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

const UploadItem: React.FC<UploadItemProps> = ({ file, autoAnalyze = true }) => {
  const [progress, setProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [alertCount, setAlertCount] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: (f: File) =>
      DocumentService.uploadDocument(f, undefined, (p) => setProgress(p)),
    onSuccess: async (data) => {
      // Trigger AI analysis after successful upload
      if (autoAnalyze && data?.id) {
        await analyzeDocument(data.id, await file.text());
      }
    }
  });

  const analyzeDocument = async (documentId: string, content: string) => {
    setAnalysisStatus('analyzing');
    try {
      const result = await intelligenceService.analyzeDocument({
        document_id: documentId,
        document_content: content.slice(0, 10000), // Limit content size
        document_type: getDocType(file.name),
        analysis_depth: 'quick' // Quick analysis for upload
      });

      setAlertCount(result.alerts?.length || 0);
      setAnalysisStatus('complete');
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysisStatus('error');
    }
  };

  const getDocType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'legal';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'financial';
    return 'unknown';
  };

  useEffect(() => {
    uploadMutation.mutate(file);
  }, [file]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="truncate max-w-[200px]">{file.name}</span>
        <div className="flex items-center gap-2">
          {uploadMutation.isPending && <span className="text-muted-foreground">Enviando...</span>}
          {uploadMutation.isSuccess && <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Enviado</span>}
          {uploadMutation.isError && <span className="text-red-600">Erro</span>}
        </div>
      </div>
      <UploadProgress progress={progress} />

      {/* AI Analysis Status */}
      {uploadMutation.isSuccess && autoAnalyze && (
        <div className="flex items-center gap-2 text-xs mt-1">
          {analysisStatus === 'analyzing' && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span className="text-muted-foreground">Analisando com IA...</span>
            </>
          )}
          {analysisStatus === 'complete' && (
            <>
              <Brain className="w-3 h-3 text-primary" />
              <span className="text-primary">
                Análise completa{alertCount > 0 ? ` • ${alertCount} alerta${alertCount > 1 ? 's' : ''}` : ''}
              </span>
            </>
          )}
          {analysisStatus === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500">Análise indisponível</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadItem;

