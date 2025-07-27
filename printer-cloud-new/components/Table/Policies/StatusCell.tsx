import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { PolicyCellProps } from './types';

const StatusCell = ({ policy }: PolicyCellProps) => {
  const RenderIcon = () => {
    if (policy.source == 'printer_cloud_managed')
      return (
        <div
          className="w-fit"
          id={`status-${policy.id}`}
          data-tooltip-content="Criado por Printer Cloud"
        >
          <Icon alt="cloud" name="cloud" stroke color="blue" w={35} h={35} />
          <ReactTooltip anchorId={`status-${policy.id}`} />
        </div>
      );
    return (
      <div
        className="w-fit"
        id={`status-${policy.id}`}
        data-tooltip-content="Criado por usuário"
      >
        <Icon alt="manager" name="manager" stroke color="gray" w={35} h={35} />
        <ReactTooltip anchorId={`status-${policy.id}`} />
      </div>
    );
  };

  return (
    <div className="h-14 items-center justify-center cursor-pointer sm:flex hidden">
      <RenderIcon />
    </div>
  );
};

export default StatusCell;
