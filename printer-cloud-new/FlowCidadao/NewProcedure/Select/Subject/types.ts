import { multipleSelectItem } from '../../../../types';

export interface SubjectSelectContainerProps {
  name?: string;
  formik: any;
  parentProcedureTemplateId: number;
}

export interface SubjectSelectProps {
  items: Array<multipleSelectItem>;
  formik: any;
}

export interface Item {
  value: string;
  label: string;
}
