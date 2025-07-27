import * as React from 'react';
import router from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  useAuth,
  useDrawer,
  useModal,
  useSnackbar,
} from '../../../../../../hooks';
import { RequesterService } from '../../../../../../services/printer-flow';
import { GroupsMenuButtonCellContainerProps } from './types';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import GroupsMenuButtonCell from './MenuButton';
import DetailsGroup from '../../../../../Groups/Details';
import DeactivateGroupModal from '../../../../../Groups/Modals/Deactivate';

const GroupsMenuButtonCellContainer = ({
  group,
}: GroupsMenuButtonCellContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () => RequesterService.activate(token, subdomain, group.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'groupRequesters',
          subdomain,
          token,
          {},
        ]);
      },
    }
  );

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () => router.push(`/printer-flow/groups/${group.id}`),
    },
    {
      label: 'Detalhes',
      icon: 'info',
      fill: false,
      stroke: true,
      onClick: () =>
        openDrawer(<DetailsGroup groupRequesterId={group.id} />, 'right'),
    },
    {
      label: `${
        group.status === 'active' ? 'Desativar grupo' : 'Ativar grupo'
      }`,
      icon: 'groupRequesterV3',
      fill: true,
      stroke: false,
      color: group.status === 'active' ? 'error' : 'success',
      onClick: () => {
        group.status === 'active'
          ? openModal(
              <DeactivateGroupModal groupId={group.id} groupName={group.name} />
            )
          : mutation
              .mutateAsync()
              .then(() => {
                showSnackbar(
                  `Grupo solicitante ativado com sucesso.`,
                  'success'
                );
              })
              .catch((error) => {
                if (
                  error.response.status >= 400 &&
                  error.response.status < 500
                ) {
                  showSnackbar(error.response.data.message, 'error');
                } else {
                  showSnackbar(
                    'O Grupo solicitante não pôde ser ativado, tente novamente mais tarde.',
                    'error'
                  );
                }
              });
      },
    },
  ];
  return <GroupsMenuButtonCell options={options} />;
};

export default GroupsMenuButtonCellContainer;
