import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  DocumentStatus,
  CreatedByStatus,
} from '../../../../services/printer-air/types';
import DocumentProperties from './Properties';

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

const showDocument = {
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
  downloadUrl: 'https://eyJfcmFpbHMiOnsibWVzc2Fn/documento%20base.pdf',
  content: 'null',
  path: 'ROOT/ROOT',
  size: '850 KB',
  byteSize: 850000,
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
  updatedBy: {
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
};

describe('DocumentProperties', () => {
  it('renders the document filename', () => {
    act(() => {
      render(<DocumentProperties document={showDocument} />);
    });

    expect(screen.getByText('documento base.pdf')).toBeInTheDocument();
  });

  it('renders the created by name', () => {
    act(() => {
      render(<DocumentProperties document={showDocument} />);
    });

    expect(screen.getByText('Usuario')).toBeInTheDocument();
  });

  it('renders the storage', () => {
    act(() => {
      render(<DocumentProperties document={showDocument} />);
    });

    expect(screen.getByText('850 KB')).toBeInTheDocument();
  });
});
