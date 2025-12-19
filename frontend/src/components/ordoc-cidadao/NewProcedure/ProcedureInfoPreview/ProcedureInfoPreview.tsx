'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcedurePreviewProps } from './types';

const ProcedureInfoPreview = ({
  subject,
  procedureTemplate,
}: ProcedurePreviewProps) => {
  // Mock user data - replace with real session data
  const mockUser = { name: 'João da Silva' };

  return (
    <div className="pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Prévia do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Solicitante:</span>
            <span className="text-gray-900">{mockUser.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Tipo de processo:</span>
            <span className="text-gray-900">{procedureTemplate?.name || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Assunto do processo:</span>
            <span className="text-gray-900">{subject?.name || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-700">Grupo responsável:</span>
            <span className="text-gray-900">{subject?.groupRequester?.name || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcedureInfoPreview;
