import * as React from 'react';
import { useModal } from '../../../../../hooks';
import { AddAttachmentsModalContainerProps } from './types';
import AddAttachmentsModal from './Modal';

const AddAttachmentsModalContainer = ({
  setFileList,
  setUploadVisibility,
}: AddAttachmentsModalContainerProps) => {
  const { closeModal } = useModal();
  const handleSubmit = (values) => {
    setUploadVisibility(true);
    setFileList(values.fileList);
    closeModal();
  };
  return <AddAttachmentsModal onSubmit={handleSubmit} />;
};

export default AddAttachmentsModalContainer;
