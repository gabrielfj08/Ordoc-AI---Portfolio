import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const TaskTemplateFilter = () => {
  return (
    <ActionBox.Content className="sm:w-80 w-60">
      <Typography variant="footnote1" family="robotoMedium">
        Status do tipo de tarefa:
      </Typography>
      <div className="grid grid-cols-2 pt-3">
        <label htmlFor="active" className="flex items-center space-x-2">
          <Field type="radio" value="active" name="status" id="active" />
          <Typography variant="footnote1">Ativo</Typography>
        </label>
        <label htmlFor="inactive" className="flex items-center space-x-2">
          <Field type="radio" value="inactive" name="status" id="inactive" />
          <Typography variant="footnote1">Inativo</Typography>
        </label>
      </div>
    </ActionBox.Content>
  );
};

export default TaskTemplateFilter;
