import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth, useSnackbar } from '../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../services/printer-flow';
import { removeFileExtension } from '../../../../../utils';
import { AttachmentListItemProps } from './types';
import UploadDocumentStatusIcon from '../../../ProcedureTemplates/StatusIcon/StatusIcon';

const AttachmentListItem = ({
  item,
  setProcedureDocumentView,
  procedureDocumentView,
}: AttachmentListItemProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [itemVisibility, setItemVisibility] = React.useState<boolean>(true);

  return (
    <div
      className={`${
        itemVisibility ? 'block' : 'hidden'
      } gap-2 items-center rounded-md bg-lighterGray h-12 p-5 w-full flex justify-between`}
    >
      <div className="flex gap-2 items-center truncate w-10/12">
        <Icon name="fileV2" color="black" alt="status" fill />
        <Typography className="truncate" variant="footnote1">
          {removeFileExtension(item.name)}
        </Typography>
      </div>
      <div className="flex gap-2 items-center truncate">
        <UploadDocumentStatusIcon status={item.status} />
        <button
          type="button"
          onClick={() => {
            ProcedureDocumentService.deleteProcedureDocument(
              token,
              subdomain,
              item.procedureId,
              item.id
            )
              .then(() => {
                showSnackbar(`Anexo removido com sucesso.`, 'success');
                setItemVisibility(false);
                setProcedureDocumentView(
                  procedureDocumentView.filter((e) => e !== item.uuid)
                );
                queryClient.invalidateQueries([
                  'procedureDocument',
                  token,
                  subdomain,
                  item.procedureId,
                  item.uuid,
                ]);
              })
              .catch((error) => {
                showSnackbar(error.response.data.message, 'error');
              });
          }}
        >
          <Icon name="close" color="black" alt="close" stroke />
        </button>
      </div>
    </div>
  );
};

export default AttachmentListItem;
