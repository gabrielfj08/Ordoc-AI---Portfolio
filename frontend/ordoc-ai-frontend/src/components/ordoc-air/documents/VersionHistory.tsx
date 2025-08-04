'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import documentsService from '@/services/ordoc-air/documents';
import { OrdocAirDocument } from './DocumentCard';

interface VersionHistoryProps {
  document: OrdocAirDocument;
  onClose: () => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ document, onClose }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['document-versions', document.id],
    queryFn: () => documentsService.getVersions(document.id),
  });

  const handleDownload = async (versionId: number) => {
    const blob = await documentsService.download(versionId);
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">
            Versões - {document.title || document.filename}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>
        <div className="p-4 space-y-2">
          {isLoading && <div>Carregando versões...</div>}
          {error && <div>Erro ao carregar versões.</div>}
          {data &&
            data.map((version: any) => (
              <div
                key={version.id}
                className="flex items-center justify-between border rounded-md p-2"
              >
                <div>
                  <p className="text-sm font-medium">Versão {version.version}</p>
                  {version.created_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(version.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDownload(version.id)}
                  className="text-blue-600 text-sm"
                >
                  Baixar
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
