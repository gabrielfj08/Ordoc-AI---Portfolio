import React from 'react';
import {
  IndexProcedureTemplate,
  ShowProcedureTemplate,
} from '../../../../../services/printer-flow/types/procedureTemplate';

export interface SelectProcedureTemplatesContainerProps {
  name: string;
  procedureTemplates: IndexProcedureTemplate | ShowProcedureTemplate;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}

export interface SelectProcedureTemplatesProps {
  name: string;
  procedureTemplates: IndexProcedureTemplate | ShowProcedureTemplate;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}
