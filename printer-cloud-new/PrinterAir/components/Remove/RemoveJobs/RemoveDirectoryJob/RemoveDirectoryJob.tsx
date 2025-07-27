import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { TrashDirectoryStatus } from '../../../../../services/printer-air/types';
import { RemoveJobsProps } from '../types';
import RemoveStatusIcon from '../StatusIcon';

const RemoveDirectoryJob = ({ status }: RemoveJobsProps) => {
  const RemoveDirectoryJobStatus: Record<string, TrashDirectoryStatus> = {
    created: 'created',
    failed: 'failed',
    finished: 'finished',
    running: 'running',
  };

  const JobMessage = () => {
    switch (status) {
      case RemoveDirectoryJobStatus.running:
        return <span>Removendo pasta(s)</span>;
      case RemoveDirectoryJobStatus.finished:
        return <span>Pasta(s) removida(s) com sucesso</span>;
      case RemoveDirectoryJobStatus.failed:
        return <span>Não foi possivel remover a(s) pasta(s)</span>;
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
      <RemoveStatusIcon status={status} />
    </div>
  );
};

export default RemoveDirectoryJob;
