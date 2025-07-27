import * as React from 'react';
import { render } from '@testing-library/react';
import DocumentStatusCell from './Status';
import { IndexDocument } from '../../../../../../services/printer-air/types';

const document: IndexDocument = {
  id: 1,
  originalFilename: 'image.pdf',
  status: 'processed',
  description: 'Descrição',
  location: 'Localização',
  directoryId: 1,
  path: 'Meu Air/Cadastro/image.pdf',
  prn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
  shared: true,
  shareableLink: true,
  createdAt: '2022-12-19T16:35:00.000Z',
  updatedAt: '2022-12-19T16:35:00.000Z',
  url: '/rails/active_storage/blobs/redirect/eyJfc59e32ff97/image.pdf',
  updatedBy: {
    id: 1,
    name: 'Jane Doe',
  },
};

describe('Status table cell', () => {
  it('renders the directory status', () => {
    render(<DocumentStatusCell document={document} />);
  });
});
