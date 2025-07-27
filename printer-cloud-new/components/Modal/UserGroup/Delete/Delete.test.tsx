import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexUserGroup } from '../../../../services/types';

import Delete from './Delete';

const userGroup: IndexUserGroup = {
  id: 1,
  name: 'Test Group',
  description: 'description for test',
  organizationId: 1,
  status: 'active',
  prn: 'test/test',
  createdAt: '12/12/2012',
  updatedAt: '12/12/2012',
  organization: { corporateName: 'test organization' },
};

describe('Delete', () => {
  it('renders modal content', () => {
    const deleteGroupModal = render(
      <Delete userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deleteGroupModal;

    expect(
      getByText('Você tem certeza que quer excluir o grupo abaixo?')
    ).toBeInTheDocument();
  });

  it('renders group name', () => {
    const deleteGroupModal = render(
      <Delete userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deleteGroupModal;

    expect(getByText('Test Group')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    const deleteGroupModal = render(
      <Delete userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deleteGroupModal;

    expect(getByText('Cancelar')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const deleteGroupModal = render(
      <Delete userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByRole } = deleteGroupModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
