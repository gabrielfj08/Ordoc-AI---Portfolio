import * as React from 'react';
import { ActionBox, Button, Skeleton, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';

const NewSignatureRequestersModalSkeleton = () => {
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
          <div className="overflow-hidden w-full">
            <Typography variant="footnote1" family="robotoMedium">
              Adicionar assinantes*:
            </Typography>
          </div>
          <Skeleton w="full" h={10} rounded="md" />
          <div className="overflow-hidden w-full">
            <Typography variant="footnote1" family="robotoMedium">
              Selecione os documentos do processo a serem assinados:
            </Typography>
          </div>
          <Skeleton w="full" h={10} rounded="md" />
          <div className="overflow-hidden w-full">
            <Typography variant="footnote1" family="robotoMedium">
              Selecione os documentos da tarefa a serem assinados:
            </Typography>
          </div>
          <Skeleton w="full" h={10} rounded="md" />
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
          disabled
        />
      </ActionBox.Footer>
    </ActionBox>
  );
};
export default NewSignatureRequestersModalSkeleton;
