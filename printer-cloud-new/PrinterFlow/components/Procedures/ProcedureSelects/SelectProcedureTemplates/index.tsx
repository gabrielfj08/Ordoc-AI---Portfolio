import * as React from 'react';
import { SelectProcedureTemplatesContainerProps } from './types';
import SelectProcedureTemplates from './SelectProcedureTemplates';

const SelectProcedureTemplatesContainer = ({
  name,
  procedureTemplates,
  setKey,
}: SelectProcedureTemplatesContainerProps) => {
  return (
    <SelectProcedureTemplates
      name={name}
      procedureTemplates={procedureTemplates}
      setKey={setKey}
    />
  );
};

export default SelectProcedureTemplatesContainer;
