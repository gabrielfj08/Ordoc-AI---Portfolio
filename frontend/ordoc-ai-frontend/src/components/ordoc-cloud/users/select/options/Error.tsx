import * as React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SelectUserOptionsError = () => {
  return (
    <div className="m-2 flex items-center space-x-2 justify-center py-3 text-red-600">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span className="text-sm">
        Erro! Não foi possível carregar a lista de usuários, tente novamente
        mais tarde.
      </span>
    </div>
  );
};

export default SelectUserOptionsError;
