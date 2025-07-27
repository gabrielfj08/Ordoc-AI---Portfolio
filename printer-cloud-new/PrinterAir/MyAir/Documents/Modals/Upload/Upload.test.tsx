import * as React from 'react';
import { render } from '@testing-library/react';
import UploadDocumentsModal from './Upload';

describe('UploadDocumentsModal', () => {
  it('renders the modal title', () => {
    const handleSubmit = jest.fn();

    const { getByRole } = render(<UploadDocumentsModal onSubmit={handleSubmit} />);

    expect(getByRole('button', { name: /Enviar arquivos/i })).toBeInTheDocument();
  });
});
