import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexRecentDocument } from '../../../../../../services/printer-air/types';
import Breadcrumb from './Breadcrumb';

const testRecentDocumentPath: IndexRecentDocument = {
  documentId: 1,
  lastAccessedAt: '2022-11-24T16:15:05.486Z',
  userId: 1,
  document: {
    id: 4,
    originalFilename: 'test document',
    status: 'enqueued',
    description: 'documento-2023',
    location: 'documento na prefeitura',
    directoryId: 1,
    path: '/Meu Air/Pasta de fotos/Teste',
    prn: 'test/prn/1',
    createdAt: '2022-11-24T16:15:05.486Z',
    updatedAt: '2022-11-24T16:15:05.486Z',
    url: '/rails/active_storage/blobs/redirect/eyJfc59e32ff97/image.pdf',
    previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
    shared: true,
    shareableLink: true,
    updatedBy: null,
  },
};

describe('Documents recents table cell', () => {
  it('renders the path name', () => {
    const breadcrumbCell = render(
      <Breadcrumb recentDocument={testRecentDocumentPath} />
    );

    const { getAllByText } = breadcrumbCell;

    expect(getAllByText('/Meu Air/Pasta de fotos')[0]).toBeInTheDocument();
  });
});
