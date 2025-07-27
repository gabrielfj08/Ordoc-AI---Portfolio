import * as React from 'react';
import { render } from '@testing-library/react';
import DeleteUserModal from './Delete';

describe('DeleteUser', () => {
  it('renders modal content', () => {
    const deleteUserOrganizationModal = render(
      <DeleteUserModal userName="Katia Werner" id={1} />
    );

    const { getByText } = deleteUserOrganizationModal;

    expect(
      getByText(
        'Você tem certeza que quer excluir do Printer Cloud o usuário abaixo?'
      )
    ).toBeInTheDocument();
  });

  it('renders footer button', () => {
    const deleteUserOrganizationModal = render(
      <DeleteUserModal userName="Katia Werner" id={1} />
    );

    const { getByText } = deleteUserOrganizationModal;

    expect(getByText('Cancelar')).toBeInTheDocument();
  });
});
