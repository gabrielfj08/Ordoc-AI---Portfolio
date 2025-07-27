import * as React from 'react';
import { useRouter } from 'next/router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  useAuth,
  useDrawer,
  useModal,
  useSnackbar,
} from '../../../../../../hooks';
import { RequesterService } from '../../../../../../services/printer-flow';
import { MenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import DetailsRequester from '../../../../../Requesters/Details';
import DeactivateRequesterModal from '../../../../../Requesters/Modals/Deactivate';
import MenuCell from './Menu';

const MenuCellContainer = ({ requester }: MenuCellContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const mutation = useMutation(
    () => RequesterService.activate(token, subdomain, requester.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['requesters', subdomain, token, {}]);
      },
    }
  );

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () =>
        router.push(`/printer-flow/requesters/${requester.id}/edit`),
    },
    {
      icon: 'info',
      fill: false,
      onClick: () =>
        openDrawer(<DetailsRequester requesterId={requester.id} />, 'right'),
      label: 'Detalhes',
      stroke: true,
    },
    {
      icon: 'requesterV3',
      fill: true,
      color: requester.status === 'active' ? 'error' : 'success',
      onClick: () => {
        requester.status === 'active'
          ? openModal(
              <DeactivateRequesterModal
                requesterId={requester.id}
                requesterName={requester.name}
              />
            )
          : mutation
              .mutateAsync()
              .then(() => {
                showSnackbar(`Solicitante ativado com sucesso.`, 'success');
              })
              .catch((error) => {
                if (
                  error.response.status >= 400 &&
                  error.response.status < 500
                ) {
                  showSnackbar(error.response.data.message, 'error');
                } else {
                  showSnackbar(
                    'O solicitante não pôde ser ativado, tente novamente mais tarde.',
                    'error'
                  );
                }
              });
      },
      label: `${
        requester.status === 'active'
          ? 'Desativar solicitante'
          : 'Ativar solicitante'
      }`,
      stroke: false,
    },
  ];

  return <MenuCell options={options} />;
};

export default MenuCellContainer;
