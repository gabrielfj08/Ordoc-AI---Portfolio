import * as React from 'react';
import { FilterButtonTaskTemplatesContainerProps } from './types';
import FilterButtonTaskTemplates from './FilterTaskTemplates';

const FilterButtonTaskTemplatesContainer = ({
  children,
  params,
  setParams,
}: FilterButtonTaskTemplatesContainerProps) => {
  return (
    <FilterButtonTaskTemplates params={params} setParams={setParams}>
      {children}
    </FilterButtonTaskTemplates>
  );
};

export default FilterButtonTaskTemplatesContainer;
