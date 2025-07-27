import * as React from 'react';
import { Typography } from 'printer-ui';
import { FieldValueOptionsProps } from './types';
import ValueOption from './ValueOption';
import NewValueOption from './NewValueOption';

const FieldValueOptions = ({
  type,
  setType,
  fieldId,
  fieldValueOptions,
  total,
}: FieldValueOptionsProps) => {
  return (
    <div className="w-full space-y-2">
      <div>
        <Typography variant="footnote1" family="robotoMedium">
          Opções do campo:
        </Typography>
      </div>
      <div className="space-y-0.5">
        {fieldValueOptions.map((fieldValueOption) => (
          <ValueOption
            key={fieldValueOption.id}
            type={type}
            setType={setType}
            fieldValueOption={fieldValueOption}
            total={total}
          />
        ))}
      </div>
      {type == 'openFieldValueOption' ? (
        <NewValueOption fieldId={fieldId} />
      ) : null}
    </div>
  );
};

export default FieldValueOptions;
