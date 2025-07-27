import { snackbarColor } from 'printer-ui';
import { queryClient } from '../queryClient';
import { BatchOperationService } from '../services/printer-air';
import { ShowBatchOperationAPIResponse } from '../services/printer-air/types';

const poolingBatchOperation: any = (
  batchOperation: ShowBatchOperationAPIResponse,
  token: string,
  subdomain: string,
  showSnackbar: (message: string, color: snackbarColor) => void
) => {
  BatchOperationService.show(token, subdomain, batchOperation.id).then(
    (response) => {
      if (response.status === 'running') {
        setInterval(
          poolingBatchOperation(response, token, subdomain, showSnackbar),
          2000
        );
      } else if (response.status === 'failed') {
        {
          batchOperation.recordType === 'PrinterAir::Directory'
            ? showSnackbar('Não foi possível compartilhar a pasta!', 'error')
            : showSnackbar('Não foi possível compartilhar o arquivo!', 'error');
        }
      } else {
        queryClient.invalidateQueries();
        {
          batchOperation.recordType === 'PrinterAir::Directory'
            ? showSnackbar('Pasta compartilhada com sucesso!', 'success')
            : showSnackbar('Arquivo compartilhado com sucesso!', 'success');
        }
      }
    }
  );
};

export default poolingBatchOperation;
