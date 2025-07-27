import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import UnarchiveProcedureModal from './Unarchive';

describe('UnarchiveProcedureModal', () => {
  it('renders process number', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <UnarchiveProcedureModal
          onSubmit={handleSubmit}
          processNumber="01/2023"
        />
      );
    });

    expect(screen.getByText('01/2023')).toBeInTheDocument();
  });
});
