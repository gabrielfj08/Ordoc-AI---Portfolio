import * as React from 'react';
import { useActionSheet } from '../../../../../hooks';
import {
  UploadDocumentsModalContainerProps,
  UploadDocumentsFormValues,
} from './types';
import DocumentUploadJobsActionSheet from '../../ActionSheets/DocumentUploadJobs';
import UploadDocumentsModal from './Upload';

const UploadDocumentsModalContainer = ({
  parentDirectory,
}: UploadDocumentsModalContainerProps) => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: UploadDocumentsFormValues) => {
    openActionSheet(
      <DocumentUploadJobsActionSheet
        description={values.description}
        location={values.location}
        fileList={values.fileList}
        ocr={!values.skipOcr}
        parentDirectory={parentDirectory}
      />
    );
  };

  return <UploadDocumentsModal onSubmit={handleSubmit} />;
};

export default UploadDocumentsModalContainer;
