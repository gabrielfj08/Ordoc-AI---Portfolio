'use client';

import React, { useEffect, useState } from 'react';
import documentsService from '@/services/ordoc-air/documents';
import { OrdocAirDocument } from './DocumentCard';

interface DocumentPreviewProps {
  document: OrdocAirDocument;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    documentsService.download(document.id).then((blob) => {
      if (revoked) return;
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [document.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-11/12 h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {document.title || document.filename}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {url ? (
            <iframe src={url} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              Carregando pré-visualização...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
