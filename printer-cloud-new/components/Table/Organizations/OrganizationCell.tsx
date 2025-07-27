import * as React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Typography } from 'printer-ui';
import { OrganizationCellProps } from './types';

const OrganizationCell = ({ organization }: OrganizationCellProps) => {
  const router = useRouter();
  const textStatus = () => {
    if (organization.status == 'inactive') {
      return 'gray';
    }
  };

  const avatarStatus = () => {
    if (organization.status == 'inactive') {
      return 'opacity-50';
    }
  };

  return (
    <div
      className="items-center cursor-pointer"
      onClick={() => {
        router.push(`/printer-cloud/organizations/${organization.id}`);
      }}
    >
      <div className="flex items-center gap-2 pl-3">
        <Avatar
          size="md"
          placeholder={organization.corporateName.charAt(0)}
          src={
            organization.logoUrl
              ? organization.logoUrl
              : '/assets/institution-logo.png'
          }
          className={avatarStatus()}
        />
        <div className="w-44 sm:w-auto truncate">
          <Typography
            family="robotoBold"
            className="truncate"
            color={textStatus()}
          >
            {organization.corporateName}
          </Typography>
          <Typography color={textStatus()} className="truncate">
            {organization.email}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCell;
