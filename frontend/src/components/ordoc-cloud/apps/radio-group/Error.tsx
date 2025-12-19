'use client';

import * as React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AppsRadioGroupError = () => {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-md h-16 px-5 bg-red-50">
      <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
      <span className="text-sm text-gray-600">
        Erro ao carregar aplicativos
      </span>
    </div>
  );
};

export default AppsRadioGroupError;
