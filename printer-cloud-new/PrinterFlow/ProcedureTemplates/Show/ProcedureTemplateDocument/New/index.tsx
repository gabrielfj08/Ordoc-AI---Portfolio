import * as React from 'react';
import { useActionSheet } from '../../../../../hooks';
import {
  NewProcedureTemplateDocumentFormValues,
  NewProcedureTemplateDocumentModalContainerProps,
} from './types';
import ProcedureTemplateActionSheetContainer from '../ActionSheet';
import NewProcedureTemplateDocumentModal from './New';

const NewProcedureTemplateDocumentModalContainer = ({
  procedureTemplateDocument,
  procedureTemplate,
}: NewProcedureTemplateDocumentModalContainerProps) => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: NewProcedureTemplateDocumentFormValues) => {
    if (values.fileList && procedureTemplate.name) {
      openActionSheet(
        <ProcedureTemplateActionSheetContainer
          fileList={values.fileList}
          procedureTemplateDocument={procedureTemplateDocument}
          procedureTemplate={procedureTemplate}
        />
      );
    }
  };

  return <NewProcedureTemplateDocumentModal onSubmit={handleSubmit} />;
};

export default NewProcedureTemplateDocumentModalContainer;
