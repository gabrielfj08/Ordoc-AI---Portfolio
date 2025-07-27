import * as React from 'react';
import { useModal } from '../../../../hooks';
import { ActionBox, Button, Skeleton, Typography } from 'printer-ui';

const EditProcedureModalSkeleton = () => {
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
        <div className="sm:w-[569px] space-y-6">
          <div className="sm:flex sm:space-x-10 w-full justify-center items-center">
            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/2">
              <Typography variant="footnote1" family="robotoMedium">
                Grupo de origem*:
              </Typography>
              <div className="w-full py-1.5">
                <Skeleton w="full" h={8} rounded="md" />
              </div>
            </div>
            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/2">
              <Typography variant="footnote1" family="robotoMedium">
                Solicitante*:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>
          </div>
          <div className="sm:flex sm:space-x-10">
            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/3">
              <Typography variant="footnote1" family="robotoMedium">
                Visibilidade:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>
            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/3">
              <Typography variant="footnote1" family="robotoMedium">
                Prazo:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>
            <div className="space-y-2 sm:w-1/3">
              <Typography variant="footnote1" family="robotoMedium">
                Prioridade:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>
          </div>
          <div className="sm:flex w-full sm:space-x-10">
            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/2">
              <Typography variant="footnote1" family="robotoMedium">
                Tipo de processo*:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>

            <div className="space-y-2 sm:mb-0 mb-6 sm:w-1/2">
              <Typography variant="footnote1" family="robotoMedium">
                Assunto do tipo de processo:
              </Typography>
              <Skeleton w="full" h={8} rounded="md" />
            </div>
          </div>
          <div className="space-y-2 sm:mb-0 mb-6">
            <Typography variant="footnote1" family="robotoMedium">
              Anexos do assunto do tipo de processo:
            </Typography>
            <div className="w-full">
              <Skeleton w="full" h={8} rounded="md" />
            </div>
          </div>
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

export default EditProcedureModalSkeleton;
