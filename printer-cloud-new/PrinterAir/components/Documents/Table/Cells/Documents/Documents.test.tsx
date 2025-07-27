import * as React from 'react';
import { render } from '@testing-library/react';

import DocumentCell from './Documents';
import { IndexDocument } from '../../../../../../services/printer-air/types';

describe('Documents table cell', () => {
  it('renders the documents name', () => {
    const testDocument: IndexDocument = {
      id: 1,
      originalFilename: 'test document',
      status: 'enqueued',
      description: 'test description',
      location: 'Directory/Documents/Imagem-Printer-Cloud',
      directoryId: 15,
      path: 'text/prn/1',
      prn: 'test/prn/1',
      createdAt: '2022-11-24T16:15:05.486Z',
      updatedAt: '2022-11-24T16:15:05.486Z',
      url: '/rails/active_storage/blobs/redirect/eyJfc59e32ff97/image.pdf',
      previousParentPrn:
        'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
      shared: true,
      shareableLink: true,
      updatedBy: null,
    };

    const documentsCell = render(<DocumentCell document={testDocument} />);

    const { getAllByText } = documentsCell;

    expect(getAllByText('test document')[0]).toBeInTheDocument();
  });
});
