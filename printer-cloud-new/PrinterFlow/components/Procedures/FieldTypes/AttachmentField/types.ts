import React from 'react';

export interface AddAttachmentsModalContainerProps {
  formik: any;
  name: string;
  setFileList: React.Dispatch<React.SetStateAction<FileList | undefined>>;
  setUploadVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddAttachmentModalProps {
  onSubmit: (values) => void;
}
