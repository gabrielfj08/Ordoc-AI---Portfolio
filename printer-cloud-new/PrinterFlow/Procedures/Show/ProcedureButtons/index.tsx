import * as React from 'react';
import { ProcedureButtonsContainerProps } from './types';
import ProcedureButtons from './ProcedureButtons';

const ProcedureButtonsContainer = ({
  procedure,
}: ProcedureButtonsContainerProps) => {
  return <ProcedureButtons procedure={procedure} />;
};

export default ProcedureButtonsContainer;
