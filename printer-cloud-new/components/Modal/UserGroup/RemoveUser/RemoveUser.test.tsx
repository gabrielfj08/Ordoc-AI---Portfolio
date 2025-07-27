import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexUser, IndexUserGroup } from '../../../../services/types';
import RemoveUserFromGroup from './RemoveUserFromGroup';
import RemoveUser from './RemoveUser';

const user: IndexUser = {
  id: 1,
  name: 'Usuario',
  email: 'user@test.com',
  cpf: '00000000000',
  dateOfBirth: '12/12/2012',
  avatarUrl: '',
  phone: '30303030',
  prn: '',
  status: 'active',
  username: 'usuario.user',
  createdAt: '12/12/2012',
  updatedAt: '12/12/2012',
  deletedAt: '',
  organizationsCount: 0,
  userGroupsCount: 1,
};

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

describe('RemoveUser', () => {
  it('renders modal title', () => {
    const removeUserGroupModal = render(
      <RemoveUser user={user} userGroup={userGroup} />
    );

    const { getByText } = removeUserGroupModal;

    expect(getByText('Remover usuário do grupo')).toBeInTheDocument();
  });

  describe('RemoveUserFromGroup', () => {
    it('renders modal content', () => {
      const removeUserFromGroupModal = render(
        <RemoveUserFromGroup user_id={1} userGroup={userGroup} />
      );

      const { getByText } = removeUserFromGroupModal;

      expect(
        getByText('Ao clicar em remover, o usuário perderá acesso ao grupo:')
      ).toBeInTheDocument();
    });

    it('renders user name', () => {
      const removeUserGroupModal = render(
        <RemoveUser user={user} userGroup={userGroup} />
      );

      const { getByText } = removeUserGroupModal;

      expect(getByText('Usuario')).toBeInTheDocument();
    });

    it('renders group name', () => {
      const removeUserGroupModal = render(
        <RemoveUser user={user} userGroup={userGroup} />
      );

      const { getByText } = removeUserGroupModal;

      expect(getByText('Test Group')).toBeInTheDocument();
    });

    it('renders remove button', () => {
      const removeUserGroupModal = render(
        <RemoveUser user={user} userGroup={userGroup} />
      );

      const { getByText } = removeUserGroupModal;

      expect(getByText('Remover usuário')).toBeInTheDocument();
    });

    it('renders checkbox input', () => {
      const removeUserGroupModal = render(
        <RemoveUser user={user} userGroup={userGroup} />
      );

      const { getByRole } = removeUserGroupModal;

      expect(getByRole('checkbox')).toBeInTheDocument();
    });
  });
});
