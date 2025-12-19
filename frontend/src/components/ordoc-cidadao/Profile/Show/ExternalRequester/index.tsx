'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cpfMask, cnpjMask, phoneNumberMask } from '@/utils/ordoc-cidadao';

interface ShowExternalRequesterProfileProps {
  externalRequester: {
    id: number;
    name: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    birthDate?: string;
  };
}

const ShowExternalRequesterProfile = ({ externalRequester }: ShowExternalRequesterProfileProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(dateString));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Nome:</span>
            <p className="text-gray-900">{externalRequester.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-900">{externalRequester.email || 'Não informado'}</p>
          </div>
          {externalRequester.cpf && (
            <div>
              <span className="font-medium text-gray-700">CPF:</span>
              <p className="text-gray-900">{cpfMask(externalRequester.cpf)}</p>
            </div>
          )}
          {externalRequester.cnpj && (
            <div>
              <span className="font-medium text-gray-700">CNPJ:</span>
              <p className="text-gray-900">{cnpjMask(externalRequester.cnpj)}</p>
            </div>
          )}
          {externalRequester.phone && (
            <div>
              <span className="font-medium text-gray-700">Telefone:</span>
              <p className="text-gray-900">{phoneNumberMask(externalRequester.phone)}</p>
            </div>
          )}
          {externalRequester.birthDate && (
            <div>
              <span className="font-medium text-gray-700">Data de nascimento:</span>
              <p className="text-gray-900">{formatDate(externalRequester.birthDate)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowExternalRequesterProfile;
