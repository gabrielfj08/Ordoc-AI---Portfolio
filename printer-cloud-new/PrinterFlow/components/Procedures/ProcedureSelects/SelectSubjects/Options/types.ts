import { SetStateAction } from 'react';
import { IndexProcedureTemplate } from '../../../../../../services/printer-flow/types/procedureTemplate';

export interface SubjectSelectOptionsContainerProps {
  query: string;
  setError: React.Dispatch<SetStateAction<boolean>>;
  open: boolean;
  procedureTemplateId: number;
}

export interface SelectSubjectsOptionsProps {
  subjects: Array<IndexProcedureTemplate>;
  isError: boolean;
}
