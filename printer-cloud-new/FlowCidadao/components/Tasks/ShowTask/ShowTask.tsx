import * as React from 'react';
import {
  ActionBoxV3 as ActionBox,
  ButtonV3 as Button,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useExternalSession, useModal, useSession } from '../../../../hooks';
import { ShowExternalTakModalProps } from './types';
import AttachmentExternalTaskList from '../Attachment/AttachmentList';
import RefuseExternalJustificationNote from '../RefusedJustification';
import TaskExternalCommentList from '../Comments/CommentList';
import AddAttachmentTaskModal from './Actions/AddAttachment';
import AddExternalCommentModal from './Actions/AddComment';
import ShowExternalButtonsModal from './Actions/Buttons';
import RefuseExternalTaskModal from './Actions/Refuse';
import ExternalTaskDescription from './Description';
import TaskAttachmentList from './TaskAttachment';
import ExternalTasksInfo from './InfoTask';
import TaskStatusTag from './StatusTag';

const ShowExternalTaskModal = ({
  task,
  justificationVisibility,
  attachmentVisibility,
  commentVisibility,
}: ShowExternalTakModalProps) => {
  const { externalSession } = useExternalSession();
  const { themeColor } = useSession();
  const { closeModal } = useModal();

  const [commentModalVisibility, setCommentModalVisibility] =
    React.useState<boolean>(commentVisibility ? commentVisibility : false);
  const [attachmentModalVisibility, setAttachmentModalVisibility] =
    React.useState<boolean>(
      attachmentVisibility ? attachmentVisibility : false
    );
  const [justificationModalVisibility, setJustificationModalVisibility] =
    React.useState<boolean>(
      justificationVisibility ? justificationVisibility : false
    );

  const externalUserIsGroupAssignee =
    externalSession?.user?.id === task.groupAssignee?.id;

  return (
    <div className="h-screen py-24">
      <ActionBox
        onClose={closeModal}
        className="sm:w-[900px] h-full sm:max-h-[850px] overflow-x-auto py-4"
      >
        <ActionBox.Header
          title="Visualizar tarefa"
          subtitle="Aqui você pode visualizar os detalhes de sua tarefa."
          color={themeColor}
          icon="tasksV3"
          stroke
        />
        <ActionBox.Content className="space-y-3">
          <div className="flex space-x-2 items-center justify-end">
            <Typography
              variant="headline5"
              family="jakartaBold"
              color="darkGray"
            >
              Status:
            </Typography>
            <TaskStatusTag status={task.status} />
          </div>
          <Typography variant="bodyLg" family="jakartaBold" color={themeColor}>
            Informações da tarefa
          </Typography>
          <ExternalTasksInfo task={task} />
          <ExternalTaskDescription task={task} />
          <TaskAttachmentList task={task} />
          <Typography
            variant="bodyLg"
            family="jakartaBold"
            className="pt-4"
            color={themeColor}
          >
            Campos para preenchimento do responsável
          </Typography>
          <div className="max-h-60 h-fit overflow-y-auto w-full space-y-4">
            <div
              className={`${attachmentModalVisibility ? 'hidden' : 'block'}`}
            >
              <AttachmentExternalTaskList task={task} />
            </div>
            {task.status === 'started' && externalUserIsGroupAssignee ? (
              <>
                {!attachmentModalVisibility ? (
                  <div className="sm:justify-end justify-center flex">
                    <Button
                      label="Anexo"
                      color={themeColor}
                      leftIcon="plus"
                      size="sm"
                      w="full"
                      style="outlined"
                      className="sm:w-60"
                      onClick={() => {
                        setAttachmentModalVisibility(true);
                      }}
                    />
                  </div>
                ) : (
                  <AddAttachmentTaskModal
                    onSubmit={() => {}}
                    task={task}
                    setAttachmentModalVisibility={setAttachmentModalVisibility}
                  />
                )}
              </>
            ) : null}
          </div>
          <div className={`max-h-72 h-fit space-y-4`}>
            <div
              className={`${
                commentModalVisibility ? 'hidden' : 'block'
              } max-h-60 h-fit overflow-y-auto w-full`}
            >
              <TaskExternalCommentList task={task} />
            </div>
            {task.status === 'started' ? (
              <>
                {!commentModalVisibility && externalUserIsGroupAssignee ? (
                  <div className=" sm:justify-end justify-center flex">
                    <Button
                      label="Comentário"
                      color={themeColor}
                      leftIcon="plus"
                      size="sm"
                      w="full"
                      style="outlined"
                      className="sm:w-60"
                      onClick={() => {
                        setCommentModalVisibility(true);
                      }}
                    />
                  </div>
                ) : (
                  <AddExternalCommentModal
                    task={task}
                    status={task.status}
                    setCommentModalVisibility={setCommentModalVisibility}
                    commentModalVisibility={commentModalVisibility}
                  />
                )}
              </>
            ) : null}
          </div>
          {task.status === 'refused' ? (
            <RefuseExternalJustificationNote justifiableId={task.id} />
          ) : null}
          <RefuseExternalTaskModal
            task={task}
            status={task.status}
            setJustificationModalVisibility={setJustificationModalVisibility}
            justificationModalVisibility={justificationModalVisibility}
          />
          {externalUserIsGroupAssignee ? (
            <div>
              <ShowExternalButtonsModal
                task={task}
                status={task.status}
                setJustificationModalVisibility={
                  setJustificationModalVisibility
                }
                justificationModalVisibility={justificationModalVisibility}
              />
            </div>
          ) : null}
        </ActionBox.Content>
      </ActionBox>
    </div>
  );
};

export default ShowExternalTaskModal;
