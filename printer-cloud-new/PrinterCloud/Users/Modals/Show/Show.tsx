import * as React from 'react';
import { ActionBox, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { ShowUserModalProps } from './types';
import SendPassword from './SendPassword';

const ShowUserModal = ({ user }: ShowUserModalProps) => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <ActionBox.Header
        title="Visualizar usuário"
        color="blue"
        icon="user"
        fill
        stroke
        onClose={closeModal}
      />
      <ActionBox.Content>
        <div className="sm:w-[569px]">
          <div className="overflow-hidden sm:w-auto w-72 space-y-3">
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Nome:
              </Typography>
              <Typography variant="footnote1">{user.name}</Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Email:
              </Typography>
              <Typography variant="footnote1">{user.email}</Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                CPF:
              </Typography>
              <Typography variant="footnote1" className="h-4">
                {user.cpf}
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Data de nascimento:
              </Typography>
              <Typography variant="footnote1" className="h-4">
                {user.dateOfBirth}
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Telefone:
              </Typography>
              <Typography variant="footnote1" className="h-4">
                {user.phone}
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Nº de Matrícula:
              </Typography>
              <Typography variant="footnote1" className="h-4">
                {user.registrationNumber}
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="headline" family="robotoMedium">
                Username:
              </Typography>
              <Typography variant="footnote1">{user.username}</Typography>
            </div>
          </div>
        </div>
      </ActionBox.Content>
      <ActionBox.Footer>
        <SendPassword userId={user.id} />
      </ActionBox.Footer>
    </ActionBox>
  );
};

export default ShowUserModal;
