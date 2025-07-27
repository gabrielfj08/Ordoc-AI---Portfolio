import { BaseProcedureTemplate } from '../../../../services/printer-flow/types';

export interface DeactivateProcedureTemplateContainerModalProps {
  procedureTemplateId: number;
  procedureTemplateName: string;
  parentProcedureTemplateId: number;
}

export interface DeactivateProcedureTemplateModalProps {
  onSubmit: (
    values: DeactivateProcedureTemplateFormValues
  ) => Promise<BaseProcedureTemplate>;
  procedureTemplateName: string;
  parentProcedureTemplateId: number;
}

export interface DeactivateProcedureTemplateFormValues {
  note: string;
}
