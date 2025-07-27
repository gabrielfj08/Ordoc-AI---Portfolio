import * as React from 'react';
import { useActionSheet } from '../../../../../hooks';
import {
  UploadDirectoryFormValues,
  UploadDirectoryModalContainerProps,
} from './types';
import UploadDirectoryModal from './Upload';
import DirectoryUploadJobActionSheet from '../../ActionSheets/DirectoryUploadJob';

const UploadDirectoryModalContainer = ({
  parentDirectory,
}: UploadDirectoryModalContainerProps) => {
  const { openActionSheet } = useActionSheet();

  const handleSubmit = (values: UploadDirectoryFormValues) => {
    if (values.fileList) {
      openActionSheet(
        <DirectoryUploadJobActionSheet
          description={values.description}
          location={values.location}
          fileList={values.fileList}
          ocr={!values.skipOcr}
          parentDirectory={parentDirectory}
        />
      );
    }
  };

  return <UploadDirectoryModal onSubmit={handleSubmit} />;
};

export default UploadDirectoryModalContainer;
