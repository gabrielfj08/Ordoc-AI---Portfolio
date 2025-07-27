import * as React from 'react';
import { render } from '@testing-library/react';

import Create from './Create';

describe('Create', () => {
  const handleSubmit = jest.fn();

  it('renders modal title', () => {
    const createGroupModal = render(<Create onSubmit={handleSubmit} />);

    const { getByText } = createGroupModal;

    expect(getByText('Adicionar novo grupo')).toBeInTheDocument();
  });

  it('renders add button', () => {
    const createGroupModal = render(<Create onSubmit={handleSubmit} />);

    const { getByText } = createGroupModal;

    expect(getByText('Adicionar grupo')).toBeInTheDocument();
  });
});
