import * as React from 'react';
import router from 'next/router';
import { useActionSheet, useModal } from '../../../../../../hooks';
import { MenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import ArchiveProcedureModal from '../../../../../Procedures/Modals/Archive';
import UnarchiveProcedureModal from '../../../../../Procedures/Modals/Unarchive';
import FinishProcedureModal from '../../../../../Procedures/Modals/Finish';
import CreateProcedurePDFActionSheet from '../../../../../Procedures/New/Info/ActionSheet';
import MenuCell from './Menu';

const MenuCellContainer = ({ procedure }: MenuCellContainerProps) => {
  const { openActionSheet } = useActionSheet();
  const { openModal } = useModal();

  if (procedure.status === 'draft') {
    const options: menuOptions[] = [
      {
        icon: 'archive',
        fill: false,
        onClick: () => {
          openModal(
            <ArchiveProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Arquivar',
        stroke: true,
      },
      {
        icon: 'write',
        fill: true,
        onClick: () =>
          router.push(
            `/printer-flow/group-requesters/${procedure.responsibleGroupId}/procedures/${procedure.id}`
          ),
        label: 'Editar',
        stroke: true,
      },
      {
        icon: 'pdfFileV2',
        fill: true,
        onClick: () => {
          openActionSheet(
            <CreateProcedurePDFActionSheet procedureId={procedure.id} />
          );
        },
        label: 'Gerar PDF',
        stroke: false,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (procedure.status === 'running') {
    const options: menuOptions[] = [
      {
        icon: 'archive',
        fill: false,
        onClick: () => {
          openModal(
            <ArchiveProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Arquivar',
        stroke: true,
      },
      {
        icon: 'procedureFinished',
        fill: false,
        onClick: () => {
          openModal(
            <FinishProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Finalizar',
        stroke: true,
      },
      {
        icon: 'pdfFileV2',
        fill: true,
        onClick: () => {
          openActionSheet(
            <CreateProcedurePDFActionSheet procedureId={procedure.id} />
          );
        },
        label: 'Gerar PDF',
        stroke: false,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (procedure.status === 'started') {
    const options: menuOptions[] = [
      {
        icon: 'archive',
        fill: false,
        onClick: () => {
          openModal(
            <ArchiveProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Arquivar',
        stroke: true,
      },
      {
        icon: 'procedureFinished',
        fill: false,
        onClick: () => {
          openModal(
            <FinishProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Finalizar',
        stroke: true,
      },
      {
        icon: 'pdfFileV2',
        fill: true,
        onClick: () => {
          openActionSheet(
            <CreateProcedurePDFActionSheet procedureId={procedure.id} />
          );
        },
        label: 'Gerar PDF',
        stroke: false,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (procedure.status === 'archived') {
    const options: menuOptions[] = [
      {
        icon: 'unarchive',
        fill: false,
        onClick: () => {
          openModal(
            <UnarchiveProcedureModal
              procedureId={procedure.id}
              processNumber={procedure.processNumber}
            />
          );
        },
        label: 'Desarquivar',
        stroke: true,
      },
      {
        icon: 'pdfFileV2',
        fill: true,
        onClick: () => {
          openActionSheet(
            <CreateProcedurePDFActionSheet procedureId={procedure.id} />
          );
        },
        label: 'Gerar PDF',
        stroke: false,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (procedure.status === 'finished') {
    const options: menuOptions[] = [
      {
        icon: 'pdfFileV2',
        fill: true,
        onClick: () => {
          openActionSheet(
            <CreateProcedurePDFActionSheet procedureId={procedure.id} />
          );
        },
        label: 'Gerar PDF',
        stroke: false,
      },
    ];

    return <MenuCell options={options} />;
  }

  return null;
};

export default MenuCellContainer;
