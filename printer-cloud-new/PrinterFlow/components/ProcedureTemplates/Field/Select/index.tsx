import * as React from 'react';
import { NewFieldTypeValuesContainerProps } from './types';
import NewFieldValuesSelectOptions from './Select';

const NewFieldTypeValuesSelectContainer = ({
  name,
  fieldType,
}: NewFieldTypeValuesContainerProps) => {
  return <NewFieldValuesSelectOptions name={name} fieldType={fieldType} />;
};

export default NewFieldTypeValuesSelectContainer;
