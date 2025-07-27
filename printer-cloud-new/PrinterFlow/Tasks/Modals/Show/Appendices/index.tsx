import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import {
  TaskCommentService,
  TaskService,
} from '../../../../../services/printer-flow';
import {
  RefuseTaskPayload,
  SetAssigneePayload,
  RefuseTaskAPIResponse,
  SetAssigneeTaskAPIResponse,
  CreateTaskCommentAPIResponse,
  CreateTaskCommentPayload,
} from '../../../../../services/printer-flow/types';
import {
  RefuseTaskFormValues,
  AddCommentaskFormValues,
  SetAssigneeTaskFormValues,
  ShowTaskModalAppendicesContainerProps,
} from './types';
import RefuseTaskModalAppendice from './RefuseTask';
import AddCommentModalAppendice from './AddComment';
import AddAttachmentModalAppendice from './AddAttachment';
import SetAssigneeTaskModalAppendice from './SetAssigneeTask';

const ShowTaskModalAppendicesContainer = ({
  procedure,
  task,
  status,
  justificationModalVisibility,
  setJustificationModalVisibility,
  commentModalVisibility,
  setCommentModalVisibility,
  setAttachmentModalVisibility,
  attachmentModalVisibility,
}: ShowTaskModalAppendicesContainerProps) => {
  const { subdomain, token } = useAuth();

  switch (status) {
    case 'draft':
      const draftMutation = useMutation(
        (payload: SetAssigneePayload) =>
          TaskService.setAssignee(token, subdomain, task.id, payload),
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries(['tasks', subdomain, token]);
          },
        }
      );

      const draftHandleSubmit = (
        values: SetAssigneeTaskFormValues
      ): Promise<SetAssigneeTaskAPIResponse> => {
        return draftMutation.mutateAsync({ ...values });
      };

      return (
        <SetAssigneeTaskModalAppendice
          procedure={procedure}
          task={task}
          onSubmit={draftHandleSubmit}
        />
      );

    case 'running':
      const mutation = useMutation(
        (payload: RefuseTaskPayload) =>
          TaskService.refuse(token, subdomain, task.id, payload),
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries(['tasks', subdomain, token, {}]);
            queryClient.invalidateQueries([
              'tasksRunning',
              subdomain,
              token,
              {},
            ]);
            queryClient.invalidateQueries([
              'tasksFinished',
              subdomain,
              token,
              {},
            ]);
          },
        }
      );

      const handleSubmit = (
        values: RefuseTaskFormValues
      ): Promise<RefuseTaskAPIResponse> => {
        return mutation.mutateAsync({ ...values });
      };

      return (
        <RefuseTaskModalAppendice
          justificationModalVisibility={justificationModalVisibility}
          setJustificationModalVisibility={setJustificationModalVisibility}
          onSubmit={handleSubmit}
        />
      );

    case 'started':
      const commentMutation = useMutation(
        (payload: CreateTaskCommentPayload) =>
          TaskCommentService.create(token, subdomain, task.id, payload),
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            queryClient.invalidateQueries([
              'taskComments',
              token,
              subdomain,
              task.id,
            ]);
          },
        }
      );

      const commentHandleSubmit = (
        values: AddCommentaskFormValues
      ): Promise<CreateTaskCommentAPIResponse> => {
        return commentMutation.mutateAsync({ ...values });
      };

      return (
        <>
          <AddCommentModalAppendice
            onSubmit={commentHandleSubmit}
            setCommentModalVisibility={setCommentModalVisibility}
            commentModalVisibility={commentModalVisibility}
          />
          <AddAttachmentModalAppendice
            task={task}
            setAttachmentModalVisibility={setAttachmentModalVisibility}
            attachmentModalVisibility={attachmentModalVisibility}
          />
        </>
      );

    case 'refused':
      return null;

    case 'finished':
      return null;

    default:
      return null;
  }
};

export default ShowTaskModalAppendicesContainer;
