import * as React from 'react';
import { FilterButtonTaskContainerProps } from './types';
import FilterButtonTask from './FilterTask';

const FilterButtonTaskContainer = ({
  children,
  params,
  setParams,
}: FilterButtonTaskContainerProps) => {
  return (
    <FilterButtonTask params={params} setParams={setParams}>
      {children}
    </FilterButtonTask>
  );
};

export default FilterButtonTaskContainer;
