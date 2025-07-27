import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Field } from 'formik';
import { useAuth } from '../../../../hooks';
import { DirectoryService } from '../../../../services/printer-air';
import { SelectDirectoryContainerProps } from './types';
import SelectDirectorySkeleton from './Skeleton';
import SelectDirectoryError from './Error';

const SelectDirectoryContainer = ({
  name,
  parentDirectoryId,
}: SelectDirectoryContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['directories', { token }],
    queryFn: () =>
      DirectoryService.index(token, subdomain, 0, {
        directoryId: parentDirectoryId,
        perPage: 1000,
      }), // TODO: REFACTOR TO REMOVE ORGANIZATION ID
  });

  if (isLoading) return <SelectDirectorySkeleton />;

  if (isError) return <SelectDirectoryError />;

  return (
    <Field
      component="select"
      name={name}
      className="block appearance-none w-full h-9 border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
      options={[{ name: 'Todas as pastas', value: '/Meu Air' }].concat(
        data.directories.map((directory) => ({
          name: directory.path,
          value: String(directory.path),
        }))
      )}
    >
      <option value="/Meu Air">Todas</option>
      {data.directories.map((directory) => (
        <option value={`${directory.path}`} key={directory.id}>
          {directory.path}
        </option>
      ))}
    </Field>
  );
};

export default SelectDirectoryContainer;
