'use client';

import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ExternalRequesterProfile from '@/components/ordoc-cidadao/Profile';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
  const [type, setType] = useState<'show' | 'edit'>('show');

  // Mock data for external requester - replace with real API call
  const { data: externalRequester, isLoading, isError } = useQuery({
    queryKey: ['externalRequester'],
    queryFn: async () => ({
      id: 1,
      name: 'João da Silva Santos',
      email: 'joao.silva@email.com',
      cpf: '12345678901',
      phone: '11999887766',
      birthDate: '1990-05-15',
      address: {
        street: 'Rua das Flores, 123',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      notifications: {
        email: true,
        sms: false
      }
    })
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !externalRequester) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar dados do perfil. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExternalRequesterProfile
        externalRequester={externalRequester}
        type={type}
        setType={setType}
      />
    </div>
  );
}
