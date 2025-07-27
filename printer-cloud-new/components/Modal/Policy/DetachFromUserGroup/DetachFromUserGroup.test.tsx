import * as React from 'react';
import { render } from '@testing-library/react';

import DetachFromUserGroup from './DetachFromUserGroup';

describe('DetachFromUserGroup', () => {
  it('renders modal title', () => {
    const detachFromUserGroupModal = render(
      <DetachFromUserGroup
        policy_id={1}
        user_group_id={1}
        user_group_name="Grupo"
      />
    );

    const { getByText } = detachFromUserGroupModal;

    expect(getByText('Remover grupo da permissão')).toBeInTheDocument();
  });

  it('renders user group name', () => {
    const detachFromUserGroupModal = render(
      <DetachFromUserGroup
        policy_id={1}
        user_group_id={1}
        user_group_name="Grupo"
      />
    );

    const { getByText } = detachFromUserGroupModal;

    expect(getByText('Grupo')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    const detachFromUserGroupModal = render(
      <DetachFromUserGroup
        policy_id={1}
        user_group_id={1}
        user_group_name="Grupo"
      />
    );

    const { getByText } = detachFromUserGroupModal;

    expect(getByText('Remover grupo')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const detachFromUserGroupModal = render(
      <DetachFromUserGroup
        policy_id={1}
        user_group_id={1}
        user_group_name="Grupo"
      />
    );

    const { getByRole } = detachFromUserGroupModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
