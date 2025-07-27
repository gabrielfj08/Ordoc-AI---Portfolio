import * as React from 'react';
import { FieldDocumentTemplateSelectContainerProps } from './types';
import FieldDocumentTemplateSelect from './Select';

const FieldDocumentTemplateSelectContainer = ({
  name,
  fieldDocumentTemplate,
}: FieldDocumentTemplateSelectContainerProps) => {
  return (
    <FieldDocumentTemplateSelect
      name={name}
      fieldDocumentTemplate={fieldDocumentTemplate}
    />
  );
};

export default FieldDocumentTemplateSelectContainer;
