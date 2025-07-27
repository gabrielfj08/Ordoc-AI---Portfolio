import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import DeactivateRequesterModal from './Deactivate';

describe('DeactivateRequesterModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <DeactivateRequesterModal
          onSubmit={handleSubmit}
          requesterName="Solicitante"
        />
      );
    });

    expect(screen.getAllByText('Desativar solicitante')[0]).toBeInTheDocument();
  });
});
