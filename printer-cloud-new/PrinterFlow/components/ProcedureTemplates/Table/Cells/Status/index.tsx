import * as React from 'react';
import { ProcedureTemplateStatusContainerProps } from './types';
import ProcedureTemplateStatus from './Status';

const ProcedureTemplateStatusContainer = ({
  procedureTemplates,
}: ProcedureTemplateStatusContainerProps) => {
  return <ProcedureTemplateStatus procedureTemplates={procedureTemplates} />;
};

export default ProcedureTemplateStatusContainer;
