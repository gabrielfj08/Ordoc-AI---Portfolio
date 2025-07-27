import * as React from 'react';
import getConfig from 'next/config';
import {
  AuthExternalProvider,
  useAuth,
  useExternalAuth,
  useModal,
  useV3ActionSheet,
  useV3Snackbar,
} from '../../../../../hooks';
import { menuOptions } from './types';
import { CellProps } from '../../types';
import { ExternalProcedureReportService } from '../../../../../services/flow-cidadao';
import ProcedureReportActionSheet from '../../../../components/Procedures/ProcedureReport';
import ShareProcedureModal from '../../../../components/Procedures/ShareProcedure';
import MenuProcedureCell from './Menu';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const MenuProcedureCellContainer = ({ procedure }: CellProps) => {
  const { openModal } = useModal();
  const { subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { externalToken } = useExternalAuth();
  const { openActionSheet } = useV3ActionSheet();

  const generateReport = () => {
    return ExternalProcedureReportService.create(
      String(externalToken),
      subdomain,
      procedure.id
    )
      .then((res) => {
        if (res.status === 'finished') {
          showV3Snackbar(
            'Seu comprovante abrirá em uma nova aba.',
            'success',
            'PDF criado com sucesso.'
          );
          window.document.open(
            `${apiUrl}/${res.documentUrl}`,
            '_blank',
            'noreferrer'
          );
        } else {
          openActionSheet(
            <AuthExternalProvider>
              <ProcedureReportActionSheet
                procedureId={res.procedureId}
                procedureReportId={res.id}
              />
            </AuthExternalProvider>
          );
        }
      })
      .catch((error) => {
        showV3Snackbar(
          error.response.data.message,
          'error',
          'Falha na criação do PDF.'
        );
      });
  };

  if (procedure.status !== 'draft') {
    const options: menuOptions[] = [
      {
        label: 'Gerar comprovante',
        icon: 'printerV3',
        fill: false,
        stroke: true,
        onClick: () => {
          generateReport();
        },
      },
      {
        label: 'Compartilhar',
        icon: 'sharedV3',
        fill: false,
        stroke: true,
        onClick: () => {
          openModal(
            <AuthExternalProvider>
              <ShareProcedureModal procedure={procedure} />
            </AuthExternalProvider>
          );
        },
      },
    ];

    return <MenuProcedureCell options={options} />;
  }

  return null;
};

export default MenuProcedureCellContainer;
