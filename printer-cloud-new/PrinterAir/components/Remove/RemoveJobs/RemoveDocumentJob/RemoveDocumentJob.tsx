import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { TrashDocumentStatus } from '../../../../../services/printer-air/types';
import { RemoveJobsProps } from '../types';
import RemoveStatusIcon from '../StatusIcon';

const RemoveDocumentJob = ({ status }: RemoveJobsProps) => {
  const RemoveDocumentJobStatus: Record<string, TrashDocumentStatus> = {
    created: 'created',
    failed: 'failed',
    finished: 'finished',
    running: 'running',
  };

  const JobMessage = () => {
    switch (status) {
      case RemoveDocumentJobStatus.running:
        return <span>Removendo arquivo(s)</span>;
      case RemoveDocumentJobStatus.finished:
        return <span>Arquivo(s) removido(s) com sucesso</span>;
      case RemoveDocumentJobStatus.failed:
        return <span>Não foi possivel remover o(s) arquivo(s)</span>;
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

export default RemoveDocumentJob;
