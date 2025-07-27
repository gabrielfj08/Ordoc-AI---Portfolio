import * as React from 'react';
import { render } from '@testing-library/react';
import { BaseUser } from '../../../../services/types';
import { AttachPolicyFormValues } from '../types';
import AddPoliciesUser from './AddPolicies';

describe('AddPoliciesUser', () => {
  it('renders modal title', () => {
    const addPoliciesModal = render(
      <AddPoliciesUser
        policies={[]}
        currentPolicies={[]}
        onSubmit={function (values: AttachPolicyFormValues): Promise<BaseUser> {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const { getByText } = addPoliciesModal;

    expect(getByText('Adicionar permissão ao usuário')).toBeInTheDocument();
  });

  it('renders add button', () => {
    const addPoliciesModal = render(
      <AddPoliciesUser
        policies={[]}
        currentPolicies={[]}
        onSubmit={function (values: AttachPolicyFormValues): Promise<BaseUser> {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const { getByText } = addPoliciesModal;

    expect(getByText('Adicionar permissão')).toBeInTheDocument();
  });
});
