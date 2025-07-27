import { multipleSelectItem } from '../../../../types';

export interface ProcedureTemplateSelectContainerProps {
  name?: string;
  formik: any;
}

export interface ProcedureTemplateSelectProps {
  items: Array<multipleSelectItem>;
  formik: any;
}

export interface Item {
  value: string;
  label: string;
}
