import * as React from 'react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const AddUserGroupError = () => {
  const { closeModal } = useModal();

  return (
    <>
      <ActionBox>
        <ActionBox.Header
          title="Adicionar usuário ao grupo"
          color="blue"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="m-2 flex items-center space-x-2 justify-center py-3">
              <Icon alt="alert" name="alert" color="error" stroke />
              <Typography variant="footnote1" color="gray">
                Erro! Não foi possível carregar os dados dos grupos. Tente
                novamente mais tarde.
              </Typography>
            </div>
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" label="Cancelar" onClick={closeModal} />
          <Button type="submit" color="blue" label="Adicionar grupo" disabled />
        </ActionBox.Footer>
      </ActionBox>
    </>
  );
};
export default AddUserGroupError;
