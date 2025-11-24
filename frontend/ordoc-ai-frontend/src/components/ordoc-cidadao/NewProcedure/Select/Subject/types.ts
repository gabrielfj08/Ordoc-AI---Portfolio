export interface SubjectSelectContainerProps {
  name?: string;
  formik: any;
  parentProcedureTemplateId: number;
}

export interface SubjectSelectProps {
  items: Array<SelectItem>;
  formik: any;
}

export interface SelectItem {
  value: number;
  label: string;
}
