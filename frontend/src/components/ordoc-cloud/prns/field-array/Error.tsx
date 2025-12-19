import * as React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PrnsFieldArrayError = () => {
  return (
    <div className="flex items-center space-x-2 justify-center py-4 text-red-600">
      <ExclamationTriangleIcon className="w-5 h-5" />
      <span className="text-sm">
        Erro ao carregar recursos. Tente novamente mais tarde.
      </span>
    </div>
  );
};

export default PrnsFieldArrayError;
