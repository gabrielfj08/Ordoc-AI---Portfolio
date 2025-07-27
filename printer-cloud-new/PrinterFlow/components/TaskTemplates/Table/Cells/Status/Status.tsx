import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { TaskTemplateStatusCellProps } from './types';

const TaskTemplateStatusCell = ({
  taskTemplate,
}: TaskTemplateStatusCellProps) => {
  const statusTooltipMapping: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
  };
  {
    return (
      <div className="hidden sm:flex items-center sm:justify-center sm:w-24">
        <div className="items-center justify-center">
          <div
            id={`status${taskTemplate.id}`}
            data-tooltip-content={statusTooltipMapping[taskTemplate.status]}
            className="hidden sm:flex items-center justify-center"
          >
            <>
              <Icon
                alt="taskTemplate"
                name="taskTemplateV3"
                w={25}
                h={25}
                stroke
                color={taskTemplate.status === 'active' ? 'success' : 'error'}
              />
              <ReactTooltip anchorId={`status${taskTemplate.id}`} />
            </>
          </div>
        </div>
      </div>
    );
  }
};

export default TaskTemplateStatusCell;
