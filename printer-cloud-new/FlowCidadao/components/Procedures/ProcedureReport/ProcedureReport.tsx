import * as React from 'react';
import { SnackbarV3 } from 'printer-ui';
import { useV3ActionSheet } from '../../../../hooks';

const ProcedureReportActionSheet = ({ procedureReport }) => {
  const { closeActionSheet } = useV3ActionSheet();

  React.useEffect(() => {
    if (procedureReport.status !== 'running') {
      closeActionSheet();
    }
  }, [procedureReport.status]);

  return (
    <div>
      <SnackbarV3
        className="mb-1.5 sm:mb-6 mx-6"
        message={
          'Por favor, aguarde. Seu comprovante será aberto em instantes.'
        }
        title="Gerando pdf do processo..."
        onClick={closeActionSheet}
        type="loading"
      />
    </div>
  );
};

export default ProcedureReportActionSheet;
