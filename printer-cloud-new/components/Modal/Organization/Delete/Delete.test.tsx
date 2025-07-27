import * as React from 'react';
import { render } from '@testing-library/react';

import Delete from './Delete';

describe('Delete', () => {
  it('renders modal title', () => {
    const deleteOrganizationModal = render(
      <Delete id={6} name={'Printer do Brasil'} />
    );

    const { getByText } = deleteOrganizationModal;

    expect(
      getByText('Excluir instituição permanentemente')
    ).toBeInTheDocument();
  });

  it('renders corporate name', () => {
    const deleteOrganizationModal = render(
      <Delete id={6} name={'Printer do Brasil'} />
    );

    const { getByText } = deleteOrganizationModal;

    expect(getByText('Printer do Brasil')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    const deleteOrganizationModal = render(
      <Delete id={6} name={'Printer do Brasil'} />
    );

    const { getByText } = deleteOrganizationModal;

    expect(getByText('Excluir instituição')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const deleteOrganizationModal = render(
      <Delete id={6} name={'Printer do Brasil'} />
    );

    const { getByRole } = deleteOrganizationModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
