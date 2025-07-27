import * as React from 'react';
import { ProcedureTemplateSourceContainerProps } from './types';
import ProcedureTemplateSource from './Source';

const ProcedureTemplateSourceContainer = ({
  procedureTemplates,
}: ProcedureTemplateSourceContainerProps) => {
  return <ProcedureTemplateSource procedureTemplates={procedureTemplates} />;
};

export default ProcedureTemplateSourceContainer;
