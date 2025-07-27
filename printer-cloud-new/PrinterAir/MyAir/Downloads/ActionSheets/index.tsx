import * as React from 'react';
import { useAuth, useSnackbar, useActionSheet } from '../../../../hooks';
import { DownloadJobService } from '../../../../services/printer-air/DownloadJob';
import DownloadJobActionSheet from './DowloadJob';
import { DownloadJobActionSheetContainerProps } from './types';

const DownloadJobActionSheetContainer = ({
  selectedDirectoryIds,
  selectedDocumentIds,
}: DownloadJobActionSheetContainerProps) => {
  const { subdomain, token } = useAuth();
  const { closeActionSheet } = useActionSheet();
  const { showSnackbar } = useSnackbar();

  const [downloadJobId, setDownloadJobId] = React.useState<number | null>(null);

  React.useEffect(() => {
    DownloadJobService.create(token, subdomain, {
      directoryIds: selectedDirectoryIds,
      documentIds: selectedDocumentIds,
    })
      .then((res) => {
        setDownloadJobId(res.id);
      })
      .catch((err) => {
        closeActionSheet();
        showSnackbar(err.response.data.message, 'error');
      });
  }, [selectedDirectoryIds, selectedDocumentIds]);

  if (!downloadJobId) return null;

  return <DownloadJobActionSheet downloadJobId={downloadJobId as number} />;
};

export default DownloadJobActionSheetContainer;
