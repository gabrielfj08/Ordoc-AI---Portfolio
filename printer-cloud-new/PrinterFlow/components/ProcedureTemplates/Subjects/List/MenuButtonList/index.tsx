import * as React from 'react';
import router from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth, useModal, useSnackbar } from '../../../../../../hooks';
import { ProcedureTemplateService } from '../../../../../../services/printer-flow';
import { MenuButtonListContainerProps } from './types';
import DeactivateProcedureTemplateModal from '../../../../../ProcedureTemplates/Modals/Deactivate';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import MenuButtonList from './MenuButtonList';

const MenuButtonListContainer = ({
  procedureTemplate,
}: MenuButtonListContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () =>
      ProcedureTemplateService.activate(token, subdomain, procedureTemplate.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'procedureTemplates',
          subdomain,
          token,
          {},
        ]);
      },
    }
  );

  const colorIcon = () => {
    if (procedureTemplate.status === 'active') {
      return 'error';
    } else {
      return 'success';
    }
  };

  const statusLabel = () => {
    if (procedureTemplate.status === 'active') {
      return 'Desativar assunto';
    } else {
      return 'Ativar assunto';
    }
  };

  const options: Array<menuOptions> = [
    {
      icon: 'write',
      fill: true,
      stroke: true,
      label: 'Editar',
      onClick: () =>
        router.push(
          `/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${procedureTemplate.id}/edit`
        ),
    },
    {
      icon: 'procedureTemplateV3',
      fill: true,
      onClick: () => {
        procedureTemplate.status === 'active'
          ? openModal(
              <DeactivateProcedureTemplateModal
                parentProcedureTemplateId={
                  procedureTemplate.parentProcedureTemplateId
                }
                procedureTemplateId={procedureTemplate.id}
                procedureTemplateName={procedureTemplate.name}
              />
            )
          : mutation
              .mutateAsync()
              .then(() => {
                showSnackbar(`Assunto ativado com sucesso.`, 'success');
              })
              .catch((error) => {
                showSnackbar(error.response.data.message, 'error');
              });
      },
      label: statusLabel(),
      stroke: true,
      color: colorIcon(),
    },
  ];
  return <MenuButtonList options={options} />;
};

export default MenuButtonListContainer;
