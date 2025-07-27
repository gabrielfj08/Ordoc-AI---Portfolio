import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const ProcedureTemplateFilter = () => {
  return (
    <ActionBox.Content className="w-full">
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Status do tipo de processo:
        </Typography>
        <div className="grid grid-cols-2 pt-2">
          <label htmlFor="active" className="flex items-center space-x-2">
            <Field type="radio" value="active" name="status" id="active" />
            <Typography variant="footnote1">Ativo</Typography>
          </label>
          <label htmlFor="inactive" className="flex items-center space-x-2">
            <Field type="radio" value="inactive" name="status" id="inactive" />
            <Typography variant="footnote1">Inativo</Typography>
          </label>
        </div>
      </div>
      <div className="space-y-2 pt-4">
        <Typography variant="footnote1" family="robotoMedium">
          Tipo de processo:
        </Typography>
        <div className="grid grid-cols-2 pt-2">
          <label htmlFor="internal" className="flex items-center space-x-2">
            <Field type="radio" name="source" value="internal" id="internal" />
            <Typography variant="footnote1">Interno</Typography>
          </label>
          <label htmlFor="external" className="flex items-center space-x-2">
            <Field type="radio" name="source" value="external" id="external" />
            <Typography variant="footnote1">Externo</Typography>
          </label>
        </div>
      </div>
    </ActionBox.Content>
  );
};

export default ProcedureTemplateFilter;
