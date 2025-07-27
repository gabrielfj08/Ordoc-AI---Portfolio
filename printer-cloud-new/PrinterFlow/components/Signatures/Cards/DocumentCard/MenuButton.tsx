import * as React from 'react';
import getConfig from 'next/config';
import { useMutation } from '@tanstack/react-query';
import { SignatureService } from '../../../../../services/printer-flow';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useSnackbar } from '../../../../../hooks';
import MenuButton from '../../../../../components/MenuButton';
import { menuOptions } from '../../../../../components/MenuButton/types';
import { DocumentCardMenuButtonProps } from './types';

const DocumentCardMenuButton = ({ signature }: DocumentCardMenuButtonProps) => {
  const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () => SignatureService.deleteSignature(token, subdomain, signature.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['signaturesIndex', token, subdomain]);
      },
    }
  );

  const options: menuOptions[] = [
    {
      label: 'Excluir Solicitação',
      icon: 'trashV2',
      color: 'error',
      fill: true,
      stroke: false,
      onClick: () => {
        mutation
          .mutateAsync()
          .then(() => {
            showSnackbar(
              `Solicitação de assinatura excluída com sucesso.`,
              'success'
            );
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
    },
    {
      label: 'Ver documento',
      icon: 'eye',
      fill: true,
      stroke: false,
      onClick: () => {
        window.document.open(
          `${apiUrl}/${signature.signable.documentUrl}`,
          '_blank',
          'noreferrer'
        );
      },
    },
  ];

  return <MenuButton options={options} />;
};

export default DocumentCardMenuButton;
