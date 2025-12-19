'use client';

import * as React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SelectOrganizationProps } from './types';

const SelectOrganization = ({
  name,
  onChange,
  organizations,
  value = '',
  disabled = false,
  placeholder = 'Selecione a instituição',
}: SelectOrganizationProps) => {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md 
          bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          appearance-none truncate
        `}
      >
        <option value="">{placeholder}</option>
        {organizations.map((organization) => (
          <option value={organization.id} key={organization.id}>
            {organization.cnpj ? `${organization.cnpj} - ` : ''}{organization.corporateName}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDownIcon 
          className={`h-5 w-5 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
          aria-hidden="true" 
        />
      </div>
    </div>
  );
};

export default SelectOrganization;
