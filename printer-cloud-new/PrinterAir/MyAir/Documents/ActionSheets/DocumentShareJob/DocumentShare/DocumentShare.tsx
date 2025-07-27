import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { ShareDocumentJobStatus } from '../../../../../constants';
import { DocumentShareProps } from './types';
import ShareStatusIcon from '../../StatusIcon';

const DocumentShare = ({ status }: DocumentShareProps) => {
  const JobMessage = () => {
    switch (status) {
      case ShareDocumentJobStatus.running:
        return <span>Em andamento....</span>;
      case ShareDocumentJobStatus.finished:
        return <span>Compartilhado com sucesso</span>;
      case ShareDocumentJobStatus.failed:
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

export default DocumentShare;
