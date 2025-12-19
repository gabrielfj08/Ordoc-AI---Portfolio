export interface ProcedureTemplateSelectContainerProps {
  name?: string;
  formik: any;
}

export interface ProcedureTemplateSelectProps {
  items: Array<SelectItem>;
  formik: any;
}

export interface SelectItem {
  value: number;
  label: string;
}
