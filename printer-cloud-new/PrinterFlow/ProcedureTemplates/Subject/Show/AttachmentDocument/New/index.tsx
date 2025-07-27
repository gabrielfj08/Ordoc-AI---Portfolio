import * as React from 'react';
import { useActionSheet } from '../../../../../../hooks';
import {
  NewSubjectDocumentFormValues,
  NewSubjectDocumentContainerProps,
} from './types';
import SubjectUploadDocument from '../ActionSheet';
import NewSubjectDocumentModal from './New';

const NewSubjectDocumentContainer = ({
  procedureTemplateDocument,
  procedureTemplate,
}: NewSubjectDocumentContainerProps) => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: NewSubjectDocumentFormValues) => {
    if (values.fileList && procedureTemplate.name) {
      openActionSheet(
        <SubjectUploadDocument
          fileList={values.fileList}
          procedureTemplateDocument={procedureTemplateDocument}
          procedureTemplate={procedureTemplate}
        />
      );
    }
  };

  return <NewSubjectDocumentModal onSubmit={handleSubmit} />;
};

export default NewSubjectDocumentContainer;
