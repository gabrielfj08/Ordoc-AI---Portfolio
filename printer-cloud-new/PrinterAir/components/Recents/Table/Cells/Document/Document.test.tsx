import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexRecentDocument } from '../../../../../../services/printer-air/types';
import DocumentCell from './Document';

describe('Documents recents table cell', () => {
  it('renders the documents name', () => {
    const testRecentDocument: IndexRecentDocument = {
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
        path: 'text/prn/1',
        prn: 'test/prn/1',
        createdAt: '2022-11-26T16:15:05.486Z',
        updatedAt: '2022-11-28T16:25:05.486Z',
        url: '/rails/active_storage/blobs/redirect/eyJfc59e32ff97/image.pdf',
        previousParentPrn:
          'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
        shared: true,
        shareableLink: true,
        updatedBy: null,
      },
    };

    const documentsCell = render(
      <DocumentCell recentDocument={testRecentDocument} />
    );

    const { getAllByText } = documentsCell;

    expect(getAllByText('test document')[0]).toBeInTheDocument();
  });
});
