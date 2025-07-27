import * as React from 'react';
import { ProcedureTemplateContainerProps } from './types';
import ProcedureTemplate from './ProcedureTemplates';

const ProcedureTemplateContainer = ({
  procedureTemplates,
}: ProcedureTemplateContainerProps) => {
  return <ProcedureTemplate procedureTemplates={procedureTemplates} />;
};

export default ProcedureTemplateContainer;
