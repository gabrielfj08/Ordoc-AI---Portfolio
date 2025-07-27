import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import EditDocumentModal from './Edit';

describe('EditDocumentModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <EditDocumentModal
          onSubmit={handleSubmit}
          description="descrição"
          location="localização"
          originalFilename="documento base.pdf"
        />
      );
    });
    expect(screen.getByText('Editar arquivo')).toBeInTheDocument();
  });

  it('renders button edit', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <EditDocumentModal
          onSubmit={handleSubmit}
          description="descrição"
          location="localização"
          originalFilename="documento base.pdf"
        />
      );
    });

    expect(screen.getByText('Salvar alterações')).toBeInTheDocument();
  });
});
