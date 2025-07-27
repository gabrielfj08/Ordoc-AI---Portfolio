import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';
import { CreateExternalProcedureAPIResponse } from '../../../services/flow-cidadao/types';
import { ExternalFieldsPreviewProps } from './types';
import ExternalFieldTypes from '../../components/Procedures/FieldTypes/Upload';

const ExternalFieldsPreview = ({
  fields,
  formik,
}: ExternalFieldsPreviewProps) => {
  const { session, themeColor } = useSession();

  if (!session) return null;

  return (
    <div className="w-full h-fit my-4">
      <Typography variant="bodyLg" family="jakartaBold" color={themeColor}>
        Prévia dos campos obrigatórios a serem preenchidos:
      </Typography>
      <div className="py-4">
        <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-1 gap-8">
          {fields.map((field, index) => {
            return (
              <ExternalFieldTypes
                setDisableSubmitButton={() => {}}
                key={index}
                disabled
                color={themeColor}
                formik={formik}
                type={field.fieldType}
                fieldName={field.label}
                label={field.label}
                value={field.value}
                procedure={{} as CreateExternalProcedureAPIResponse}
                options={field.fieldValueOptions.map((option) => option.value)}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExternalFieldsPreview;
