import * as React from 'react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const EditProcedureModalError = () => {
  const { closeModal } = useModal();

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        onClose={closeModal}
        title="Editar dados do processo"
        icon="write"
        color="blue"
        fill
        stroke
      />
      <ActionBox.Content>
        <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
          <Icon alt="alert" name="alert" color="error" stroke />
          <Typography variant="headline" className="pl-2">
            Não foi possível carregar os dados do processo para edição.
          </Typography>
        </div>
      </ActionBox.Content>
      <ActionBox.Footer>
        <Button
          type="button"
          onClick={closeModal}
          label="Cancelar"
          color="error"
        />
        <Button type="submit" color="gray" label="Salvar alterações" />
      </ActionBox.Footer>
    </ActionBox>
  );
};

export default EditProcedureModalError;
