import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';
import FieldTypes from '../../../components/Procedures/FieldTypes';

const FieldsPreview = ({ fields }) => {
  return (
    <div className="space-y-6 pb-6 h-fit">
      <div className="flex items-center space-x-2">
        <Icon alt="info" name="info" stroke w={28} h={28} />
        <Typography variant="footnote1" family="robotoMedium">
          Ao clicar em “Continuar”, o formulário a ser preenchido será:
        </Typography>
      </div>
      <Typography family="robotoMedium" color="gray">
        Campos do Processo
      </Typography>

      <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 gap-8">
        {fields.map((field, index) => {
          return (
            <div key={field.label} className="space-y-2">
              <Typography
                family="robotoMedium"
                variant="footnote1"
                color="gray"
              >
                {field.label}:
              </Typography>
              <FieldTypes
                options={field.fieldValueOptions.map((option) => option.value)}
                type={field.fieldType}
                fieldName={field.label}
                procedure={{} as ShowProcedureAPIResponse}
                disabled
                label={field.label}
                value={''}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FieldsPreview;
