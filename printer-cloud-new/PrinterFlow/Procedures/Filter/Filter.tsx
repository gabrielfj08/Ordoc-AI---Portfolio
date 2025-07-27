import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const ProcedureFilter = () => {
  return (
    <ActionBox.Content className="w-full space-y-4">
      <div className="space-y-3">
        <Typography variant="footnote1" family="robotoMedium">
          Origem do processo:
        </Typography>
        <div className="grid grid-cols-2">
          <label htmlFor="internal" className="flex items-center space-x-2">
            <Field type="radio" value="internal" name="source" id="internal" />
            <Typography variant="footnote1">Interno</Typography>
          </label>
          <label htmlFor="external" className="flex items-center space-x-2">
            <Field type="radio" value="external" name="source" id="external" />
            <Typography variant="footnote1">Externo</Typography>
          </label>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <Typography variant="footnote1" family="robotoMedium">
          Prioridade do processo:
        </Typography>
        <div className="grid grid-cols-2">
          <label htmlFor="normal" className="flex items-center mr-2 space-x-2">
            <Field type="radio" name="priority" value="normal" id="normal" />
            <Typography variant="footnote1">Normal</Typography>
          </label>
          <label htmlFor="high" className="flex items-center space-x-2">
            <Field type="radio" name="priority" value="high" id="high" />
            <Typography variant="footnote1">Alta</Typography>
          </label>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <Typography variant="footnote1" family="robotoMedium">
          Visibilidade do processo:
        </Typography>
        <div className="grid grid-cols-2">
          <label htmlFor="true" className="flex items-center space-x-2">
            <Field type="radio" name="private" value="true" id="true" />
            <Typography variant="footnote1">Privado</Typography>
          </label>
          <label htmlFor="false" className="flex items-center space-x-2">
            <Field type="radio" name="private" value="false" id="false" />
            <Typography variant="footnote1">Público</Typography>
          </label>
        </div>
      </div>
    </ActionBox.Content>
  );
};

export default ProcedureFilter;
