'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';

interface ReportProps {
  reportData: {
    messages: Array<{
      id: number;
      createdAt: string;
      message: string;
      user: { name: string };
      type: string;
    }>;
  };
}

const Report = ({ reportData }: ReportProps) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-600">Histórico do Procedimento</h3>
      
      {reportData?.messages?.length > 0 ? (
        <div className="space-y-3">
          {reportData.messages.map((message) => (
            <Card key={message.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{message.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{message.user.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={message.type === 'system' ? 'secondary' : 'default'}>
                    {message.type === 'system' ? 'Sistema' : 'Usuário'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Nenhuma movimentação encontrada
        </div>
      )}
    </div>
  );
};

export default Report;
