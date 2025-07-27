import * as React from 'react';
import { render } from '@testing-library/react';

import UploadDirectoriesModal from './Upload';

describe('UploadDirectoriessModal', () => {
  it('renders the modal text', () => {
    const handleSubmit = jest.fn();
    const { getByText } = render(
      <UploadDirectoriesModal onSubmit={handleSubmit} />
    );

    expect(getByText('Descrição:')).toBeInTheDocument();
  });

  it('renders the modal inputs', () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText } = render(
      <UploadDirectoriesModal onSubmit={handleSubmit} />
    );

    expect(getByPlaceholderText('Localização')).toBeInTheDocument();
  });

  it('renders the modal buttons', () => {
    const handleSubmit = jest.fn();
    const { getByRole } = render(
      <UploadDirectoriesModal onSubmit={handleSubmit} />
    );

    expect(getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });
});
