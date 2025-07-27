import * as React from 'react';
import { Field, FormikContextType, useFormikContext } from 'formik';
import { NewPolicyFormValues } from '../../Policies/New/types';
import { AppsRadioGroupProps } from './types';

const AppsRadioGroup = ({ apps, disabled }: AppsRadioGroupProps) => {
  const { setFieldValue }: FormikContextType<NewPolicyFormValues> =
    useFormikContext();

  return (
    <div className="grid grid-cols-2 grid-flow-row gap-4 items-center">
      {apps
        .filter(
          (filterApps) =>
            filterApps.service !== 'printer_optical' &&
            filterApps.service !== 'printer_reports'
        )
        .map((app) => (
          <label key={app.id}>
            <div className="flex items-center justify-center gap-2 h-10 w-full shadow-md rounded-lg">
              <Field
                type="radio"
                name="service"
                value={app.service}
                disabled={disabled}
                onChange={(e) => {
                  setFieldValue('service', e.target.value);
                  setFieldValue('resource', []);
                }}
              />
              {app.name}
            </div>
          </label>
        ))}
    </div>
  );
};

export default AppsRadioGroup;
