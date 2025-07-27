import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { SharedDirectoriesModalProps } from './types';

const SharedDirectoriesModal = ({ directory }: SharedDirectoriesModalProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <Icon
        name="folderOutlined"
        alt="folder"
        stroke
        w={30}
        h={30}
        color="darkGray"
        className="flex-none"
      />
      <Typography
        variant="footnote1"
        family="roboto"
        className="truncate flex-grow"
      >
        {directory.name}
      </Typography>
    </div>
  );
};

export default SharedDirectoriesModal;
