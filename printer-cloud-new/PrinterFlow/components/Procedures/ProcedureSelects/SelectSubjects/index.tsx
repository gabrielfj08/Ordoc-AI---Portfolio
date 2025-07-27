import * as React from 'react';
import { SelectSubjectsContainerProps } from './types';
import SelectSubjects from './SelectSubjects';

const SelectSubjectsContainer = ({
  name,
  subjects,
  parentProcedureTemplateId,
  key,
}: SelectSubjectsContainerProps) => {
  return (
    <SelectSubjects
      name={name}
      subjects={subjects}
      parentProcedureTemplateId={parentProcedureTemplateId}
      key={key}
    />
  );
};

export default SelectSubjectsContainer;
