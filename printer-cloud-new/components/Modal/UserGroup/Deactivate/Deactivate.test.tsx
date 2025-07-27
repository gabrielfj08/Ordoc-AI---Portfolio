import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexUserGroup } from '../../../../services/types';

import Deactivate from './Deactivate';

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

describe('Deactivate', () => {
  it('renders modal content', () => {
    const deactivateGroupModal = render(
      <Deactivate userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deactivateGroupModal;

    expect(
      getByText('Você tem certeza que quer desativar o grupo abaixo?')
    ).toBeInTheDocument();
  });

  it('renders group name', () => {
    const deactivateGroupModal = render(
      <Deactivate userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deactivateGroupModal;

    expect(getByText('Test Group')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    const deactivateGroupModal = render(
      <Deactivate userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByText } = deactivateGroupModal;

    expect(getByText('Cancelar')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const deactivateGroupModal = render(
      <Deactivate userGroup={userGroup} onSubmit={() => {}} />
    );

    const { getByRole } = deactivateGroupModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
