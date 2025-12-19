'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NewExternalProcedures from '@/components/ordoc-cidadao/NewProcedure';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';

export default function NewProcedurePage() {
  const router = useRouter();

  const handleSubmit = async (values: { procedureTemplateId: number }) => {
    try {
      // TODO: Implement real API call
      console.log('Creating procedure:', values);
      
      // Mock response - replace with real service call
      const response = {
        id: 1,
        name: 'Novo Procedimento',
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return response;
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewExternalProcedures onSubmit={handleSubmit} />
    </div>
  );
}
