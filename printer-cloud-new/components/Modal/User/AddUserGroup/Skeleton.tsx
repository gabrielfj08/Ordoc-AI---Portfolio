import * as React from 'react';
import { ActionBox, Button, Input, Skeleton, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const AddUserGroupSkeleton = () => {
  const { closeModal } = useModal();

  return (
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
          <Skeleton w={144} h={20} rounded="md" className="sm:flex hidden" />
          <Skeleton w="full" h={16} rounded="md" className="flex sm:hidden" />
        </div>
      </ActionBox.Content>
      <ActionBox.Footer>
        <Button type="button" label="Cancelar" onClick={closeModal} />
        <Button type="submit" color="blue" label="Adicionar grupo" disabled />
      </ActionBox.Footer>
    </ActionBox>
  );
};
export default AddUserGroupSkeleton;
