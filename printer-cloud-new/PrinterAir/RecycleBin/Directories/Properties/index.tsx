import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { useDrawer } from '../../../../hooks';
import { DirectoryPropertiesProps } from './types';
import ShowDirectory from './Show';
import DirectoryInfo from './DirectoryInfoJob';

const DirectoryProperties = ({
  directoryId,
  organizationId,
}: DirectoryPropertiesProps) => {
  const { closeDrawer } = useDrawer();

  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col space-y-4 overflow-auto py-8">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Propriedades da pasta
        </Typography>
      </div>
      <ShowDirectory
        directoryId={directoryId}
        organizationId={organizationId}
      />
      <DirectoryInfo directoryId={directoryId} />
    </div>
  );
};

export default DirectoryProperties;
