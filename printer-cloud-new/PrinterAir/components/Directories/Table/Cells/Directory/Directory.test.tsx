import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoryCell from './Directory';

describe('Directory table cell', () => {
  it('renders the directory name', () => {
    const testDirectory = {
      id: 1,
      name: 'test directory',
      description: 'test description',
      createdById: 2,
      organizationId: 15,
      prn: 'test/prn/1',
      parentDirectoryId: 2,
      createdAt: '2022-11-24T16:15:05.486Z',
      updatedAt: '2022-11-24T16:15:05.486Z',
    };
    const directoryCell = render(<DirectoryCell directory={testDirectory} />);

    const { getAllByText } = directoryCell;

    expect(getAllByText('test directory')[0]).toBeInTheDocument();
  });
});
