import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import ArchiveProcedureModal from './Archive';

describe('ArchiveProcedureModal', () => {
  it('renders process number', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <ArchiveProcedureModal
          onSubmit={handleSubmit}
          processNumber="01/2023"
        />
      );
    });

    expect(screen.getByText('01/2023')).toBeInTheDocument();
  });
});
