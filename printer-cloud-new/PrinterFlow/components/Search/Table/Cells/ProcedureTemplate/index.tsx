import * as React from 'react';
import { ProcedureTemplateCellContainerProps } from './types';
import ProcedureTemplateCell from './ProcedureTemplate';

const ProcedureTemplateCellContainer = ({
  procedure,
}: ProcedureTemplateCellContainerProps) => {
  return <ProcedureTemplateCell procedure={procedure} />;
};

export default ProcedureTemplateCellContainer;
