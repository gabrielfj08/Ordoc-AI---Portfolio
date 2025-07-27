import * as React from 'react';
import { render } from '@testing-library/react';
import DocumentStatusCell from './Status';
import { SearchDocument } from '../../../../../../services/printer-air/types';

const document: SearchDocument = {
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
  deletedAt: '2022-12-19T16:39:00.000Z',
  byteSize: 120458,
  versionId: 1,
  previewContent: '',
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
