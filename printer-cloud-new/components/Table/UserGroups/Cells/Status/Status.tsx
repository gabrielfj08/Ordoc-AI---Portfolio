import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { UserGroupStatusCellProps } from './types';

const UserGroupStatusCell = ({ userGroup }: UserGroupStatusCellProps) => {
  const RenderIcon = () => {
    if (userGroup.status == 'active')
      return (
        <div
          className="w-fit"
          id={`status-${userGroup.id}`}
          data-tooltip-content="Ativo"
        >
          <Icon alt="grupo ativo" name="activeGroup" fill color="black" />
          <ReactTooltip anchorId={`status-${userGroup.id}`} />
        </div>
      );

    if (userGroup.status == 'inactive')
      return (
        <div
          className="w-fit"
          id={`status-${userGroup.id}`}
          data-tooltip-content="Inativo"
        >
          <Icon alt="grupo inativo" name="inactiveGroup" fill color="gray" />
          <ReactTooltip anchorId={`status-${userGroup.id}`} />
        </div>
      );

    return <Icon alt="grupo" name="group" fill color="black" w={30} h={30} />;
  };

  return (
    <div className="hidden sm:block px-4">
      <RenderIcon />
    </div>
  );
};

export default UserGroupStatusCell;
