'use client';

import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Download, Trash2, History, Upload } from 'lucide-react';
import documentsService from '@/services/ordoc-air/documents';
import { OrdocAirDocument } from './DocumentCard';
import DocumentPreview from './DocumentPreview';
import VersionHistory from './VersionHistory';

interface DocumentActionsProps {
  document: OrdocAirDocument;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ document: doc }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => documentsService.delete(doc.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const versionMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return documentsService.createVersion(doc.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleDownload = async () => {
    const blob = await documentsService.download(doc.id);
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.filename || doc.title || `document-${doc.id}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVersionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) versionMutation.mutate(file);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setPreviewOpen(true)}
        className="text-gray-600 hover:text-gray-900"
        title="Pré-visualizar"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={handleDownload}
        className="text-gray-600 hover:text-gray-900"
        title="Download"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-600 hover:text-gray-900"
        title="Nova versão"
      >
        <Upload className="w-4 h-4" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleVersionUpload}
        className="hidden"
      />
      <button
        onClick={() => setHistoryOpen(true)}
        className="text-gray-600 hover:text-gray-900"
        title="Versões"
      >
        <History className="w-4 h-4" />
      </button>
      <button
        onClick={() => deleteMutation.mutate()}
        className="text-red-600 hover:text-red-800"
        title="Excluir"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {previewOpen && (
        <DocumentPreview document={doc} onClose={() => setPreviewOpen(false)} />
      )}
      {historyOpen && (
        <VersionHistory document={doc} onClose={() => setHistoryOpen(false)} />
      )}
    </div>
  );
};

export default DocumentActions;
