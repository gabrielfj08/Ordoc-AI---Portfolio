import { ShowExternalProcedureTemplateAPIResponse } from '../../../services/flow-cidadao/types';

export interface ProcedurePreviewContainerProps {
  formik: any;
  subjectId: number;
  procedureTemplateId: number;
}

export interface ProcedurePreviewProps {
  formik?: any;
  subject: ShowExternalProcedureTemplateAPIResponse;
  procedureTemplate: ShowExternalProcedureTemplateAPIResponse;
}
