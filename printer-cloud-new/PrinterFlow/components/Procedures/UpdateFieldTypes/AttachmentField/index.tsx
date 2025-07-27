import * as React from 'react';
import { useModal } from '../../../../../hooks';
import { AddAttachmentsModalContainerProps } from './types';
import AddAttachmentsModal from './Modal';

const AddAttachmentsModalContainer = ({
  setFileList,
}: AddAttachmentsModalContainerProps) => {
  const { closeModal } = useModal();
  const handleSubmit = (values) => {
    setFileList(values.fileList);
    closeModal();
  };

  return <AddAttachmentsModal onSubmit={handleSubmit} />;
};

export default AddAttachmentsModalContainer;
