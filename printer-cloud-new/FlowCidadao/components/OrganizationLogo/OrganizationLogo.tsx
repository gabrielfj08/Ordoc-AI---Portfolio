import * as React from 'react';
import { OrganizationLogoProps } from './types';

const OrganizationLogo = ({ src }: OrganizationLogoProps) => {
  return (
    <div className="w-32 h-[100px] sm:w-44 sm:h-[159px] relative flex items-center">
      <img alt="Logo da prefeitura" src={src} />
    </div>
  );
};

export default OrganizationLogo;
