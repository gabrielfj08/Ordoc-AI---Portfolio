import * as React from 'react';
import { ActionBox, Button, Input, Skeleton, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const AddPoliciesSkeleton = () => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <ActionBox.Header
        title="Adicionar novas permissões"
        color="blue"
        icon="group"
        stroke
        onClose={closeModal}
      />
      <ActionBox.Content>
        <div className="sm:w-[569px] space-y-2">
          <Skeleton w={144} h={56} rounded="md" className="sm:flex hidden" />
          <Skeleton w={72} h={32} rounded="md" className="flex sm:hidden" />
        </div>
      </ActionBox.Content>
      <ActionBox.Footer>
        <Button type="button" label="Cancelar" onClick={closeModal} />
        <Button
          type="submit"
          color="blue"
          label="Adicionar permissão"
          disabled
        />
      </ActionBox.Footer>
    </ActionBox>
  );
};
export default AddPoliciesSkeleton;
