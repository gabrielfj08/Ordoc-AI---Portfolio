import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoriesTable from './Table';

const testData = [
  {
    id: 1,
    name: 'Documents',
    description: 'documents description',
    createdById: 2,
    organizationId: 15,
    path: 'Meu Air/Documents',
    prn: 'test/prn/1',
    parentDirectory: { id: 2, name: 'parent directory' },
    createdAt: '2022-11-24T16:15:05.486Z',
    updatedAt: '2022-11-24T16:15:05.486Z',
    previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
    shared: true,
    shareableLink: true,
    updatedBy: null,
  },
  {
    id: 2,
    name: 'Images',
    description: 'images description',
    createdById: 2,
    organizationId: 15,
    path: 'Meu Air/Images',
    prn: 'test/prn/1',
    parentDirectory: { id: 2, name: 'parent directory' },
    createdAt: '2022-11-24T16:15:05.486Z',
    updatedAt: '2022-11-24T16:15:05.486Z',
    previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
    shared: true,
    shareableLink: true,
    updatedBy: null,
  },
  {
    id: 3,
    name: 'Downloads',
    description: 'downloads description',
    createdById: 2,
    organizationId: 15,
    path: 'Meu Air/Downloads',
    prn: 'test/prn/1',
    parentDirectory: { id: 2, name: 'parent directory' },
    createdAt: '2022-11-24T16:15:05.486Z',
    updatedAt: '2022-11-24T16:15:05.486Z',
    previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
    shared: true,
    shareableLink: true,
    updatedBy: null,
  },
];
describe('DirectoriesTable', () => {
  const setSelectedDirectoryIds = jest.fn();
  it('renders all columns', () => {
    const directoriesTable = render(
      <DirectoriesTable
        data={testData}
        setSelectedDirectoryIds={setSelectedDirectoryIds}
      />
    );

    const { getByText } = directoriesTable;

    expect(getByText('Pasta')).toBeInTheDocument();
    expect(getByText('Criado')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
  });

  it('renders all rows', () => {
    const setSelectedDirectoryIds = jest.fn();
    const directoriesTable = render(
      <DirectoriesTable
        data={testData}
        setSelectedDirectoryIds={setSelectedDirectoryIds}
      />
    );

    const { getAllByText } = directoriesTable;

    expect(getAllByText('Documents')[0]).toBeInTheDocument();
    expect(getAllByText('Images')[0]).toBeInTheDocument();
    expect(getAllByText('Downloads')[0]).toBeInTheDocument();
  });
});
