import * as React from 'react';
import { render } from '@testing-library/react';
import { DocumentUploadJobStatus } from '../../../../PrinterAir/constants';
import DocumentUploadJob from './DocumentUploadJob';

const documentUploadJob = {
  id: 1,
  status: DocumentUploadJobStatus.running,
  s3Key: '/test/1234567890/Administração/file.png',
  description: 'Descrição',
  location: 'Localização',
  createdById: 1,
  createdAt: '2022-11-24T16:15:05.486Z',
  updatedAt: '2022-11-24T16:15:05.486Z',
}

describe('DocumentUploadJob', () => {
  it('renders the document filename', () => {
    const { getByText } = render(
      <DocumentUploadJob documentUploadJob={documentUploadJob} />
    );

    expect(getByText(/file.png/i)).toBeInTheDocument();
  });
});
