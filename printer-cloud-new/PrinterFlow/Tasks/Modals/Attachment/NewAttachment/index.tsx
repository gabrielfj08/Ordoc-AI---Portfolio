import * as React from 'react';
import { NewAttachmentTaskListContainerProps } from './types';
import NewAttachmentList from './NewAttachment';

const NewAttachmentListContainer = ({
  task,
  attachmentModalVisibility,
  setAttachmentModalVisibility,
}: NewAttachmentTaskListContainerProps) => {
  const [attachmentUploadListVisibility, setAttachmentUploadListVisibility] =
    React.useState<boolean>(false);
  const [files, setFiles] = React.useState<FileList | null>({} as FileList);

  return (
    <NewAttachmentList
      task={task}
      files={files as FileList}
      setFiles={setFiles}
      attachmentUploadListVisibility={attachmentUploadListVisibility}
      attachmentModalVisibility={attachmentModalVisibility}
      setAttachmentModalVisibility={setAttachmentModalVisibility}
    />
  );
};

export default NewAttachmentListContainer;
