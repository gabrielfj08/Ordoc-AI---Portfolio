'use client';

import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const SimpleOrganizationManagement = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BuildingOfficeIcon className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Gerenciamento de Organizações</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Gerencie organizações do sistema de forma simplificada.
      </p>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
          <span className="text-sm text-gray-700">Total de organizações</span>
          <span className="text-sm font-medium text-gray-900">0</span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
          <span className="text-sm text-gray-700">Organizações ativas</span>
          <span className="text-sm font-medium text-green-600">0</span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
          <span className="text-sm text-gray-700">Organizações inativas</span>
          <span className="text-sm font-medium text-red-600">0</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleOrganizationManagement;
