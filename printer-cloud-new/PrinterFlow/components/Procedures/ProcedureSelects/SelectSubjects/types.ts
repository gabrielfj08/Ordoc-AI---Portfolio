import { IndexProcedureTemplate } from '../../../../../services/printer-flow/types/procedureTemplate';

export interface SelectSubjectsContainerProps {
  name: string;
  subjects: IndexProcedureTemplate;
  parentProcedureTemplateId: number;
  key: number;
}

export interface SelectSubjectProps {
  name: string;
  subjects: IndexProcedureTemplate;
  parentProcedureTemplateId: number;
  key: number;
}
