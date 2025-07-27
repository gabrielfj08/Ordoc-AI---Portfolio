import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { UserGroupsCellProps } from './types';

const UserGroupCell = ({ userGroup }: UserGroupsCellProps) => {
  const textStatus = () => {
    if (userGroup.status == 'inactive') {
      return 'gray';
    }
  };

  const iconStatus = () => {
    if (userGroup.status == 'inactive') {
      return 'opacity-50';
    }
  };

  return (
    <div className="px-4 cursor-pointer truncate sm:max-w-[600px]">
      <div className="flex gap-2 items-center">
        <div>
          <Icon
            alt="Icone de Grupo"
            name="groupV2"
            className={iconStatus()}
            fill
            w={40}
            h={40}
          />
        </div>
        <div className="w-44 sm:w-full truncate">
          <Typography
            color={textStatus()}
            family="robotoBold"
            className="truncate"
          >
            {userGroup.name}
          </Typography>
          <Typography color={textStatus()} className="truncate sm:w-full">
            {userGroup.description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default UserGroupCell;
