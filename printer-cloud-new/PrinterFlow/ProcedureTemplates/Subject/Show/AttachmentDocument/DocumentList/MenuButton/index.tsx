import * as React from 'react';
import router from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../../../queryClient';
import { useAuth, useSnackbar } from '../../../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../../../services/printer-flow';
import { BaseProcedureTemplateDocument } from '../../../../../../../services/printer-flow/types/procedureTemplateDocument';
import { menuOptions } from '../../../../../../../components/MenuButton/types';
import { SubjectMenuButtonListContainerProps } from './types';
import MenuButtonList from './MenuButtonList';

const SubjectMenuButtonListContainer = ({
  procedureTemplateDocument,
}: SubjectMenuButtonListContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const removeDocumentMutation = useMutation(
    (procedureTemplateDocument: BaseProcedureTemplateDocument) =>
      ProcedureTemplateDocumentService.remove(
        token,
        subdomain,
        Number(router.query.id),
        procedureTemplateDocument.id
      )
  );

  const options: Array<menuOptions> = [
    {
      icon: 'trashV2',
      fill: true,
      stroke: false,
      label: 'Remover',
      onClick: () =>
        removeDocumentMutation
          .mutateAsync(procedureTemplateDocument)
          .then(() => {
            queryClient.invalidateQueries([
              'procedureTemplateDocuments',
              subdomain,
              token,
            ]);
            showSnackbar('Anexo removido com sucesso.', 'success');
          })
          .catch((error) => showSnackbar(error.response.data.message, 'error')),
    },
  ];

  return <MenuButtonList options={options} />;
};

export default SubjectMenuButtonListContainer;
