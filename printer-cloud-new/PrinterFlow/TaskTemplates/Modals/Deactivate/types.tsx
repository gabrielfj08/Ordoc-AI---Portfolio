import { BaseTaskTemplate } from '../../../../services/printer-flow/types';

export interface DeactiveTaskTemplateModalContainerProps {
  taskTemplateId: number;
  taskTemplateName: string;
}

export interface DeactiveTaskTemplateModalProps {
  onSubmit: (
    values: DeactivateTaskTemplateFormValues
  ) => Promise<BaseTaskTemplate>;
  taskTemplateName: string;
}

export interface DeactivateTaskTemplateFormValues {
  note: string;
}
