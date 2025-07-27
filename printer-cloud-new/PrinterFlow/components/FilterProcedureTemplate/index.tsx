import * as React from 'react';
import { FilterButtonProcedureTemplateContainerProps } from './types';
import FilterButtonProcedureTemplate from './FilterProcedureTemplate';

const FilterButtonProcedureTemplateContainer = ({
  children,
  params,
  setParams,
}: FilterButtonProcedureTemplateContainerProps) => {
  return (
    <FilterButtonProcedureTemplate params={params} setParams={setParams}>
      {children}
    </FilterButtonProcedureTemplate>
  );
};

export default FilterButtonProcedureTemplateContainer;
