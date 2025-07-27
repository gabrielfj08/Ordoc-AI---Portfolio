import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexSharedDirectory } from '../../../../../../../services/printer-air/types';
import DirectoryCell from './Directory';

describe('DirectoryCell from shared table', () => {
  it('renders the directory name', () => {
    const sharedDirectory: IndexSharedDirectory = {
      id: 1,
      parentSharedId: 1,
      objectPrn: 'test/prn/1',
      organizationId: 1,
      prn: 'test/prn/shared/1',
      userId: 1,
      createdAt: '2022-11-26T16:15:05.486Z',
      updatedAt: '2022-11-28T16:25:05.486Z',
      directory: {
        id: 1,
        name: 'directory',
        description: 'description',
      },
      createdBy: {
        id: 2,
        name: 'User',
      },
    };

    const directoryCell = render(
      <DirectoryCell sharedDirectory={sharedDirectory} />
    );

    const { getAllByText } = directoryCell;

    expect(getAllByText('directory')[0]).toBeInTheDocument();
  });
});
