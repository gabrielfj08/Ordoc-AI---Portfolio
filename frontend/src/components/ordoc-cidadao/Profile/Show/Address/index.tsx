'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShowAddressExternalRequesterProfileProps {
  externalRequester: {
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
}

const ShowAddressExternalRequesterProfile = ({ externalRequester }: ShowAddressExternalRequesterProfileProps) => {
  const { address } = externalRequester;

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum endereço cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Endereço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Logradouro:</span>
            <p className="text-gray-900">{address.street}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Número:</span>
            <p className="text-gray-900">{address.number}</p>
          </div>
          {address.complement && (
            <div>
              <span className="font-medium text-gray-700">Complemento:</span>
              <p className="text-gray-900">{address.complement}</p>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">Bairro:</span>
            <p className="text-gray-900">{address.neighborhood}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Cidade:</span>
            <p className="text-gray-900">{address.city}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Estado:</span>
            <p className="text-gray-900">{address.state}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">CEP:</span>
            <p className="text-gray-900">{address.zipCode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowAddressExternalRequesterProfile;
