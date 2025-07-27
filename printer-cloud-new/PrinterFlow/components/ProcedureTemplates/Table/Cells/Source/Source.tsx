import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { ProcedureTemplateSourceProps } from './types';

const ProcedureTemplateSource = ({
  procedureTemplates,
}: ProcedureTemplateSourceProps) => {
  const Source = () => {
    switch (procedureTemplates.source) {
      case 'internal':
        return (
          <div className="hidden sm:flex items-center justify-center px-6">
            <div
              id={`procedureTemplateType${procedureTemplates.id}`}
              data-tooltip-content={'Interno'}
            >
              <Icon alt="internal" name="internal" fill stroke w={35} h={35} />
              <ReactTooltip
                anchorId={`procedureTemplateType${procedureTemplates.id}`}
              />
            </div>
          </div>
        );

      case 'external':
        return (
          <div className="hidden sm:flex items-center justify-center px-6">
            <div
              id={`procedureTemplateType${procedureTemplates.id}`}
              data-tooltip-content={'Externo'}
            >
              <Icon
                alt="external"
                name="external"
                fill
                color="orange"
                stroke
                w={35}
                h={35}
              />
              <ReactTooltip
                anchorId={`procedureTemplateType${procedureTemplates.id}`}
              />
            </div>
          </div>
        );

      case 'internal_external':
        return (
          <div className="hidden sm:flex items-center justify-center px-6">
            <div
              id={`procedureTemplateType${procedureTemplates.id}`}
              data-tooltip-content={'Interno/Externo'}
            >
              <Icon
                alt="internal_external"
                name="internalExternal"
                fill
                color="orange"
                stroke
                w={35}
                h={35}
              />
              <ReactTooltip
                anchorId={`procedureTemplateType${procedureTemplates.id}`}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hidden sm:flex items-center justify-center space-x-2 px-4 w-fit sm:w-44 sm:h-20">
      <Source />
    </div>
  );
};

export default ProcedureTemplateSource;
