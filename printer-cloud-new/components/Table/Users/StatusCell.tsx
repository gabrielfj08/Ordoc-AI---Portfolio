import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { UsersCellProps } from './types';

const StatusCell = ({ user }: UsersCellProps) => {
  const RenderIcon = () => {
    switch (user.status) {
      case 'active':
        return (
          <div
            className="w-fit"
            id={`status-${user.id}`}
            data-tooltip-content="Ativo"
          >
            <Icon
              alt="userTrue"
              name="userTrue"
              fill
              color="black"
              w={30}
              h={30}
            />
            <ReactTooltip anchorId={`status-${user.id}`} />
          </div>
        );
      case 'inactive':
        return (
          <div
            className="w-fit"
            id={`status-${user.id}`}
            data-tooltip-content="Inativo"
          >
            <Icon
              alt="userFalse"
              name="userFalse"
              fill
              color="black"
              w={30}
              h={30}
            />
            <ReactTooltip anchorId={`status-${user.id}`} />
          </div>
        );
      case 'blocked':
        return (
          <div
            className="w-fit"
            id={`status-${user.id}`}
            data-tooltip-content="Bloqueado"
          >
            <Icon
              alt="userFalse"
              name="userFalse"
              fill
              color="black"
              w={30}
              h={30}
            />
            <ReactTooltip anchorId={`status-${user.id}`} />
          </div>
        );
    }
  };

  return (
    <div className="h-14 items-center justify-center cursor-pointer sm:flex hidden">
      <RenderIcon />
    </div>
  );
};

export default StatusCell;
