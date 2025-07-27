import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { useDrawer } from '../../../../hooks';
import ShowDirectory from './Show';
import { DirectoryPropertiesProps } from './types';
import DirectoryInfo from './DirectoryInfoJob';

const DirectoryProperties = ({
  directoryId,
  organizationId,
}: DirectoryPropertiesProps) => {
  const { closeDrawer } = useDrawer();

  return (
    <main className="h-full max-w-full p-4 sm:p-8 space-y-3 overflow-y-auto">
      <div className="flex items-end justify-end px-6">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <header className="flex justify-center items-center pb-2">
        <Icon name="info" alt="info" stroke w={26} h={26} />
        <Typography variant="headline" family="robotoMedium" className="pl-2">
          Propriedades da pasta
        </Typography>
      </header>
      <div>
        <ShowDirectory
          directoryId={directoryId}
          organizationId={organizationId}
        />
        <DirectoryInfo directoryId={directoryId} />
      </div>
    </main>
  );
};

export default DirectoryProperties;
