'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export interface RecentDocument {
  id: number;
  document: number;
  document_name: string;
  document_status?: string;
  accessed_at?: string;
  access_type?: string;
}

interface RecentCardProps {
  recent: RecentDocument;
}

const RecentCard: React.FC<RecentCardProps> = ({ recent }) => {
  const accessedAt = recent.accessed_at
    ? new Date(recent.accessed_at).toLocaleDateString('pt-BR')
    : '';

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm flex items-start space-x-3">
      <FileText className="w-5 h-5 text-blue-600 mt-1" />
      <div>
        <p className="text-sm font-medium text-gray-900">{recent.document_name}</p>
        {accessedAt && (
          <p className="text-xs text-gray-500">Acessado em {accessedAt}</p>
        )}
      </div>
    </div>
  );
};

export default RecentCard;
