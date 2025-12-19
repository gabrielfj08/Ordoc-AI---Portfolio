'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureCheckboxProps } from './types';

const ProcedureCheckbox = ({ formik }: ProcedureCheckboxProps) => {
  return (
    <div className="flex items-center justify-center relative space-x-2 pt-6 border-t-2 border-blue-600">
      <label
        htmlFor="checkbox"
        className="cursor-pointer flex justify-center items-center space-x-2"
      >
        <Checkbox
          id="checkbox"
          name="checkbox"
          checked={formik.values.checkbox}
          onCheckedChange={(checked) => {
            formik.setFieldValue('checkbox', checked);
          }}
        />
        <span className="text-sm text-gray-600 text-center">
          Estou ciente que estou criando um processo e os campos não poderão ser
          editados posteriormente.
        </span>
      </label>
      {formik.errors.checkbox && (
        <p className="text-sm text-red-500 mt-1">
          * {typeof formik.errors.checkbox === 'string' ? formik.errors.checkbox : ''}
        </p>
      )}
    </div>
  );
};

export default ProcedureCheckbox;
