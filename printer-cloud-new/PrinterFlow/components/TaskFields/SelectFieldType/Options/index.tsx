import * as React from 'react';
import { SelectFieldTypeOptionsContainerProps } from './types';
import SelectFieldTypeOptions from './Options';

const SelectFieldTypeOptionsContainer = ({
  open,
  fieldType,
}: SelectFieldTypeOptionsContainerProps) => {
  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-10`}
    >
      <SelectFieldTypeOptions fieldType={fieldType} />
    </div>
  );
};

export default SelectFieldTypeOptionsContainer;
