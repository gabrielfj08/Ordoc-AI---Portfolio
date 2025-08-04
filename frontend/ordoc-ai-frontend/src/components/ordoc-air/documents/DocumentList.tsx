'use client';

import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import documentsService from '@/services/ordoc-air/documents';
import DocumentCard, { OrdocAirDocument } from './DocumentCard';

interface DocumentListProps {
  directoryId: number | null;
}

const DocumentList: React.FC<DocumentListProps> = ({ directoryId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', directoryId],
    queryFn: () =>
      directoryId
        ? documentsService.list({ directory: directoryId })
        : documentsService.list({ directory: null }),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      if (directoryId) formData.append('directory', String(directoryId));
      return documentsService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', directoryId] });
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  if (isLoading) return <div>Carregando documentos...</div>;
  if (error) return <div>Erro ao carregar documentos.</div>;

  const documents: OrdocAirDocument[] = data?.results || data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          disabled={uploadMutation.isPending}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
