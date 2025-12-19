'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import DocumentActions from './DocumentActions';

export interface OrdocAirDocument {
  id: number;
  title?: string;
  filename?: string;
  created_at?: string;
}

interface DocumentCardProps {
  document: OrdocAirDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const name = document.title || document.filename || `Documento ${document.id}`;
  const createdAt = document.created_at
    ? new Date(document.created_at).toLocaleDateString()
    : '';

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <FileText className="w-5 h-5 text-blue-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          {createdAt && (
            <p className="text-xs text-gray-500">Criado em {createdAt}</p>
          )}
        </div>
      </div>
      <DocumentActions document={document} />
    </div>
  );
};

export default DocumentCard;
