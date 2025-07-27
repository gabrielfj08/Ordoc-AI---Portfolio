import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { SignableTypeCellProps } from '../../types';
import { SignableType } from '../../../../../constants/SignableType';

const signableTypeName: Record<string, string> = {
  'PrinterFlow::ProcedureDocument': 'Documento do processo',
  'PrinterFlow::TaskDocument': 'Documento da tarefa',
};

const SignableTypeCell = ({ signature }: SignableTypeCellProps) => {
  return (
    <>
      {signature.signableType === SignableType.procedureDocument ? (
        <div
          id={`procedureDocument${signature.signable.id}`}
          data-tooltip-content={signableTypeName[signature.signableType]}
        >
          <Icon
            alt="signableType"
            name="proceduresV3"
            stroke
            w={24}
            h={24}
            color="gray"
          />
          <ReactTooltip
            anchorId={`procedureDocument${signature.signable.id}`}
          />
        </div>
      ) : (
        <div
          id={`taskDocument${signature.signable.id}`}
          data-tooltip-content={signableTypeName[signature.signableType]}
        >
          <Icon
            alt="signableType"
            name="tasksV3"
            stroke
            color="gray"
            w={24}
            h={24}
          />
          <ReactTooltip anchorId={`taskDocument${signature.signable.id}`} />
        </div>
      )}
    </>
  );
};

export default SignableTypeCell;
