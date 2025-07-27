import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoriesList from './DirectoriesList';

const testDirectoryData = {
  id: 6,
  name: 'test folder',
  description: 'lorem ipsum',
  organizationId: 1,
  prn: '000000000/prn/test',
  parentDirectory: {
    id: 4,
    name: 'parent directory test',
  },
  createdAt: '00/00/0000',
  updatedAt: '00/00/0000',
  createdById: 1,
  path: '/root/parent directory test/test folder',
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air/test folder',
  shared: false,
  updatedBy: {
    id: 1,
    name: 'Jane Doe',
  },
};

describe('DirectoriesList', () => {
  it('renders the directories', () => {
    const directoriesList = render(
      <DirectoriesList
        directories={[testDirectoryData]}
        indexDirectoriesParams={{ directoryId: 4, perPage: 100 }}
        setIndexDirectoriesParams={() => jest.fn()}
        onChange={() => {}}
        selectedDirectory={0}
      />
    );

    const { getByText } = directoriesList;

    expect(getByText('test folder')).toBeInTheDocument();
  });

  it('renders the radio inputs', () => {
    const directoriesList = render(
      <DirectoriesList
        directories={[testDirectoryData]}
        indexDirectoriesParams={{ directoryId: 4, perPage: 100 }}
        setIndexDirectoriesParams={() => jest.fn()}
        onChange={() => {}}
        selectedDirectory={0}
      />
    );

    const { getByRole } = directoriesList;

    expect(getByRole('radio')).toBeInTheDocument();
  });
});
