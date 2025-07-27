import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { ProcedureTemplateStatusProps } from './types';

const ProcedureTemplateStatus = ({
  procedureTemplates,
}: ProcedureTemplateStatusProps) => {
  const statusTooltipMapping: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
  };
  {
    return (
      <>
        <div className="flex items-center justify-center space-x-2 px-4 w-fit lg:w-44">
          <div className="hidden sm:flex items-center justify-center px-6">
            <div
              id={`status${procedureTemplates.id}`}
              data-tooltip-content={
                statusTooltipMapping[procedureTemplates.status]
              }
              className="hidden sm:flex items-center justify-center w-4/12"
            >
              <>
                <Icon
                  alt="activated"
                  name="procedureTemplateV3"
                  w={25}
                  h={25}
                  fill
                  stroke
                  color={
                    procedureTemplates.status === 'active' ? 'success' : 'error'
                  }
                />
                <ReactTooltip anchorId={`status${procedureTemplates.id}`} />
              </>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ProcedureTemplateStatus;
