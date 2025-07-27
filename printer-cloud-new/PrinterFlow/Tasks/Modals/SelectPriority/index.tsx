import * as React from 'react';
import { SelectPriorityContainerProps } from './types';
import SelectPriority from './SelectPriority';

const SelectPriorityContainer = ({ name }: SelectPriorityContainerProps) => {
  return <SelectPriority name={name} />;
};

export default SelectPriorityContainer;
