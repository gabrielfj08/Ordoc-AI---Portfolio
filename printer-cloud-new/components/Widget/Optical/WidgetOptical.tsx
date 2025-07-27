import * as React from 'react';
import { Typography, Widget } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { ReportService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { ReportsProps, ReportsPropsOrganization } from '../types';

const WidgetOptical = ({ organizationID }: ReportsPropsOrganization) => {
  const { token } = useAuth();

  const [opticalDocumentsCount, setOpticalDocumentsCount] =
    React.useState<Array<ReportsProps>>();

  const [opticalMovedDocuments, setOpticalMovedDocuments] =
    React.useState<Array<ReportsProps>>();

  const getOpticalDocumentsCount = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'optical_documents_count',
      token
    )
      .then((res) => {
        setOpticalDocumentsCount(res.data['reports/reports']);
      })
      .catch((error) => {
        setOpticalDocumentsCount([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getOpticalDocumentsCount();
  }, [getOpticalDocumentsCount, organizationID]);

  const getOpticalMovedDocuments = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'optical_moved_documents',
      token
    )
      .then((res) => {
        setOpticalMovedDocuments(res.data['reports/reports']);
      })
      .catch((error) => {
        setOpticalMovedDocuments([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getOpticalMovedDocuments();
  }, [getOpticalMovedDocuments, organizationID]);

  return (
    <Widget
      title="OPTICAL"
      data={[
        ['app', 'storage'],
        ['optical', 40],
        ['restante', 60],
      ]}
      legend="Documentos com OCR realizado"
      value={`${opticalDocumentsCount?.at(0)?.data}`}
      color="purple"
    >
      <div className="flex">
        <Typography
          className="sm:w-44 sm:mb-4"
          variant="footnote1"
          family="robotoBold"
        >
          Documentos movidos
        </Typography>
        <>
          {opticalMovedDocuments?.map((opticalMovedDocument) => (
            <Typography
              key={opticalMovedDocument.id}
              variant="footnote1"
              family="roboto"
            >
              {opticalMovedDocument.data}
            </Typography>
          ))}
        </>
      </div>
    </Widget>
  );
};

export default WidgetOptical;
