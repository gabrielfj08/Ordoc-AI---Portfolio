import * as React from 'react';
import NewAttachmentTask from '../../Attachment/NewAttachment';

const AddAttachmentModalAppendice = ({
  task,
  attachmentModalVisibility,
  setAttachmentModalVisibility,
}) => {
  return (
    <NewAttachmentTask
      task={task}
      attachmentModalVisibility={attachmentModalVisibility}
      setAttachmentModalVisibility={setAttachmentModalVisibility}
    />
  );
};

export default AddAttachmentModalAppendice;
