import * as React from 'react';
import { SelectGroupRequesterContainerProps } from './types';
import SelectGroupRequester from './SelectGroupRequester';

const SelectGroupRequesterContainer = ({
  name,
  initialValue,
}: SelectGroupRequesterContainerProps) => {
  return <SelectGroupRequester name={name} initialValue={initialValue} />;
};

export default SelectGroupRequesterContainer;
