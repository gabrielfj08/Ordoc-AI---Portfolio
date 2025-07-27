import * as React from 'react';
import { AttachmentButtonContainerProps } from './types';
import AttachmentButton from './AttachmentButton';

const AttachmentButtonContainer = ({
  setAttachmentModalVisibility,
  setFiles,
  task,
}: AttachmentButtonContainerProps) => {
  return (
    <AttachmentButton
      setAttachmentModalVisibility={setAttachmentModalVisibility}
      setFiles={setFiles}
      task={task}
    />
  );
};

export default AttachmentButtonContainer;
