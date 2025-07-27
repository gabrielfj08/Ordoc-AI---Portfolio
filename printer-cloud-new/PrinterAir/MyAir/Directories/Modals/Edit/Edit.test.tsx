import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import EditDirectoryModal from './Edit';

describe('EditDirectoryModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <EditDirectoryModal
          onSubmit={handleSubmit}
          name="Pasta"
          description="Descrição"
        />
      );
    });

    expect(screen.getByText('Editar pasta')).toBeInTheDocument();
  });

  it('renders button edit', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <EditDirectoryModal
          onSubmit={handleSubmit}
          name="Pasta"
          description="Descrição"
        />
      );
    });

    expect(screen.getByText('Salvar alterações')).toBeInTheDocument();
  });
});
