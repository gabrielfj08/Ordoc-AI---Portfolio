'use client';

import * as React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SelectOrganizationError = () => {
  return (
    <div className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-md px-4 py-3">
      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
      <span className="text-sm text-red-700">
        Erro ao carregar instituições
      </span>
    </div>
  );
};

export default SelectOrganizationError;
