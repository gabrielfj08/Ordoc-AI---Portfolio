import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { useDrawer } from '../../../hooks';
import InactiveTaskTemplateDetailsContainer from './Inactive';
import { TaskTemplateDetailsProps } from './types';

const TaskTemplateDetails = ({ taskTemplate }: TaskTemplateDetailsProps) => {
  const { closeDrawer } = useDrawer();
  const boxClassName =
    'w-full h-24 bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Detalhes do tipo de tarefa
        </Typography>
      </div>

      <div className={boxClassName}>
        <Icon name="taskTemplateV3" alt="taskTemplateV3" w={25} h={25} />
        <div className="space-y-2 w-full">
          <Typography variant="footnote1" family="robotoMedium" align="center">
            Nome do tipo de tarefa:
          </Typography>
          <Typography variant="footnote1" align="center">
            {taskTemplate.name}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="proceduresV3" alt="procedures" stroke w={20} h={20} />
        <div className="space-y-2 w-full">
          <Typography variant="footnote1" family="robotoMedium" align="center">
            Quantidade de processos envolvidos:
          </Typography>
          <Typography variant="footnote1" align="center">
            {taskTemplate.procedureCount}
          </Typography>
        </div>
      </div>

      {taskTemplate.status === 'inactive' && (
        <InactiveTaskTemplateDetailsContainer justifiableId={taskTemplate.id} />
      )}
    </div>
  );
};

export default TaskTemplateDetails;
