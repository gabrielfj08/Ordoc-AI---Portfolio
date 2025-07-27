import * as React from 'react';
import { Field } from 'formik';
import { PolicyEffectsRadioGroupProps } from './types';

const PolicyEffectsRadioGroup = ({
  disabled,
}: PolicyEffectsRadioGroupProps) => {
  return (
    <div className="grid grid-cols-2 grid-flow-row gap-4 items-center">
      <label>
        <div className="flex items-center justify-center gap-2 h-10 w-full shadow-md rounded-lg">
          <Field type="radio" name="effect" value="allow" disabled={disabled} />
          Permitir
        </div>
      </label>
      <label>
        <div className="flex items-center justify-center gap-2 h-10 w-full shadow-md rounded-lg">
          <Field type="radio" name="effect" value="deny" disabled={disabled} />
          Negar
        </div>
      </label>
    </div>
  );
};

export default PolicyEffectsRadioGroup;
