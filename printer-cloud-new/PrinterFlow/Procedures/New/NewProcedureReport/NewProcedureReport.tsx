import * as React from 'react';
import { useActionSheet } from '../../../../hooks';
import { Icon, Typography } from 'printer-ui';
import { NewProcedureReportProps } from './types';
import GeneratePDFStatusIcon from './StatusIcon';

const NewProcedureReport = ({ procedureReports }: NewProcedureReportProps) => {
  const { closeActionSheet } = useActionSheet();

  React.useEffect(() => {
    if (procedureReports.status !== 'running') {
      setTimeout(closeActionSheet, 3000);
    }
  }, [procedureReports.status]);

  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon alt="file" name="pdfFileV2" fill />
        <Typography variant="headline" className="truncate">
          Gerando o PDF do processo...
        </Typography>
      </span>
      <GeneratePDFStatusIcon status={procedureReports?.status} />
    </div>
  );
};

export default NewProcedureReport;
