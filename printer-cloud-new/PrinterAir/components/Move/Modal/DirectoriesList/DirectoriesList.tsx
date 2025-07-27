import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { DirectoriesListProps } from './types';

const DirectoriesList = ({
  directories,
  indexDirectoriesParams,
  onChange,
  selectedDirectory,
  setIndexDirectoriesParams,
}: DirectoriesListProps) => {
  return (
    <div>
      <div className="h-72 overflow-x-auto space-y-4 min-w-[310px]">
        {directories.map((directory) => (
          <div
            key={directory.id}
            className={`flex items-center h-10 rounded hover:bg-lighterGray
            ${selectedDirectory == directory.id ? 'bg-blue/10' : 'bg-white'}`}
          >
            <label htmlFor={directory.name} className="px-3">
              <input
                id={directory.name}
                name="payload.directoryId"
                type="radio"
                value={directory.id}
                onChange={onChange}
              />
            </label>
            <div
              className="truncate flex items-center w-full justify-between cursor-pointer"
              onClick={() => {
                setIndexDirectoriesParams({
                  ...indexDirectoriesParams,
                  directoryId: directory.id,
                });
              }}
            >
              <span className="flex items-center truncate">
                <Icon
                  alt="folder"
                  name="folderOutlined"
                  stroke
                  color="darkGray"
                />
                <Typography variant="footnote1" className="truncate px-3">
                  {directory.name}
                </Typography>
              </span>
              <Icon
                name="up"
                alt="chevron"
                stroke
                h={25}
                w={25}
                className="rotate-90"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoriesList;
