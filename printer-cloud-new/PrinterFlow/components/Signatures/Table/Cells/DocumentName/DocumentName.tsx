import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../../utils';
import { DocumentNameCellProps } from '../../types';

const DocumentNameCell = ({ signature }: DocumentNameCellProps) => {
  return (
    <div
      id={`documentName${signature.id}`}
      data-tooltip-content={removeFileExtension(signature.signable.name)}
      className="max-w-[120px] sm:max-w-[260px] 2xl:max-w-[400px] truncate px-2"
    >
      <Typography variant="footnote1" className="truncate">
        {removeFileExtension(signature.signable.name)}
      </Typography>
      <ReactTooltip anchorId={`documentName${signature.id}`} />
    </div>
  );
};

export default DocumentNameCell;
