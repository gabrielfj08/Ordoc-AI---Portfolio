import * as React from 'react';
import { render } from '@testing-library/react';

import RemovePolicy from './RemovePolicy';

describe('RemovePolicy', () => {
  it('renders modal title', () => {
    const removePolicyModal = render(
      <RemovePolicy policy_id={1} policy_name="policy" user_id={1} />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('Remover permissão do usuário')).toBeInTheDocument();
  });

  it('renders policy name', () => {
    const removePolicyModal = render(
      <RemovePolicy policy_id={1} policy_name="policy" user_id={1} />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('policy')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const removePolicyModal = render(
      <RemovePolicy policy_id={1} policy_name="policy" user_id={1} />
    );

    const { getByRole } = removePolicyModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    const removePolicyModal = render(
      <RemovePolicy policy_id={1} policy_name="policy" user_id={1} />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('Remover permissão')).toBeInTheDocument();
  });
});
