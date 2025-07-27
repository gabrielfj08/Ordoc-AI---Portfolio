import * as React from 'react';
import { Input, Typography } from 'printer-ui';
import { ShowTaskTemplateProps } from './types';
import Accordion from '../../../components/Accordion';
import TaskTemplateFields from './TaskTemplateFields';

const ShowTaskTemplate = ({ taskTemplate }: ShowTaskTemplateProps) => {
  return (
    <div className="w-full mb-12">
      <div className="w-full mt-4 sm:w-6/12 space-y-8 px-4">
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Nome do tipo de tarefa*:
          </Typography>
          <Input
            w="full"
            size="md"
            type="text"
            name="name"
            onChange={() => {}}
            value={taskTemplate.name}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Descrição*:
          </Typography>
          <Input
            w="full"
            size="md"
            type="text"
            name="description"
            onChange={() => {}}
            value={taskTemplate.description}
            disabled
          />
        </div>
        <div className="w-full">
          <Accordion
            defaultOpen={false}
            items={[
              {
                label: 'Campos do tipo de tarefa',
                content: <TaskTemplateFields taskTemplate={taskTemplate} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowTaskTemplate;
