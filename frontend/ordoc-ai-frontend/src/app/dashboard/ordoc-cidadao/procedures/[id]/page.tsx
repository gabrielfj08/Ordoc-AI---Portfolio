'use client';

import React from 'react';
import { useState } from 'react';
import ShowProcedureContainer from '@/components/ordoc-cidadao/ShowProcedure';

export default function ProcedureDetailsPage() {
  const [procedureName, setProcedureName] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {procedureName || 'Detalhes do Procedimento'}
            </h1>
          </div>
        </div>
      </div>
      
      <ShowProcedureContainer setProcedureName={setProcedureName} />
    </div>
  );
}
