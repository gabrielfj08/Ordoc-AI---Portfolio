import * as React from 'react';
import { render } from '@testing-library/react';

import DetachFromUser from './DetachFromUser';

describe('DetachFromUser', () => {
  it('renders modal title', () => {
    const detachFromUserModal = render(
      <DetachFromUser policy_id={1} user_id={1} user_name="Usuário" />
    );

    const { getByText } = detachFromUserModal;

    expect(getByText('Remover usuário da permissão')).toBeInTheDocument();
  });

  it('renders user name', () => {
    const detachFromUserModal = render(
      <DetachFromUser policy_id={1} user_id={1} user_name="Usuário" />
    );

    const { getByText } = detachFromUserModal;

    expect(getByText('Usuário')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    const detachFromUserModal = render(
      <DetachFromUser policy_id={1} user_id={1} user_name="Usuário" />
    );

    const { getByText } = detachFromUserModal;

    expect(getByText('Remover usuário')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const detachFromUserModal = render(
      <DetachFromUser policy_id={1} user_id={1} user_name="Usuário" />
    );

    const { getByRole } = detachFromUserModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
