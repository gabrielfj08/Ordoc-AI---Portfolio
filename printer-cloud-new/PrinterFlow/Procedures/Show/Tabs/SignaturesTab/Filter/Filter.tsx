import * as React from 'react';
import { Field } from 'formik';
import { ActionBox, Typography } from 'printer-ui';

const SignatureFilter = () => {
  return (
    <ActionBox.Content className="w-full">
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Status da assinatura:
        </Typography>
        <div className="pt-2">
          <label htmlFor="created" className="flex space-x-2 pb-2">
            <Field type="radio" value="created" name="status" id="created" />
            <Typography variant="footnote1">Pendente</Typography>
          </label>
          <label htmlFor="refused" className="flex space-x-2 pb-2">
            <Field type="radio" value="refused" name="status" id="refused" />
            <Typography variant="footnote1">Recusada</Typography>
          </label>
          <label htmlFor="signed" className="flex space-x-2">
            <Field type="radio" value="signed" name="status" id="signed" />
            <Typography variant="footnote1">Assinada</Typography>
          </label>
        </div>
      </div>
    </ActionBox.Content>
  );
};

export default SignatureFilter;
