import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import router from 'next/router';
import {
  useAuth,
  useDrawer,
  useModal,
  useSnackbar,
} from '../../../../../../hooks';
import { ProcedureTemplateService } from '../../../../../../services/printer-flow';
import { MenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import ProcedureTemplateDetails from '../../../../../ProcedureTemplates/Details';
import DeactivateProcedureTemplateModal from '../../../../../ProcedureTemplates/Modals/Deactivate';
import MenuCell from './Menu';

const MenuCellContainer = ({ procedureTemplates }: MenuCellContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () =>
      ProcedureTemplateService.activate(
        token,
        subdomain,
        procedureTemplates.id
      ),
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
    if (procedureTemplates.status === 'active') {
      return 'error';
    } else {
      return 'success';
    }
  };

  const statusLabel = () => {
    if (procedureTemplates.status === 'active') {
      return 'Desativar tipo de processo';
    } else {
      return 'Ativar tipo de processo';
    }
  };

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () =>
        router.push(
          `/printer-flow/procedure-templates/${procedureTemplates.id}/edit`
        ),
    },
    {
      icon: 'info',
      fill: false,
      onClick: () => {
        openDrawer(
          <ProcedureTemplateDetails
            procedureTemplateId={procedureTemplates.id}
          />,
          'right'
        );
      },
      label: 'Detalhes',
      stroke: true,
    },
    {
      icon: 'procedureTemplateV3',
      fill: true,
      onClick: () => {
        procedureTemplates.status === 'active'
          ? openModal(
              <DeactivateProcedureTemplateModal
                parentProcedureTemplateId={
                  procedureTemplates.parentProcedureTemplateId
                }
                procedureTemplateId={procedureTemplates.id}
                procedureTemplateName={procedureTemplates.name}
              />
            )
          : mutation
              .mutateAsync()
              .then(() => {
                showSnackbar(
                  `Tipo de processo ativado com sucesso.`,
                  'success'
                );
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

  return <MenuCell options={options} />;
};

export default MenuCellContainer;
