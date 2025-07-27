import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import {
  ProcedureDocumentService,
  TaskDocumentService,
} from '../../../services/printer-flow';
import { TaskAttachmentContainerProps } from './types';
import TaskAttachment from './TaskAttachment';
import TaskAttachmentSkeleton from './Skeleton';
import TaskAttachmentError from './Error';

const TaskAttachmentContainer = ({
  taskStatus,
  setMentionVisibility,
  task,
}: TaskAttachmentContainerProps) => {
  const { token, subdomain } = useAuth();

  const {
    isError: taskDocumentsIsError,
    isLoading: taskDocumentsIsLoading,
    data: taskDocumentsData,
  } = useQuery({
    queryKey: [
      'taskDocumentsTaskAttachment',
      token,
      subdomain,
      { procedureId: task.procedureId },
    ],
    queryFn: () =>
      TaskDocumentService.index(token, subdomain, {
        order: 'name',
        perPage: 1000,
        procedureId: task.procedureId,
      }),
  });

  const {
    isError: procedureDocumentsIsError,
    isLoading: procedureDocumentsIsLoading,
    data: procedureDocumentsData,
  } = useQuery({
    queryKey: [
      'procedureDocumentsTaskAttachment',
      token,
      subdomain,
      { procedureId: task.procedureId },
    ],
    queryFn: () =>
      ProcedureDocumentService.index(token, subdomain, task.procedureId, {}),
  });

  if (taskDocumentsIsLoading || procedureDocumentsIsLoading)
    return <TaskAttachmentSkeleton />;

  if (taskDocumentsIsError || procedureDocumentsIsError)
    return <TaskAttachmentError />;

  const mapAttachments = (filesArray) =>
    filesArray.map((item: any) => {
      return { label: item.name, value: item.id };
    });

  return (
    <TaskAttachment
      setMentionVisibility={setMentionVisibility}
      taskId={task.id}
      taskStatus={taskStatus}
      taskDocuments={mapAttachments(taskDocumentsData.taskDocuments)}
      procedureDocuments={mapAttachments(
        procedureDocumentsData.procedureDocuments
      )}
    />
  );
};

export default TaskAttachmentContainer;
