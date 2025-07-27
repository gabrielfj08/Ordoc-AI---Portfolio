import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import AttachmentList from '../Attachment/AttachmentList';
import TaskAttachmentList from '../../TaskAttachment/TaskAttachmentList';
import TaskAttachment from '../../TaskAttachment';
import AttachmentButton from './AttachmentButton';
import AttachmentUploadListContainer from '../Attachment/NewAttachment/AttachmentUploadList';

const TaskDocuments = ({
  task,
  setAttachmentModalVisibility,
  attachmentModalVisibility,
}) => {
  const [showMention, setShowMention] = React.useState<boolean>(false);

  const handleShowMention = () => {
    setShowMention((current) => !current);
  };
  const [files, setFiles] = React.useState<FileList | null>({} as FileList);

  return (
    <div className="space-y-4">
      {task.status === 'draft' ? (
        <>
          <Typography variant="footnote1" family="robotoMedium">
            Anexos:
          </Typography>
          <AttachmentButton
            setAttachmentModalVisibility={setAttachmentModalVisibility}
            setFiles={setFiles}
            task={task}
          />
          {attachmentModalVisibility && (
            <AttachmentUploadListContainer
              task={task}
              fileList={files as FileList}
            />
          )}
          <AttachmentList taskId={task.id} />
          <Typography variant="footnote1" family="robotoMedium">
            Menções:
          </Typography>
          <button
            className="flex items-center space-x-1"
            onClick={handleShowMention}
          >
            <Icon
              alt="addMention"
              name="mention"
              w={16}
              h={16}
              stroke
              color="info"
            />
            <Typography
              variant="footnote1"
              family="robotoMedium"
              color="info"
              className="underline"
            >
              Mencionar arquivo
            </Typography>
          </button>
          {!showMention ? null : (
            <div className="pt-2">
              <TaskAttachment
                task={task}
                setMentionVisibility={setShowMention}
                taskStatus={task.status}
              />
            </div>
          )}

          <TaskAttachmentList taskId={task.id} />
        </>
      ) : (
        <>
          <Typography variant="footnote1" family="robotoMedium">
            Anexos:
          </Typography>
          <AttachmentList taskId={task.id} />
          <Typography variant="footnote1" family="robotoMedium">
            Menções:
          </Typography>
          <TaskAttachmentList taskId={task.id} />
        </>
      )}
    </div>
  );
};

export default TaskDocuments;
