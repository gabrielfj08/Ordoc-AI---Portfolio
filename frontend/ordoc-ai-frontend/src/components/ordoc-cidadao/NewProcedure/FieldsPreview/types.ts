export interface ExternalFieldsPreviewProps {
  fields?: Array<{
    fieldType: string;
    label: string;
    value: any;
    fieldValueOptions: Array<{
      value: string;
    }>;
  }>;
  formik: any;
}
