import * as React from 'react';
import { RestoreJobProps } from '../types';
import RestoreStatusIcon from '../StatusIcon';
import { Icon, Typography } from 'printer-ui';
import { RestoreJobStatus } from '../../../constants';

const RestoreDirectoryJob = ({ status }: RestoreJobProps) => {
  const JobMessage = () => {
    switch (status) {
      case RestoreJobStatus.running:
        return <span>Recuperando pasta(s)</span>;
      case RestoreJobStatus.finished:
        return <span>Pasta(s) recuperada(s) com sucesso</span>;
      case RestoreJobStatus.failed:
        return <span>Não foi possivel recuperar a(s) pasta(s)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon alt="folder" name="folderOutlined" stroke w={30} h={30} />
        <Typography variant="headline" className="truncate">
          <JobMessage />
        </Typography>
      </span>
      <RestoreStatusIcon status={status} />
    </div>
  );
};

export default RestoreDirectoryJob;
