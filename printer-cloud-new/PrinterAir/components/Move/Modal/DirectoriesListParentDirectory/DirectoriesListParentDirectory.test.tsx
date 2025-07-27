import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoriesListParentDirectory from './DirectoriesListParentDirectory';

const testDirectoryData = {
  id: 6,
  name: 'test folder name',
  description: 'lorem ipsum',
  organizationId: 1,
  prn: '000000000/prn/test',
  parentDirectory: {
    id: 4,
    name: 'parent directory test',
  },
  createdAt: '00/00/0000',
  updatedAt: '00/00/0000',
  createdBy: { id: 1, name: 'Jane Doe' },
  updatedBy: { id: 1, name: 'Jane Doe' },
  path: '/root/parent directory test/test folder',
};

describe('Directories List parent directory', () => {
  it('renders the parent directory name', () => {
    const directoriesListParentDirectory = render(
      <DirectoriesListParentDirectory
        directory={testDirectoryData}
        indexDirectoriesParams={{ directoryId: 6, perPage: 100 }}
        setIndexDirectoriesParams={() => jest.fn()}
      />
    );

    const { getByText } = directoriesListParentDirectory;

    expect(getByText('test folder name')).toBeInTheDocument();
  });

  it('renders the return button', () => {
    const directoriesListParentDirectory = render(
      <DirectoriesListParentDirectory
        directory={testDirectoryData}
        indexDirectoriesParams={{ directoryId: 6, perPage: 100 }}
        setIndexDirectoriesParams={() => jest.fn()}
      />
    );

    const { getByRole } = directoriesListParentDirectory;

    expect(getByRole('button')).toBeInTheDocument();
  });
});
