import * as React from 'react';
import { useAuth, useSnackbar, useActionSheet } from '../../../../../hooks';
import { ProcedureReportService } from '../../../../../services/printer-flow';
import CreateProcedurePDFActionSheet from './ActionSheet';
import { CreateProcedurePDFContainerActionSheetProps } from './types';

const CreateProcedurePDFContainerActionSheet = ({
  procedureId,
}: CreateProcedurePDFContainerActionSheetProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();
  const [generatePDFId, setgeneratePDFId] = React.useState<number | null>(null);

  React.useEffect(() => {
    ProcedureReportService.create(token, subdomain, procedureId)
      .then((res) => {
        setgeneratePDFId(res.id);
      })
      .catch((err) => {
        closeActionSheet();
        showSnackbar(err.response.data.message, 'error');
      });
    return () => setgeneratePDFId(null);
  }, [setgeneratePDFId]);

  if (!generatePDFId) return null;

  return (
    <CreateProcedurePDFActionSheet
      procedureId={procedureId}
      documentId={generatePDFId}
    />
  );
};

export default CreateProcedurePDFContainerActionSheet;
