import { SetStateAction } from 'react';
import { IndexProcedureTemplate } from '../../../../../../services/printer-flow/types/procedureTemplate';

export interface ProcedureTemplateSelectOptionsContainerProps {
  setError: React.Dispatch<SetStateAction<boolean>>;
  query: string;
  open: boolean;
}

export interface SelectProcedureTemplateOptionsProps {
  procedureTemplates: Array<IndexProcedureTemplate>;
  isError: boolean;
}
