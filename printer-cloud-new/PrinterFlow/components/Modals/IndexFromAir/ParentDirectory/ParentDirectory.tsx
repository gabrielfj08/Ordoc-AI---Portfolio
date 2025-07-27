import * as React from 'react';
import { ParentDirectoryProps } from './types';
import { Icon, Typography } from 'printer-ui';

const DirectoriesListParentDirectory = ({
  directory,
  setDirectoryId,
}: ParentDirectoryProps) => {
  return (
    <div className="pb-3 border-b border-lightGray flex items-center h-12">
      <div
        className={`mr-3.5 ${directory.name === 'Meu Air' ? 'hidden' : 'flex'}`}
      >
        <button
          className="w-8 h-8 shadow-default rounded-full flex items-center justify-center"
          onClick={() => {
            if (directory.parentDirectory) {
              setDirectoryId(directory.parentDirectory.id);
            }
          }}
          type="button"
        >
          <Icon alt="return" name="return" stroke color="gray" w={24} h={24} />
        </button>
      </div>
      <Typography
        family="robotoMedium"
        color="darkGray"
        className="truncate"
        variant="body"
      >
        {directory.name}
      </Typography>
    </div>
  );
};

export default DirectoriesListParentDirectory;
