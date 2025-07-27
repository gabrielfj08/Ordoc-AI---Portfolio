import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const TaskFilter = () => {
  return (
    <ActionBox.Content className="sm:w-80 w-60">
      <Typography variant="footnote1" family="robotoMedium">
        Prioridade da tarefa:
      </Typography>
      <div className="grid grid-cols-2 pt-3">
        <label htmlFor="high" className="flex items-center space-x-2">
          <Field type="radio" value="high" name="priority" id="high" />
          <Typography variant="footnote1">Alta</Typography>
        </label>
        <label htmlFor="normal" className="flex items-center space-x-2">
          <Field type="radio" value="normal" name="priority" id="normal" />
          <Typography variant="footnote1">Normal</Typography>
        </label>
      </div>
    </ActionBox.Content>
  );
};

export default TaskFilter;
