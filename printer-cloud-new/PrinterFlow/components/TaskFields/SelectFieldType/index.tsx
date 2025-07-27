import * as React from 'react';
import { SelectFieldTypeContainerProps } from './types';
import SelectFieldType from './Select';

const SelectFieldTypeContainer = ({
  name,
  fieldType,
}: SelectFieldTypeContainerProps) => {
  return <SelectFieldType name={name} fieldType={fieldType} />;
};

export default SelectFieldTypeContainer;
