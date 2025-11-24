'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShowProcedureProps } from './types';
import ProcedureStatusTag from './StatusTag';
import PayloadValueFormatting from './PayloadValueFormatting';
import ShowProcedureTabNavigation from './TabNavigation';
import { Share, Printer, XCircle } from 'lucide-react';

const ShowProcedure = ({ procedure, generateReport }: ShowProcedureProps) => {
  // Mock external session data - replace with real session
  const mockExternalSession = { user: { id: 1 } };

  const handleShareProcedure = () => {
    // TODO: Implement share procedure modal
    console.log('Share procedure:', procedure.id);
  };

  const handleCancelProcedure = () => {
    // TODO: Implement cancel procedure modal
    console.log('Cancel procedure:', procedure.id);
  };

  return (
    <main className="p-6 space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4">
        {procedure.requesterId === mockExternalSession?.user?.id && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareProcedure}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Compartilhar processo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateReport}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Gerar comprovante
            </Button>
            {procedure.status === 'started' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelProcedure}
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Solicitar cancelamento
              </Button>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Status:</span>
          <ProcedureStatusTag status={procedure.status} />
        </div>
      </div>

      {/* Procedure Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Dados do processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Data de criação:</span>
              <p className="text-gray-900">
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                }).format(
                  new Date(
                    new Date(procedure.createdAt).toISOString().replace('.000Z', '')
                  )
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Solicitante:</span>
              <p className="text-gray-900">{procedure.requester.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tipo de processo:</span>
              <p className="text-gray-900">{procedure.parentProcedureTemplateName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Assunto do processo:</span>
              <p className="text-gray-900">{procedure.procedureTemplateName}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Grupo responsável:</span>
              <p className="text-gray-900">{procedure.responsibleGroup.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedure Fields */}
      {procedure.payload?.map((payloadItem, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-blue-600 text-lg">
              {payloadItem.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PayloadValueFormatting
              fieldType={payloadItem.fieldType}
              value={payloadItem.value}
              procedureId={procedure.id}
            />
          </CardContent>
        </Card>
      ))}

      {/* Tab Navigation */}
      <ShowProcedureTabNavigation />
    </main>
  );
};

export default ShowProcedure;
