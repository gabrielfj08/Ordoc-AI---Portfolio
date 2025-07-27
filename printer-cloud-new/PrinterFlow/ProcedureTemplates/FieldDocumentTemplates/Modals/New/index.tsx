import * as React from 'react';
import { useActionSheet } from '../../../../../hooks';
import { NewFieldDocumentTemplateFormValues } from './types';
import NewFieldDocumentTemplateActionSheet from './ActionSheet';
import NewFieldDocumentTemplateModal from './New';

const NewieldDocumentTemplateContainerModal = () => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: NewFieldDocumentTemplateFormValues) => {
    if (values.fileList && values.name) {
      openActionSheet(
        <NewFieldDocumentTemplateActionSheet
          fileList={values.fileList}
          name={values.name}
        />
      );
    }
  };

  return <NewFieldDocumentTemplateModal onSubmit={handleSubmit} />;
};

export default NewieldDocumentTemplateContainerModal;
