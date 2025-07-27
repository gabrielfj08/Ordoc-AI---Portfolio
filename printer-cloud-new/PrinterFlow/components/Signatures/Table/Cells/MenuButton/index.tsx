import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../../../../../queryClient';
import { useAuth, useModal, useSnackbar } from '../../../../../../hooks';
import { CellsContainerProps } from '../../types';
import { SignatureService } from '../../../../../../services/printer-flow';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import SignatureDocumentModal from '../../../../../Signatures/Modals/PreviewDocuments';
import MenuButtonCell from './MenuButton';

const MenuButtonCellContainer = ({ signature }: CellsContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { openModal } = useModal();

  if (signature.status === 'created') {
    const options: menuOptions[] = [
      {
        icon: 'signaturesV3',
        fill: false,
        color: 'success',
        onClick: () => {
          SignatureService.sign(token, subdomain, signature.id)
            .then(() => {
              showSnackbar('Documento assinado com sucesso.', 'success');
              queryClient.invalidateQueries([
                'signaturesCount',
                token,
                subdomain,
              ]);
              queryClient.invalidateQueries([
                'indexSignatures',
                token,
                subdomain,
                {},
              ]);
            })
            .catch((err) => showSnackbar(err.response.data.message, 'error'));
        },
        label: 'Assinar',
        stroke: true,
      },
      {
        icon: 'failed',
        color: 'error',
        fill: true,
        onClick: () => {
          openModal(<SignatureDocumentModal signatureId={signature.id} />);
        },
        label: 'Recusar',
        stroke: false,
      },
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${signature.procedure.responsibleGroupId}/procedures/${signature.procedureId}`
          );
          openModal(<SignatureDocumentModal signatureId={signature.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuButtonCell options={options} />;
  }

  if (signature.status === 'signed') {
    const options: menuOptions[] = [
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${signature.procedure.responsibleGroupId}/procedures/${signature.procedureId}`
          );
          openModal(<SignatureDocumentModal signatureId={signature.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuButtonCell options={options} />;
  }

  if (signature.status === 'refused') {
    const options: menuOptions[] = [
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${signature.procedure.responsibleGroupId}/procedures/${signature.procedureId}`
          );
          openModal(<SignatureDocumentModal signatureId={signature.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuButtonCell options={options} />;
  }

  return null;
};

export default MenuButtonCellContainer;
