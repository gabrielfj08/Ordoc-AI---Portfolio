import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { SourceCellProps } from './types';

const SourceCell = ({ procedure }: SourceCellProps) => {
  const statusTooltipMapping: Record<string, string> = {
    internal: 'Interno',
    external: 'Externo',
  };

  const statusIconMapping: Record<string, icon> = {
    internal: 'internal',
    external: 'external',
  };

  return (
    <div className="hidden 2xl:flex items-center justify-center">
      <div
        id={`source${procedure.id}`}
        data-tooltip-content={statusTooltipMapping[procedure.source]}
        className="hidden sm:flex items-center justify-center w-4/12"
      >
        <>
          <Icon
            alt="source"
            name={statusIconMapping[procedure.source]}
            color={procedure.source === 'external' ? 'orange' : 'black'}
            fill
            stroke
            w={35}
            h={35}
          />
          <ReactTooltip anchorId={`source${procedure.id}`} />
        </>
      </div>
    </div>
  );
};

export default SourceCell;
