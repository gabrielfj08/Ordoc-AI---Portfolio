'use client';

import * as React from 'react';
import { PrnFieldArrayContainerProps } from './types';
import PrnFieldArray from './FieldArray';

const PrnFieldArrayContainer = ({
  disabled = false,
  values = [''],
  onChange,
  service = '',
  organizationCnpj = '',
  error,
}: PrnFieldArrayContainerProps) => {
  return (
    <PrnFieldArray
      disabled={disabled}
      values={values}
      onChange={onChange}
      service={service}
      organizationCnpj={organizationCnpj}
      error={error}
    />
  );
};

export default PrnFieldArrayContainer;
