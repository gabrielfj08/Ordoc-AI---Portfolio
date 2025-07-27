import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { ShareDirectoryJobStatus } from '../../../../../constants';
import { DirectoryShareProps } from './types';
import ShareStatusIcon from '../StatusIcon/StatusIcon';

const DirectoryShare = ({ status }: DirectoryShareProps) => {
  const JobMessage = () => {
    switch (status) {
      case ShareDirectoryJobStatus.running:
        return <span>Em andamento....</span>;
      case ShareDirectoryJobStatus.finished:
        return <span>Compartilhado com sucesso</span>;
      case ShareDirectoryJobStatus.failed:
        return <span>Falha no compartilhamento</span>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-lighterGray justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon name="shared" alt="shared" fill />
        <Typography variant="headline" className="truncate">
          <JobMessage />
        </Typography>
      </span>
      <ShareStatusIcon status={status} />
    </div>
  );
};

export default DirectoryShare;
