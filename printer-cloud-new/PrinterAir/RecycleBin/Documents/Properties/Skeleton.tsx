import * as React from 'react';
import { Icon, Typography, Skeleton } from 'printer-ui';
import { useDrawer } from '../../../../hooks';

const DocumentPropertiesSkeleton = () => {
  const { closeDrawer } = useDrawer();
  return (
    <main className="h-full max-w-full p-4 sm:p-8 space-y-3">
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
          Propriedades do arquivo
        </Typography>
      </header>
      <div className="space-y-4">
        <Skeleton w="full" h={44} rounded="lg" />
        <Skeleton w="full" h={24} rounded="lg" />
        <Skeleton w="full" h={24} rounded="lg" />
        <Skeleton w="full" h={24} rounded="lg" />
      </div>
    </main>
  );
};

export default DocumentPropertiesSkeleton;
