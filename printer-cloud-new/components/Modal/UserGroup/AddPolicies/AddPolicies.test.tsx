import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexPolicy } from '../../../../services/types';
import AddPolicies from './AddPolicies';

const userGroupPoliciesTest: Array<IndexPolicy> = [
  {
    id: 1,
    name: 'Permissão',
    prn: 'prn:printer_cloud:04916444000122',
    effect: 'allow',
    resource: ['prn:printer_air:04916444000122:'],
    service: 'printer_air',
    organizationId: 1,
    createdAt: '2023-06-22T11:35:24.173Z',
    updatedAt: '2023-06-22T11:35:24.173Z',
    description: 'descrição',
    source: 'customer_managed',
    usersCount: 1,
    userGroupsCount: 1,
  },
];

const currentUserGroupPoliciesTest: Array<IndexPolicy> = [
  {
    id: 1,
    name: 'Permissão',
    prn: 'prn:printer_cloud:04916444000122',
    effect: 'allow',
    resource: ['prn:printer_air:04916444000122:'],
    service: 'printer_air',
    organizationId: 1,
    createdAt: '2023-06-22T11:35:24.173Z',
    updatedAt: '2023-06-22T11:35:24.173Z',
    description: 'descrição',
    source: 'customer_managed',
    usersCount: 1,
    userGroupsCount: 1,
  },
];

describe('AddPolicies modal', () => {
  it('renders modal title', () => {
    const handleSubmit = jest.fn();
    const AddPoliciesModal = render(
      <AddPolicies
        buttonLoading
        onSubmit={handleSubmit}
        userGroupPolicies={userGroupPoliciesTest}
        currentUserGroupPolicies={currentUserGroupPoliciesTest}
      />
    );

    const { getByText } = AddPoliciesModal;

    expect(getByText('Adicionar novas permissões')).toBeInTheDocument();
  });

  it('renders modal content', () => {
    const handleSubmit = jest.fn();
    const AddPoliciesModal = render(
      <AddPolicies
        buttonLoading
        onSubmit={handleSubmit}
        userGroupPolicies={userGroupPoliciesTest}
        currentUserGroupPolicies={currentUserGroupPoliciesTest}
      />
    );

    const { getByText } = AddPoliciesModal;

    expect(getByText('Selecione a permissão desejada:')).toBeInTheDocument();
  });

  it('renders MultipleSelect', () => {
    const handleSubmit = jest.fn();
    const AddPoliciesModal = render(
      <AddPolicies
        buttonLoading
        onSubmit={handleSubmit}
        userGroupPolicies={userGroupPoliciesTest}
        currentUserGroupPolicies={currentUserGroupPoliciesTest}
      />
    );

    const { getByText } = AddPoliciesModal;

    expect(getByText('Selecione a permissão')).toBeInTheDocument();
  });

  it('renders footer buttons', () => {
    const handleSubmit = jest.fn();
    const AddPoliciesModal = render(
      <AddPolicies
        buttonLoading
        onSubmit={handleSubmit}
        userGroupPolicies={userGroupPoliciesTest}
        currentUserGroupPolicies={currentUserGroupPoliciesTest}
      />
    );

    const { getByText } = AddPoliciesModal;

    expect(getByText('Adicionar permissão')).toBeInTheDocument();
  });
});
