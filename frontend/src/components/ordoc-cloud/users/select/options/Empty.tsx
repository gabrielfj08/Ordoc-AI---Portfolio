import * as React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const AddUserSelectEmpty = () => {
  return (
    <div className="flex items-center space-x-2 justify-center py-3 px-4 text-gray-500">
      <UserIcon className="w-4 h-4" />
      <span className="text-sm">
        Nenhum usuário encontrado!
      </span>
    </div>
  );
};

export default AddUserSelectEmpty;
