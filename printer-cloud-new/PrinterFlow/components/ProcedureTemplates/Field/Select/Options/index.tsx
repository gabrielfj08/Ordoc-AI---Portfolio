import * as React from 'react';
import { NewFieldTypeValuesOptionsContainerProps } from './types';
import SelectNewFieldValuesOptions from './Options';

const NewFieldTypeValuesOptionsContainer = ({
  open,
  fieldType,
}: NewFieldTypeValuesOptionsContainerProps) => {
  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-10`}
    >
      <SelectNewFieldValuesOptions fieldType={fieldType} />
    </div>
  );
};

export default NewFieldTypeValuesOptionsContainer;
