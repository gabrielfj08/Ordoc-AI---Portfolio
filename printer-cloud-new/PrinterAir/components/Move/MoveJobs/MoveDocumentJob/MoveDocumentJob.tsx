import * as React from 'react';
import { MoveJobProps } from '../types';
import MoveStatusIcon from '../StatusIcon';
import { Icon, Typography } from 'printer-ui';
import { MoveJobStatus } from '../../../../constants';

const MoveDocumentJob = ({ status }: MoveJobProps) => {
  const JobMessage = () => {
    switch (status) {
      case MoveJobStatus.running:
        return <span>Movendo arquivo(s)</span>;
      case MoveJobStatus.finished:
        return <span>Arquivo(s) movido(s) com sucesso</span>;
      case MoveJobStatus.failed:
        return <span>Não foi possivel mover o(s) arquivo(s)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon alt="files" name="fileV2" fill />
        <Typography variant="headline" className="truncate">
          <JobMessage />
        </Typography>
      </span>
      <MoveStatusIcon status={status} />
    </div>
  );
};

export default MoveDocumentJob;
