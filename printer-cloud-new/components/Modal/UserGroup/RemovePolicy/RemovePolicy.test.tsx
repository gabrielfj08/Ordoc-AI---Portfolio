import * as React from 'react';
import { render } from '@testing-library/react';

import RemovePolicy from './RemovePolicy';

describe('RemovePolicy', () => {
  it('renders modal title', () => {
    const removePolicyModal = render(
      <RemovePolicy
        group_id={1}
        group_name="Grupo"
        policy_id={1}
        policy_name="policy"
      />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('Remover permissão do grupo')).toBeInTheDocument();
  });

  it('renders group name', () => {
    const removePolicyModal = render(
      <RemovePolicy
        group_id={1}
        group_name="Grupo"
        policy_id={1}
        policy_name="policy"
      />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('Grupo')).toBeInTheDocument();
  });

  it('renders policy name', () => {
    const removePolicyModal = render(
      <RemovePolicy
        group_id={1}
        group_name="Grupo"
        policy_id={1}
        policy_name="policy"
      />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('policy')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const removePolicyModal = render(
      <RemovePolicy
        group_id={1}
        group_name="Grupo"
        policy_id={1}
        policy_name="policy"
      />
    );

    const { getByRole } = removePolicyModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    const removePolicyModal = render(
      <RemovePolicy
        group_id={1}
        group_name="Grupo"
        policy_id={1}
        policy_name="policy"
      />
    );

    const { getByText } = removePolicyModal;

    expect(getByText('Remover permissão')).toBeInTheDocument();
  });
});
