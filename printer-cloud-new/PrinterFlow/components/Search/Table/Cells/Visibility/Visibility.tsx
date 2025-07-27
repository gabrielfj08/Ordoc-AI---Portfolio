import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { VisibilityCellProps } from './types';

const VisibilityCell = ({ procedure }: VisibilityCellProps) => {
  return (
    <div className="hidden sm:flex items-center justify-center">
      <div
        id={`visibility${procedure.id}`}
        data-tooltip-content={
          procedure.private === true ? 'Privado' : 'Público'
        }
        className="hidden xl:flex items-center justify-center w-4/12"
      >
        <>
          <Icon
            alt="Visibility"
            name={procedure.private === true ? 'locked' : 'unlocked'}
            color={procedure.private === true ? 'error' : 'success'}
            w={25}
            h={25}
            stroke
          />
          <ReactTooltip anchorId={`visibility${procedure.id}`} />
        </>
      </div>
    </div>
  );
};
export default VisibilityCell;
