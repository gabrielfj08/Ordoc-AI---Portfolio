import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import NewDirectoryModal from './New';

describe('NewDirectoryModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(<NewDirectoryModal onSubmit={handleSubmit} />);
    });

    expect(screen.getByText('Criar nova pasta')).toBeInTheDocument();
  });

  it('renders button create', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(<NewDirectoryModal onSubmit={handleSubmit} />);
    });

    expect(screen.getByText('Criar pasta')).toBeInTheDocument();
  });
});
