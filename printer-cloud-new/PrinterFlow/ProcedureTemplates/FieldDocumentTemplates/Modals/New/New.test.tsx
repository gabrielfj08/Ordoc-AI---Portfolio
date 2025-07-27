import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import NewFieldDocumentTemplateModal from './New';

describe('NewFieldDocumentTemplateModal', () => {
  it('renders modal title', async () => {
    const handleSubmit = jest.fn();

    act(() => {
      render(<NewFieldDocumentTemplateModal onSubmit={handleSubmit} />);
    });

    expect(screen.getByText('Novo modelo de anexo')).toBeInTheDocument();
  });
});
