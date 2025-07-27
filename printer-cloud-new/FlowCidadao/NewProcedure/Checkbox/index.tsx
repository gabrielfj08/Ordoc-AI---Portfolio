import * as React from 'react';
import { ProcedureCheckboxContainerProps } from './types';
import ProcedureCheckbox from './Checkbox';

const ProcedureCheckboxContainer = ({
  formik,
}: ProcedureCheckboxContainerProps) => {
  return <ProcedureCheckbox formik={formik} />;
};

export default ProcedureCheckboxContainer;
