import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { IndexDirectoriesFromAirProps } from './types';

const IndexDirectoriesFromAir = ({
  directories,
  setDirectoryId,
}: IndexDirectoriesFromAirProps) => {
  const { token, subdomain } = useAuth();

  return (
    <div className="space-y-4">
      {directories.map((directory) => (
        <div className="flex justify-between">
          <div
            className="flex space-x-2 items-center cursor-pointer truncate overflow-hidden text-ellipsis"
            onClick={() => {
              setDirectoryId(directory.id),
                queryClient.invalidateQueries([
                  'indexAirDocuments',
                  subdomain,
                  token,
                  directory.id,
                ]);
              queryClient.invalidateQueries([
                'indexAirDirctories',
                subdomain,
                token,
                directory.id,
              ]);
            }}
            key={directory.id}
          >
            <Icon
              alt="directory"
              name="folderOutlined"
              color="gray"
              stroke
              w={24}
              h={24}
            />
            <Typography variant="footnote1" className="truncate">
              {directory.name}
            </Typography>
          </div>
          <Icon alt="chevron" name="chevron" color="gray" fill w={24} h={24} />
        </div>
      ))}
    </div>
  );
};

export default IndexDirectoriesFromAir;
