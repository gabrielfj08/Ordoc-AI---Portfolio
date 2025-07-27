import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import DeactivateGroupModal from './Deactivate';

describe('DeactivateGroupModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(<DeactivateGroupModal onSubmit={handleSubmit} groupName="Recursos Humanos" />);
    });

    expect(
      screen.getAllByText('Desativar grupo solicitante')[0]
    ).toBeInTheDocument();
  });
});
