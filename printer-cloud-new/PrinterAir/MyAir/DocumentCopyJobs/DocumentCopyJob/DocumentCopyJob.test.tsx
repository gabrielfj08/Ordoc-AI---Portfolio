import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  DocumentStatus,
  CreatedByStatus,
  documentCopyStatus,
} from '../../../../services/printer-air/types';

import DocumentCopyJob from './DocumentCopyJob';

const documentStatus: Record<string, DocumentStatus> = {
  failed: 'failed',
  created: 'created',
  enqueued: 'enqueued',
  processed: 'processed',
};

const createdByStatus: Record<string, CreatedByStatus> = {
  active: 'active',
  inactive: 'inactive',
};

const documentCopyStatus: Record<string, documentCopyStatus> = {
  created: 'created',
  running: 'running',
  finished: 'finished',
  failed: 'failed',
};

const document = {
  id: 1,
  originalFilename: 'documento base.pdf',
  status: documentStatus.enqueued,
  description: 'descrição do documento',
  location: 'Meu Air',
  directoryId: 1,
  prn: 'prn:printer_air:012345:ROOT/documento base.pdf',
  createdAt: '2023-01-10T18:07:05.865Z',
  updatedAt: '2023-01-10T18:10:08.371Z',
  deletedAt: 'null',
  url: 'https://eyJfcmFpbHMiOnsibWVzc2Fn/documento%20base.pdf',
  content: 'null',
  path: 'ROOT/ROOT',
  size: '850 KB',
  createdBy: {
    id: 1,
    email: 'usuario@email.com.br',
    name: 'Usuario',
    createdAt: '2023-01-06T12:35:27.013Z',
    updatedAt: '2023-01-11T18:45:49.850Z',
    phone: '41999999999',
    cpf: '85987203058',
    deletedAt: 'null',
    dateOfBirth: '2001-02-23',
    unlockTokenSentAt: 'null',
    status: createdByStatus.active,
    prn: 'prn:printer_cloud::user/85987203058',
  },
  directory: {
    name: 'ROOT',
  },
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air/Cadastro/image.pdf',
  shared: true,
  shareableLink: true,
  updatedBy: null,
};

const documentCopy = {
  id: 1,
  status: documentCopyStatus.finished,
  documentId: 1,
  createdById: 1,
  createdAt: '2023-01-06T12:35:27.013Z',
  updatedAt: '2023-01-11T18:45:49.850Z',
};

describe('DirectoryUploadJob', () => {
  it('renders the document name', () => {
    act(() => {
      render(
        <DocumentCopyJob document={document} documentCopy={documentCopy} />
      );
    });

    expect(screen.getByText('documento base.pdf')).toBeInTheDocument();
  });
});
