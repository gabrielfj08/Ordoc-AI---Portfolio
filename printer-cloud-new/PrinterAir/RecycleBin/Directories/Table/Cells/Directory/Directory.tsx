import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, Typography } from 'printer-ui';
import { DirectoryCellProps } from './types';

const DirectoryCell = ({ directory, directoryName }: DirectoryCellProps) => {
  return (
    <div
      id={`directoryName${directory.id}`}
      data-tooltip-content={directoryName}
      className="flex items-center space-x-4 max-w-[180px] min-w-full xl:w-max-[500px] lg:max-w-[400px] md:max-w-[200px] sm:max-w-[150px] truncate"
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
        {directoryName}
      </Typography>
      <ReactTooltip anchorId={`directoryName${directory.id}`} />
    </div>
  );
};

export default DirectoryCell;
