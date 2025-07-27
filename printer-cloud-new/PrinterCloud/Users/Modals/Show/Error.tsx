import * as React from 'react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const ShowUserModalError = () => {
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
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row items-center justify-center my-12">
            <Icon alt="error" name="alert" color="error" stroke />
            <Typography variant="footnote1" color="gray" align="center">
              Erro! Não foi possível carregar as informações do usuário. <br />
              Tente novamente mais tarde.
            </Typography>
          </div>
        </div>
      </ActionBox.Content>
    </ActionBox>
  );
};

export default ShowUserModalError;
