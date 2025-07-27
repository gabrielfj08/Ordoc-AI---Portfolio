import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { AssigneesListProps } from './types';
import { Icon, Typography } from 'printer-ui';

const AssigneesList = ({ signature }: AssigneesListProps) => {
  const SignatureIcon = ({ status }) => {
    switch (status) {
      case 'created':
        return (
          <div
            className="w-fit"
            id={`status-${signature.id}`}
            data-tooltip-content="Pendente"
          >
            <Icon
              alt="status"
              name="info"
              stroke
              color="yellow"
              className="rotate-180"
              w={26}
              h={26}
            />
            <ReactTooltip anchorId={`status-${signature.id}`} />
          </div>
        );
      case 'running':
        return (
          <div
            className="w-fit"
            id={`status-${signature.id}`}
            data-tooltip-content="Criando assinatura"
          >
            <Icon
              name="loadingCircle"
              alt="loadingCircle"
              className="animate-spin"
              stroke
            />
            <ReactTooltip anchorId={`status-${signature.id}`} />
          </div>
        );
      case 'refused':
        return (
          <div
            className="w-fit"
            id={`status-${signature.id}`}
            data-tooltip-content="Recusada"
          >
            <Icon alt="status" name="failed" fill color="error" w={26} h={26} />
            <ReactTooltip anchorId={`status-${signature.id}`} />
          </div>
        );
      case 'signed':
        return (
          <div
            className="w-fit"
            id={`status-${signature.id}`}
            data-tooltip-content="Assinada"
          >
            <Icon
              alt="status"
              name="finished"
              color="success"
              fill
              w={24}
              h={24}
            />
            <ReactTooltip anchorId={`status-${signature.id}`} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2 h-8">
        <SignatureIcon status={signature.status} />
        <Typography variant="footnote1" className="truncate">
          {signature.requester.name}
        </Typography>
      </div>
    </div>
  );
};
export default AssigneesList;
