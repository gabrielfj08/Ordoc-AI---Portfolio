import * as React from 'react';
import { render } from '@testing-library/react';
import { ShowUserAPIResponse } from '../../../../services/types';
import DeactivateUser from './DeactivateUser';

const userShowTest: ShowUserAPIResponse = {
  id: 4,
  name: 'Flávia Fontana',
  email: 'flavia.fontana@gmail.com',
  cpf: '035.098.908-10',
  dateOfBirth: '25/10/2000',
  avatarUrl:
    'https://gravatar.com/avatar/e9d8df96aa34362d704a8703641431ed?s=400&d=robohash&r=x',
  organizationId: 1,
  phone: '41988099908',
  prn: '',
  status: 'active',
  username: 'flavia.fontana',
  registrationNumber: '3789',
  createdAt: '2022-11-24T16:15:05.486Z',
  updatedAt: '',
};

it('renders modal content', () => {
  const DeactivateUserModal = render(
    <div>
      <DeactivateUser user={userShowTest} />
    </div>
  );

  const { getByText } = DeactivateUserModal;

  expect(
    getByText(
      'Ao clicar em desativar usuário você estará o desativando de todos os grupos, diretórios, arquivos e acessos da instituição.'
    )
  ).toBeInTheDocument();
});

it('renders footer buttons', () => {
  const DeactivateUserModal = render(
    <div>
      <DeactivateUser user={userShowTest} />
    </div>
  );

  const { getByText } = DeactivateUserModal;

  expect(getByText('Cancelar')).toBeInTheDocument();
});
