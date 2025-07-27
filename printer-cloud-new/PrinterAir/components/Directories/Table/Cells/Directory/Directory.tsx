import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, Typography } from 'printer-ui';
import { DirectoryCellProps } from './types';

const DirectoryCell = ({ directory }: DirectoryCellProps) => {
  return (
    <div
      id={`directoryName${directory.id}`}
      data-tooltip-content={directory.name}
      className="flex items-center space-x-4 max-w-[180px] xl:w-max-[700px] lg:max-w-[500px] md:max-w-[280px] sm:max-w-[150px] truncate"
    >
      <Icon
        name="folderOutlined"
        alt="folder"
        stroke
        w={30}
        h={30}
        color="darkGray"
      />
      <Typography variant="footnote1" className="truncate">
        {directory.name}
      </Typography>
      <ReactTooltip anchorId={`directoryName${directory.id}`} />
    </div>
  );
};

export default DirectoryCell;
