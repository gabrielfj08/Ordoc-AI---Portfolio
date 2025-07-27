import * as React from 'react';
import { FilterButtonProcedureContainerProps } from './types';
import FilterButtonProcedure from './FilterProcedure';

const FilterButtonProcedureContainer = ({
  children,
  params,
  setParams,
}: FilterButtonProcedureContainerProps) => {
  return (
    <FilterButtonProcedure params={params} setParams={setParams}>
      {children}
    </FilterButtonProcedure>
  );
};

export default FilterButtonProcedureContainer;
