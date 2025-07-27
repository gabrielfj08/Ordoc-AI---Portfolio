import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useSnackbar } from '../../../../../../../hooks';
import { TaskDocumentService } from '../../../../../../../services/printer-flow';
import { queryClient } from '../../../../../../../queryClient';
import { removeFileExtension } from '../../../../../../../utils';
import { NewTaskAttachmentItemProps } from './types';
import UploadDocumentStatusIcon from '../../../../../../components/ProcedureTemplates/StatusIcon';

const NewTaskAttachmentItem = ({
  taskDocument,
  itemVisibility,
  setItemVisibility,
}: NewTaskAttachmentItemProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  return (
    <div
      className={`${
        itemVisibility ? 'block' : 'hidden'
      } flex justify-between items-center truncate`}
    >
      <div
        className="flex items-center bg-lighterGray rounded-lg px-4 py-2
     truncate w-full"
      >
        <div className="flex items-center space-x-2 w-full truncate">
          <Icon name="fileV2" alt="file" fill w={30} h={30} />
          <Typography variant="footnote1" className="w-full truncate">
            {removeFileExtension(taskDocument.name)}
          </Typography>
        </div>
        <div className="flex gap-2 items-center">
          <UploadDocumentStatusIcon status={taskDocument.status} />
          <button
            type="button"
            onClick={() =>
              TaskDocumentService.deleteTaskDocument(
                token,
                subdomain,
                taskDocument.taskId,
                taskDocument.id
              )
                .then(() => {
                  setItemVisibility(false);
                  queryClient.invalidateQueries([
                    'taskDocuments',
                    token,
                    subdomain,
                    taskDocument.taskId,
                  ]);
                  queryClient.invalidateQueries([
                    'documentTask',
                    token,
                    subdomain,
                    taskDocument.taskId,
                    taskDocument.id,
                  ]);
                  showSnackbar(`Anexo removido com sucesso`, 'success');
                })
                .catch((error) => {
                  showSnackbar(error.response.data.message, 'error');
                })
            }
          >
            <Icon name="close" color="black" alt="close" stroke />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskAttachmentItem;
