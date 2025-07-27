import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskAttachmentService } from '../../../../services/printer-flow';
import { CreateTaskAttachmentPayload } from '../../../../services/printer-flow/types';
import {
  SelectTaskAttachmentContainerProps,
  SelectTaskAttachmentFormValues,
} from './types';
import SelectTaskAttachment from './SelectTaskAttachment';

const SelectTaskAttachmentContainer = ({
  taskId,
  taskStatus,
  procedureDocuments,
  taskDocuments,
  setMentionVisibility,
}: SelectTaskAttachmentContainerProps) => {
  const { token, subdomain } = useAuth();

  const mutation = useMutation((payload: CreateTaskAttachmentPayload) =>
    TaskAttachmentService.create(token, subdomain, { ...payload })
  );

  const handleSubmit = (values: SelectTaskAttachmentFormValues) => {
    return mutation.mutateAsync(values);
  };

  return (
    <SelectTaskAttachment
      setMentionVisibility={setMentionVisibility}
      onSubmit={handleSubmit}
      taskId={taskId}
      taskStatus={taskStatus}
      procedureDocuments={procedureDocuments}
      taskDocuments={taskDocuments}
    />
  );
};

export default SelectTaskAttachmentContainer;
