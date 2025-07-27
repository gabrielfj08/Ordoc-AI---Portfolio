import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { StatusCellProps } from '../../types';

const StatusAssigneeDocumentCell = ({ signature }: StatusCellProps) => {
  const statusColorMapping: Record<string, string> = {
    running: 'yellow',
    signed: 'success',
  };

  const statusTooltipMapping: Record<string, string> = {
    running: 'Assinando o documento...',
    signed: 'Assinado',
  };

  return (
    <div className="hidden sm:flex items-center pl-3">
      <div
        id={`taskStatus${signature.id}`}
        data-tooltip-content={statusTooltipMapping[signature.status]}
        className="hidden sm:flex items-center justify-center"
      >
        <Icon
          alt="status"
          name="signaturesV3"
          w={25}
          h={25}
          stroke
          color={statusColorMapping[signature.status]}
          className={
            signature.status === 'running' ? 'animate-pulse' : 'animate-none'
          }
        />
        <ReactTooltip anchorId={`taskStatus${signature.id}`} />
      </div>
    </div>
  );
};

export default StatusAssigneeDocumentCell;
