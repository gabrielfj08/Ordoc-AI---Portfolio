import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import FinishProcedureModal from './Finish';

describe('FinishProcedureModal', () => {
  it('renders process number', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <FinishProcedureModal onSubmit={handleSubmit} processNumber="01/2023" />
      );
    });

    expect(screen.getByText('01/2023')).toBeInTheDocument();
  });
});
