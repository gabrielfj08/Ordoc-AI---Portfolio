import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import RemoveRequesterModal from './RemoveRequester';

describe('RemoveRequesterModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <RemoveRequesterModal
          onSubmit={handleSubmit}
          groupName="Administração"
          requesterName="Victor"
        />
      );
    });

    expect(
      screen.getByText('Remover solicitante do grupo')
    ).toBeInTheDocument();
  });

  it('renders group name', async () => {
    act(() => {
      const handleSubmit = jest.fn();

      render(
        <RemoveRequesterModal
          onSubmit={handleSubmit}
          groupName="Administração"
          requesterName="Victor"
        />
      );
    });

    expect(screen.getByText('Administração')).toBeInTheDocument();
  });

  it('renders requester name', async () => {
    act(() => {
      const handleSubmit = jest.fn();

      render(
        <RemoveRequesterModal
          onSubmit={handleSubmit}
          groupName="Administração"
          requesterName="Victor"
        />
      );
    });

    expect(screen.getByText('Victor')).toBeInTheDocument();
  });
});
