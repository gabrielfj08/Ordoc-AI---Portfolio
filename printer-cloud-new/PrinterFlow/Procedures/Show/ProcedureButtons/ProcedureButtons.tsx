import * as React from 'react';
import { Button } from 'printer-ui';
import { useModal, useSessionGroupRequester } from '../../../../hooks';
import { ProcedureButtonsProps } from './types';
import ArchiveProcedureModal from '../../Modals/Archive';
import UnarchiveProcedureModal from '../../Modals/Unarchive';
import FinishProcedureModal from '../../Modals/Finish';

const ProcedureButtons = ({ procedure }: ProcedureButtonsProps) => {
  const { sessionGroupRequester } = useSessionGroupRequester();
  const { openModal } = useModal();

  switch (procedure.status) {
    case 'draft':
      return (
        <Button
          className="pl-7 sm:pl-4"
          outlined
          color="error"
          label={window.innerWidth < 640 ? '' : 'Arquivar processo'}
          onClick={() =>
            openModal(
              <ArchiveProcedureModal
                groupRequesterId={sessionGroupRequester.id}
                procedureId={procedure.id}
                processNumber={procedure.processNumber}
              />
            )
          }
        >
          <Button.Icon
            name="archive"
            alt="archive"
            color="error"
            stroke
            w={25}
            h={25}
          />
        </Button>
      );

    case 'started':
      return (
        <div className="flex space-x-4">
          <Button
            className="pl-7 sm:pl-4"
            outlined
            color="error"
            label={window.innerWidth < 640 ? '' : 'Arquivar processo'}
            onClick={() =>
              openModal(
                <ArchiveProcedureModal
                  groupRequesterId={sessionGroupRequester.id}
                  procedureId={procedure.id}
                  processNumber={procedure.processNumber}
                />
              )
            }
          >
            <Button.Icon
              alt="archive"
              name="archive"
              color="error"
              stroke
              w={25}
              h={25}
            />
          </Button>
          <Button
            className="pl-7 sm:pl-4"
            outlined
            color="success"
            label={window.innerWidth < 640 ? '' : 'Finalizar processo'}
            onClick={() =>
              openModal(
                <FinishProcedureModal
                  groupRequesterId={sessionGroupRequester.id}
                  procedureId={procedure.id}
                  processNumber={procedure.processNumber}
                />
              )
            }
          >
            <Button.Icon
              alt="finishProcedure"
              name="finishedProcedure"
              color="success"
              stroke
              w={25}
              h={25}
            />
          </Button>
        </div>
      );

    case 'running':
      return (
        <div className="flex space-x-4">
          <Button
            className="pl-7 sm:pl-4"
            outlined
            color="error"
            label={window.innerWidth < 640 ? '' : 'Arquivar processo'}
            onClick={() =>
              openModal(
                <ArchiveProcedureModal
                  groupRequesterId={sessionGroupRequester.id}
                  procedureId={procedure.id}
                  processNumber={procedure.processNumber}
                />
              )
            }
          >
            <Button.Icon
              alt="archive"
              name="archive"
              color="error"
              stroke
              w={25}
              h={25}
            />
          </Button>
          <Button
            className="pl-7 sm:pl-4"
            outlined
            color="success"
            label={window.innerWidth < 640 ? '' : 'Finalizar processo'}
            onClick={() =>
              openModal(
                <FinishProcedureModal
                  groupRequesterId={sessionGroupRequester.id}
                  procedureId={procedure.id}
                  processNumber={procedure.processNumber}
                />
              )
            }
          >
            <Button.Icon
              alt="finishProcedure"
              name="finishedProcedure"
              color="success"
              stroke
              w={25}
              h={25}
            />
          </Button>
        </div>
      );

    case 'archived':
      return (
        <Button
          className="pl-7 sm:pl-4"
          outlined
          color="success"
          label={window.innerWidth < 640 ? '' : 'Desarquivar processo'}
          onClick={() =>
            openModal(
              <UnarchiveProcedureModal
                groupRequesterId={Number(sessionGroupRequester.id)}
                procedureId={procedure.id}
                processNumber={procedure.processNumber}
              />
            )
          }
        >
          <Button.Icon
            alt="unarchive"
            name="unarchive"
            color="success"
            stroke
            w={25}
            h={25}
          />
        </Button>
      );

    default:
      return null;
  }
};

export default ProcedureButtons;
