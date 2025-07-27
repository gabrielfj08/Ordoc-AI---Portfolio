import * as React from 'react';
import { SelectOrganizationProps } from './types';

const SelectOrganization = ({
  name,
  onChange,
  organizations,
}: SelectOrganizationProps) => {
  return (
    <div className="inline-block relative w-full">
      <select
        name={name}
        onChange={onChange}
        className="block appearance-none w-full h-9 bg-white border border-gray-400 hover:border-gray-500 pl-4 pr-6 py- rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
      >
        <option value="">Selectione a instituição</option>
        {organizations.map((organization) => (
          <option value={organization.id} key={organization.id}>
            {organization.cnpj} - {organization.corporateName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 flex items-center text-gray-700">
        <svg
          className="fill-current h-9 w-4 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default SelectOrganization;
