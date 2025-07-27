import * as React from 'react';
import { ActionBox, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { ShowTaskModalProps } from './types';
import TaskCommentList from '../../TaskComments/CommentList';
import ShowTaskModalAppendices from './Appendices';
import ModalShowButtons from './Footer';
import TaskInfo from './TaskInfo';
import TaskDocuments from './TaskDocuments';

const ShowTaskModal = ({
  task,
  justificationVisibility,
  resetAssigneeVisibility,
  procedure,
}: ShowTaskModalProps) => {
  const { closeModal } = useModal();
  const [justificationModalVisibility, setJustificationModalVisibility] =
    React.useState<boolean>(
      justificationVisibility ? justificationVisibility : false
    );
  const [commentModalVisibility, setCommentModalVisibility] =
    React.useState<boolean>(false);
  const [attachmentModalVisibility, setAttachmentModalVisibility] =
    React.useState<boolean>(false);
  const [resetGroupAssignee, setResetGroupAssignee] = React.useState<boolean>(
    resetAssigneeVisibility ? resetAssigneeVisibility : false
  );

  return (
    <div className="sm:w-[569px]">
      <ActionBox>
        <ActionBox.Header
          title="Visualizar tarefa"
          color="blue"
          icon="tasksV3"
          stroke
          onClose={closeModal}
        />
        <div className="overflow-y-auto sm:w-[569px] max-h-[480px]">
          <ActionBox.Content>
            <div className="space-y-4">
              <TaskInfo
                task={task}
                resetGroupAssignee={resetGroupAssignee}
                setResetGroupAssignee={setResetGroupAssignee}
              />
              <TaskDocuments
                task={task}
                setAttachmentModalVisibility={setAttachmentModalVisibility}
                attachmentModalVisibility={attachmentModalVisibility}
              />
              {task.status === 'finished' || task.status === 'started' ? (
                <div className="space-y-3 pb-3">
                  <div>
                    <Typography
                      variant="footnote1"
                      family="robotoMedium"
                      className="py-1"
                    >
                      Comentários:
                    </Typography>
                  </div>
                  <TaskCommentList taskId={task.id} />
                </div>
              ) : null}
            </div>
          </ActionBox.Content>
        </div>

        <ModalShowButtons
          task={task}
          setJustificationModalVisibility={setJustificationModalVisibility}
          setAttachmentModalVisibility={setAttachmentModalVisibility}
          setCommentModalVisibility={setCommentModalVisibility}
          justificationModalVisibility={justificationModalVisibility}
          attachmentModalVisibility={attachmentModalVisibility}
          commentModalVisibility={commentModalVisibility}
        />
      </ActionBox>
      <div className="mt-5 w-full">
        <ShowTaskModalAppendices
          procedure={procedure}
          task={task}
          status={task.status}
          setJustificationModalVisibility={setJustificationModalVisibility}
          setAttachmentModalVisibility={setAttachmentModalVisibility}
          setCommentModalVisibility={setCommentModalVisibility}
          justificationModalVisibility={justificationModalVisibility}
          attachmentModalVisibility={attachmentModalVisibility}
          commentModalVisibility={commentModalVisibility}
        />
      </div>
    </div>
  );
};

export default ShowTaskModal;
