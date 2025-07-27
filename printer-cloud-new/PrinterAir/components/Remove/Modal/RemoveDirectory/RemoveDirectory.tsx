import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { RemoveDirectoryProps } from './types';

const RemoveDirectory = ({ directoryName }: RemoveDirectoryProps) => {
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
        variant="headline"
        family="roboto"
        className="truncate flex-grow"
      >
        {directoryName}
      </Typography>
    </div>
  );
};

export default RemoveDirectory;
