import * as React from 'react';
import { render } from '@testing-library/react';

import SharedDirectoriesTable from './Directories';

const testData = [
  {
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
      name: 'Documents',
      description: 'documents description',
    },
    createdBy: {
      id: 2,
      name: 'User',
    },
  },
  {
    id: 2,
    parentSharedId: 1,
    objectPrn: 'test/prn/1',
    organizationId: 1,
    prn: 'test/prn/shared/1',
    userId: 1,
    createdAt: '2022-11-26T16:15:05.486Z',
    updatedAt: '2022-11-28T16:25:05.486Z',
    directory: {
      id: 2,
      name: 'Images',
      description: 'images description',
    },
    createdBy: {
      id: 2,
      name: 'User',
    },
  },
  {
    id: 3,
    parentSharedId: 1,
    objectPrn: 'test/prn/1',
    organizationId: 1,
    prn: 'test/prn/shared/1',
    userId: 1,
    createdAt: '2022-11-26T16:15:05.486Z',
    updatedAt: '2022-11-28T16:25:05.486Z',
    directory: {
      id: 3,
      name: 'Downloads',
      description: 'downloads description',
    },
    createdBy: {
      id: 2,
      name: 'User',
    },
  },
];

describe('SharedDirectoriesTable', () => {
  it('renders all columns', () => {
    const sharedDirectoriesTable = render(
      <SharedDirectoriesTable data={testData} />
    );

    const { getByText } = sharedDirectoriesTable;

    expect(getByText('Pasta')).toBeInTheDocument();
    expect(getByText('Compartilhado por')).toBeInTheDocument();
    expect(getByText('Data de compartilhamento')).toBeInTheDocument();
  });

  it('renders all rows', () => {
    const sharedDirectoriesTable = render(
      <SharedDirectoriesTable data={testData} />
    );

    const { getAllByText } = sharedDirectoriesTable;

    expect(getAllByText('Documents')[0]).toBeInTheDocument();
    expect(getAllByText('Images')[0]).toBeInTheDocument();
    expect(getAllByText('Downloads')[0]).toBeInTheDocument();
  });
});
