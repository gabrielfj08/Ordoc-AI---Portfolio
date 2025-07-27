import * as React from 'react';
import { Typography, Widget } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { ReportService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { ReportsProps, ReportsPropsOrganization } from '../types';

const WidgetFlow = ({
  organizationID,
  storageLimit,
}: ReportsPropsOrganization) => {
  const { token } = useAuth();

  const [signedDocumentsCount, setSignedDocumentsCount] =
    React.useState<Array<ReportsProps>>();

  const [startedProcedures, setStartedProcedures] =
    React.useState<Array<ReportsProps>>();

  const [archivedProcedures, setArchivedProcedures] =
    React.useState<Array<ReportsProps>>();

  const [flowUsedStorage, setFlowUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [airUsedStorage, setAirUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [storageAvailable, setStorageAvailable] = React.useState(0);

  const [usedStoragePercentage, setUsedStoragePercentage] = React.useState(0);

  const getSignedDocumentsCount = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'signed_documents_count',
      token
    )
      .then((res) => {
        setSignedDocumentsCount(res.data['printer_reports/reports']);
      })
      .catch(() => {
        setSignedDocumentsCount([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getSignedDocumentsCount();
  }, [getSignedDocumentsCount, organizationID]);

  const getStartedProcedures = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'started_procedures',
      token
    )
      .then((res) => {
        setStartedProcedures(res.data['printer_reports/reports']);
      })
      .catch(() => {
        setStartedProcedures([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getStartedProcedures();
  }, [getStartedProcedures, organizationID]);

  const getArchivedProcedures = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'archived_procedures',
      token
    )
      .then((res) => {
        setArchivedProcedures(res.data['printer_reports/reports']);
      })
      .catch(() => {
        setArchivedProcedures([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getArchivedProcedures();
  }, [getArchivedProcedures, organizationID]);

  const getFlowUsedStorage = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'flow_used_storage',
      token
    )
      .then((res) => {
        setFlowUsedStorage(res.data['printer_reports/reports']);
      })
      .catch((error) => {
        setFlowUsedStorage([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getFlowUsedStorage();
  }, [getFlowUsedStorage, organizationID]);

  const getAirUsedStorage = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'air_used_storage',
      token
    )
      .then((res) => {
        setAirUsedStorage(res.data['printer_reports/reports']);
      })
      .catch((error) => {
        setAirUsedStorage([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getAirUsedStorage();
  }, [getAirUsedStorage, organizationID]);

  React.useLayoutEffect(() => {
    setStorageAvailable(
      Number(storageLimit) -
        (Number(flowUsedStorage?.at(0)?.data) +
          Number(airUsedStorage?.at(0)?.data))
    );
    setUsedStoragePercentage(
      ((Number(flowUsedStorage?.at(0)?.data) +
        Number(airUsedStorage?.at(0)?.data)) /
        Number(storageLimit)) *
        100
    );
  }, [flowUsedStorage, airUsedStorage, storageLimit]);

  return (
    <Widget
      title="FLOW"
      data={[
        ['app', 'storage'],
        ['disponível', storageAvailable],
        ['utilizado', flowUsedStorage?.at(0)?.data],
      ]}
      chart
      legend="Armazenamento utilizado"
      value={
        !storageLimit || storageLimit == '0.0'
          ? `0.00%`
          : `${usedStoragePercentage.toFixed(2)}%`
      }
      color="yellow"
    >
      <div className="flex">
        <Typography
          className="sm:w-44 sm:mb-4"
          variant="footnote1"
          family="robotoBold"
        >
          Documentos assinados
        </Typography>
        <>
          {signedDocumentsCount?.map((signedDocumentCount) => (
            <Typography
              key={signedDocumentCount.id}
              variant="footnote1"
              family="roboto"
            >
              {signedDocumentCount.data}
            </Typography>
          ))}
        </>
      </div>
      <div className="flex">
        <Typography
          className="sm:w-44 sm:mb-4"
          variant="footnote1"
          family="robotoBold"
        >
          Processos tramitando
        </Typography>
        <>
          {startedProcedures?.map((startedProcedure) => (
            <Typography
              key={startedProcedure.id}
              variant="footnote1"
              family="roboto"
            >
              {startedProcedure.data}
            </Typography>
          ))}
        </>
      </div>
      <div className="flex">
        <Typography className="sm:w-44" variant="footnote1" family="robotoBold">
          Processos arquivados
        </Typography>
        <>
          {archivedProcedures?.map((archivedProcedure) => (
            <Typography
              key={archivedProcedure.id}
              variant="footnote1"
              family="roboto"
            >
              {archivedProcedure.data}
            </Typography>
          ))}
        </>
      </div>
    </Widget>
  );
};

export default WidgetFlow;
