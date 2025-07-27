import * as React from 'react';
import SelectPriority from './SelectPriority';
import { SelectPriorityContainerProps } from './types';

const SelectPriorityContainer = ({ name }: SelectPriorityContainerProps) => {
  return <SelectPriority name={name} />;
};

export default SelectPriorityContainer;
