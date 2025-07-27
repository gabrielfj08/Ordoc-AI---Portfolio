import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const TaskFilter = () => {
  return (
    <ActionBox.Content className="w-full">
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Status da tarefa:
        </Typography>
        <div className="grid grid-cols-2 pt-2">
          <label htmlFor="draft" className="flex items-center space-x-2 pb-2">
            <Field type="radio" value="draft" name="status" id="draft" />
            <Typography variant="footnote1">Rascunho</Typography>
          </label>
          <label htmlFor="started" className="flex items-center space-x-2 pb-2">
            <Field type="radio" value="started" name="status" id="started" />
            <Typography variant="footnote1">Tramitando</Typography>
          </label>
          <label
            htmlFor="running"
            className="flex items-center space-x-2 pb-2 pr-5 sm:pr-16"
          >
            <Field type="radio" value="running" name="status" id="running" />
            <Typography variant="footnote1">Aguardando</Typography>
          </label>
          <label
            htmlFor="finished"
            className="flex items-center space-x-2 pb-2"
          >
            <Field type="radio" value="finished" name="status" id="finished" />
            <Typography variant="footnote1">Finalizada</Typography>
          </label>
          <label htmlFor="refused" className="flex items-center space-x-2">
            <Field type="radio" value="refused" name="status" id="refused" />
            <Typography variant="footnote1">Recusada</Typography>
          </label>
        </div>
      </div>
      <div className="space-y-2 pt-4">
        <Typography variant="footnote1" family="robotoMedium">
          Prioridade da tarefa:
        </Typography>
        <div className="grid grid-cols-2 pt-2">
          <label
            htmlFor="normal"
            className="flex items-center mr-3 sm:mr-5 space-x-2"
          >
            <Field type="radio" name="priority" value="normal" id="normal" />
            <Typography variant="footnote1">Normal</Typography>
          </label>
          <label htmlFor="high" className="flex items-center space-x-2">
            <Field type="radio" name="priority" value="high" id="high" />
            <Typography variant="footnote1">Alta</Typography>
          </label>
        </div>
      </div>
    </ActionBox.Content>
  );
};

export default TaskFilter;
