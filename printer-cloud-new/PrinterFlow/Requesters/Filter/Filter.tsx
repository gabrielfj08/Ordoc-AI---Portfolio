import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const RequesterFilter = () => {
  return (
    <ActionBox.Content className="w-full">
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Status do solicitante:
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
          Tipo de solicitante:
        </Typography>
        <div className="grid grid-cols-2 pt-2">
          <label htmlFor="internal" className="flex items-center space-x-2 ">
            <Field
              type="radio"
              value="InternalRequester"
              name="type"
              id="internal"
            />
            <Typography variant="footnote1">Interno</Typography>
          </label>
          <label htmlFor="external" className="flex items-center space-x-2">
            <Field
              type="radio"
              value="ExternalRequester"
              name="type"
              id="external"
            />
            <Typography variant="footnote1">Externo</Typography>
          </label>
        </div>
      </div>
    </ActionBox.Content>
  );
};

export default RequesterFilter;
