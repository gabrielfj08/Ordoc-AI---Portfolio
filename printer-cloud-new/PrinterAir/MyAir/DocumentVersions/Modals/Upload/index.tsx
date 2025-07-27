import * as React from 'react';
import { useActionSheet } from '../../../../../hooks';
import {
  UploadDocumentVersionsModalContainerProps,
  UploadDocumentVersionsModalFormValues,
} from './types';
import DocumentVersionUploadJobActionSheet from '../../ActionSheets/DocumentVersionUploadJob';
import UploadDocumentVersionsModal from './Upload';

const UploadDocumentVersionsModalContainer = ({
  document,
}: UploadDocumentVersionsModalContainerProps) => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: UploadDocumentVersionsModalFormValues) => {
    openActionSheet(
      <DocumentVersionUploadJobActionSheet
        document={document}
        description={values.description}
        location={values.location}
        file={values.file as File}
      />
    );
  };

  return (
    <UploadDocumentVersionsModal onSubmit={handleSubmit} document={document} />
  );
};

export default UploadDocumentVersionsModalContainer;
