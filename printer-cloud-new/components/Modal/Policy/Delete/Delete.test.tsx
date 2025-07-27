import * as React from 'react';
import { render } from '@testing-library/react';

import Delete from './Delete';

describe('Delete', () => {
  it('renders modal content', () => {
    const deletePolicyModal = render(
      <Delete policy_id={1} policy_name="Policy" />
    );

    const { getByText } = deletePolicyModal;

    expect(getByText('Você tem certeza da sua ação?')).toBeInTheDocument();
  });

  it('renders corporate name', () => {
    const deletePolicyModal = render(
      <Delete policy_id={1} policy_name="Policy" />
    );

    const { getByText } = deletePolicyModal;

    expect(getByText('Policy')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    const deletePolicyModal = render(
      <Delete policy_id={1} policy_name="Policy" />
    );

    const { getByText } = deletePolicyModal;

    expect(getByText('Cancelar')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const deletePolicyModal = render(
      <Delete policy_id={1} policy_name="Policy" />
    );

    const { getByRole } = deletePolicyModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
