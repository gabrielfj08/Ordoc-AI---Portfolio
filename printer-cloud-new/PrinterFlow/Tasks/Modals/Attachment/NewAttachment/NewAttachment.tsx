import * as React from 'react';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { NewAttachmentTaskListProps } from './types';
import AttachmentUploadList from './AttachmentUploadList';
import TaskAttachment from '../../../TaskAttachment';
import AttachmentButton from '../../Show/AttachmentButton';

const NewAttachmentList = ({
  task,
  setFiles,
  files,
  attachmentModalVisibility,
  setAttachmentModalVisibility,
}: NewAttachmentTaskListProps) => {
  const [showAttachments, setShowAttachments] = React.useState(false);
  const [showMention, setShowMention] = React.useState<boolean>(false);

  const handleShowMention = () => {
    setShowMention((current) => !current);
    setShowAttachments(false);
  };

  return (
    <div className={attachmentModalVisibility ? 'block' : 'hidden'}>
      <ActionBox className="sm:w-[569px]">
        <ActionBox.Content className="space-y-2">
          <div className="space-y-1">
            <Typography variant="footnote1" family="robotoMedium">
              Anexos:
            </Typography>
            <Typography
              variant="footnote2"
              family="roboto"
              color="gray"
              className="italic"
            >
              Agora você pode anexar arquivos e também mencionar um arquivo que
              já foi anexado anteriormente para evitar anexos duplicados.
            </Typography>
          </div>
          <AttachmentButton
            setAttachmentModalVisibility={setAttachmentModalVisibility}
            setFiles={setFiles}
            task={task}
          />
          {files && <AttachmentUploadList task={task} fileList={files} />}
          <div
            className={`items-center ${showAttachments ? 'hidden' : 'flex'}`}
          >
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
          </div>

          {!showMention ? null : (
            <div className="pt-2">
              <TaskAttachment
                task={task}
                setMentionVisibility={setShowMention}
                taskStatus={task.status}
              />
            </div>
          )}
          <div className="w-full flex justify-center pt-4">
            <Button
              type="button"
              color="error"
              label="Cancelar"
              onClick={() => {
                setAttachmentModalVisibility(false);
              }}
            />
          </div>
        </ActionBox.Content>
      </ActionBox>
    </div>
  );
};

export default NewAttachmentList;
