import * as React from 'react';
import { Typography, Widget } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { ReportService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { ReportsProps, ReportsPropsOrganization } from '../types';

const WidgetAir = ({
  organizationID,
  storageLimit,
}: ReportsPropsOrganization) => {
  const { token } = useAuth();

  const [directoriesCount, setDirectoriesCount] =
    React.useState<Array<ReportsProps>>();

  const [documentsCount, setDocumentsCount] =
    React.useState<Array<ReportsProps>>();

  const [airUsedStorage, setAirUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [flowUsedStorage, setFlowUsedStorage] =
    React.useState<Array<ReportsProps>>();

  const [storageAvailable, setStorageAvailable] = React.useState(0);

  const [usedStoragePercentage, setUsedStoragePercentage] = React.useState(0);

  const getDirectoriesCount = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'directories_count',
      token
    )
      .then((res) => {
        setDirectoriesCount(res.data['printer_reports/reports']);
      })
      .catch((error) => {
        setDirectoriesCount([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getDirectoriesCount();
  }, [getDirectoriesCount, organizationID]);

  const getDocumentsCount = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'documents_count',
      token
    )
      .then((res) => {
        setDocumentsCount(res.data['printer_reports/reports']);
      })
      .catch(() => {
        setDocumentsCount([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getDocumentsCount();
  }, [getDocumentsCount, organizationID]);

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

  const getFlowUsedStorage = React.useCallback(async () => {
    ReportService.index(
      organizationID,
      getSubdomain(),
      'flow_used_storage',
      token
    )
      .then((res) => {
        setFlowUsedStorage(res.data['reports/reports']);
      })
      .catch(() => {
        setFlowUsedStorage([]);
      });
  }, [organizationID]);

  React.useEffect(() => {
    organizationID && getFlowUsedStorage();
  }, [getFlowUsedStorage, organizationID]);

  React.useLayoutEffect(() => {
    setStorageAvailable(
      Number(storageLimit) - Number(airUsedStorage?.at(0)?.data)
    );
    setUsedStoragePercentage(
      (Number(airUsedStorage?.at(0)?.data) / Number(storageLimit)) * 100
    );
  }, [airUsedStorage, storageLimit]);

  return (
    <Widget
      title="AIR"
      data={[
        ['app', 'storage'],
        ['disponível', storageAvailable],
        ['utilizado', airUsedStorage?.at(0)?.data],
      ]}
      chart
      legend="Armazenamento utilizado"
      value={
        !storageLimit || storageLimit == '0.0'
          ? `0.00%`
          : `${usedStoragePercentage.toFixed(2)}%`
      }
      color="red"
    >
      <div className="flex">
        <Typography
          className="sm:w-44 sm:mb-4"
          variant="footnote1"
          family="robotoBold"
        >
          Diretórios
        </Typography>
        <>
          {directoriesCount?.map((directoryCount) => (
            <Typography
              key={directoryCount.id}
              variant="footnote1"
              family="roboto"
            >
              {directoryCount.data}
            </Typography>
          ))}
        </>
      </div>
      <div className="flex">
        <Typography className="sm:w-44" variant="footnote1" family="robotoBold">
          Documentos
        </Typography>
        <>
          {documentsCount?.map((documentCount) => (
            <Typography
              key={documentCount.id}
              variant="footnote1"
              family="roboto"
            >
              {documentCount.data}
            </Typography>
          ))}
        </>
      </div>
    </Widget>
  );
};

export default WidgetAir;
