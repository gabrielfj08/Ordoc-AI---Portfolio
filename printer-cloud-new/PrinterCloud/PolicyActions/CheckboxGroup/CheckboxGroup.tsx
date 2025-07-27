import * as React from 'react';
import { Field } from 'formik';
import { PolicyActionsCheckboxGroupProps } from './types';

const PolicyActionsCheckboxGroup = ({
  disabled,
  policyActions,
}: PolicyActionsCheckboxGroupProps) => {
  return (
    <div className="grid grid-cols-1 grid-flow-row gap-4 items-center">
      {policyActions.map((policyAction) => (
        <label key={policyAction.id}>
          <div className="flex items-center justify-center gap-2 h-10 w-full shadow-md rounded-lg">
            <Field
              type="checkbox"
              name="actionIds"
              value={`${policyAction.id}`}
              disabled={disabled}
            />
            {policyAction.label}
          </div>
        </label>
      ))}
    </div>
  );
};

export default PolicyActionsCheckboxGroup;
