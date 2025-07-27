import * as React from 'react';
import { CellsContainerProps } from '../../types';
import ProcedureCell from './Procedure';

const ProcedureCellContainer = ({ signature }: CellsContainerProps) => {
  return <ProcedureCell procedure={signature.procedure} />;
};

export default ProcedureCellContainer;
