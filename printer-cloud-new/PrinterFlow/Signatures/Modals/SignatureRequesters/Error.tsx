import * as React from 'react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const NewSignatureRequestersModalError = () => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <ActionBox.Header
        title="Adicionar assinantes"
        color="blue"
        icon="signaturesV3"
        stroke
        onClose={closeModal}
        className="sm:h-[66px]"
      />
      <ActionBox.Content>
        <div className="sm:w-[569px] space-y-3">
          <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7 px-4">
            <Icon alt="alert" name="alert" color="error" stroke />
            <Typography variant="footnote1" color="gray" align="center">
              Erro! Não foi possível carregar as informações para adicionar
              assinante,tente novamente mais tarde.
            </Typography>
          </div>
        </div>
      </ActionBox.Content>
      <ActionBox.Footer>
        <Button
          type="button"
          color="error"
          label="Cancelar"
          onClick={closeModal}
        />
        <Button
          type="submit"
          color="info"
          label="Adicionar assinantes"
          disabled={true}
        />
      </ActionBox.Footer>
    </ActionBox>
  );
};

export default NewSignatureRequestersModalError;
