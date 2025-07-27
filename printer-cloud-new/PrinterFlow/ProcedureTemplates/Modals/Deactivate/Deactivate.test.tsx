import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import DeactivateProcedureTemplateModal from './Deactivate';

describe('DeactivateProcedureTemplateModal', () => {
  it('renders procedure template name', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(
        <DeactivateProcedureTemplateModal
          onSubmit={handleSubmit}
          procedureTemplateName="Oficio"
          parentProcedureTemplateId={1}
        />
      );
    });

    expect(screen.getByText('Oficio')).toBeInTheDocument();
  });
});
