import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { StatusCellProps } from './types';

const DirectoryStatusCell = ({ directory }: StatusCellProps) => {
  return (
    <div className="hidden sm:flex items-center justify-center w-[120px] mx-auto">
      {directory.shared ? (
        <div
          data-testid="icon"
          id={`shared${directory.id}`}
          data-tooltip-content="Compartilhado"
          className="hidden sm:flex items-center justify-center w-4/12"
        >
          <Icon alt="shared" name="shared" fill />
          <ReactTooltip anchorId={`shared${directory.id}`} />
        </div>
      ) : null}
    </div>
  );
};

export default DirectoryStatusCell;
