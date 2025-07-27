import * as React from 'react';
import router from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import {
  AuthExternalProvider,
  useAuth,
  useExternalAuth,
  useModal,
  useV3ActionSheet,
  useV3Snackbar,
} from '../../../../../hooks';
import { ExternalSignatureService } from '../../../../../services/flow-cidadao';
import { CellProps } from '../../types';
import { menuOptions } from './types';
import MenuSignatureCell from './Menu';
import SignatureExternalDocumentPreviewModal from '../../../../components/Signatures/PreviewDocuments';
import SignatureProcessActionSheet from '../../../../components/Signatures/SignatureProcess';

const MenuSignatureCellContainer = ({ signature }: CellProps) => {
  const { token, subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { openModal } = useModal();
  const { openActionSheet } = useV3ActionSheet();

  const handleRedirectToProcessesClick = () => {
    router.push(`/flow-cidadao/procedures/${signature.procedureId}`);
    openModal(
      <AuthExternalProvider>
        <SignatureExternalDocumentPreviewModal
          signatureId={signature.id}
          isRefusing={false}
        />
      </AuthExternalProvider>
    );
  };

  const mutation = useMutation(
    () =>
      ExternalSignatureService.sign(
        externalToken as string,
        subdomain,
        signature.id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['signatures', subdomain, token, {}]);
      },
    }
  );

  if (signature.status === 'created') {
    const options: menuOptions[] = [
      {
        label: 'Assinar',
        icon: 'signaturesV3',
        fill: false,
        stroke: true,
        onClick: () => {
          mutation
            .mutateAsync()
            .then((res) => {
              if (res.status === 'signed') {
                showV3Snackbar(
                  'O documento foi assinado com sucesso.',
                  'success',
                  'Assinatura efetuada com sucesso.'
                );
                queryClient.invalidateQueries([
                  'signatures',
                  subdomain,
                  token,
                  {},
                ]);
              } else {
                openActionSheet(
                  <AuthExternalProvider>
                    <SignatureProcessActionSheet signatureId={res.id} />
                  </AuthExternalProvider>
                );
              }
            })
            .catch((error) => {
              showV3Snackbar(
                error.response.data.message,
                'error',
                'Algo deu errado!'
              );
            });
        },
      },
      {
        label: 'Recusar',
        icon: 'closeV3',
        fill: false,
        stroke: true,
        onClick: () => {
          openModal(
            <AuthExternalProvider>
              <SignatureExternalDocumentPreviewModal
                signatureId={signature.id}
                isRefusing={true}
              />
            </AuthExternalProvider>
          );
        },
      },
      {
        label: 'Ir para o processo',
        icon: 'proceduresV3',
        fill: false,
        stroke: true,
        onClick: () => {
          handleRedirectToProcessesClick();
        },
      },
    ];

    return <MenuSignatureCell options={options} />;
  }

  if (signature.status === 'signed') {
    const options: menuOptions[] = [
      {
        label: 'Ir para o processo',
        icon: 'proceduresV3',
        fill: false,
        stroke: true,
        onClick: () => {
          handleRedirectToProcessesClick();
        },
      },
    ];

    return <MenuSignatureCell options={options} />;
  }

  if (signature.status === 'refused') {
    const options: menuOptions[] = [
      {
        label: 'Ir para o processo',
        icon: 'proceduresV3',
        fill: false,
        stroke: true,
        onClick: () => {
          handleRedirectToProcessesClick();
        },
      },
    ];

    return <MenuSignatureCell options={options} />;
  }

  return null;
};

export default MenuSignatureCellContainer;
