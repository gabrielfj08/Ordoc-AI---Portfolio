import * as React from 'react';
import {
  useAuth,
  useSnackbar,
  useActionSheet,
  useSession,
} from '../../../../hooks';
import {
  DocumentService,
  DirectoryService,
} from '../../../../services/printer-air';
import { RemoveJobsActionSheetContainerProps } from './types';
import RemoveJobsActionSheet from './ActionSheet';

const RemoveJobsActionSheetContainer = ({
  directoryIds,
  documentIds,
}: RemoveJobsActionSheetContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeActionSheet } = useActionSheet();
  const { showSnackbar } = useSnackbar();
  const { session } = useSession();

  const [removeDirectoryJobId, setRemoveDirectoryJobId] = React.useState<
    number | null
  >(null);
  const [removeDocumentJobId, setRemoveDocumentJobId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (directoryIds.length) {
      DirectoryService.trash(token, subdomain, session.organization.id, {
        ids: directoryIds,
      })
        .then((res) => {
          setRemoveDirectoryJobId(res.id);
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }

    if (documentIds.length) {
      DocumentService.trash(token, subdomain, session.organization.id, {
        ids: documentIds,
      })
        .then((res) => {
          setRemoveDocumentJobId(res.id);
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }
  }, [directoryIds, documentIds]);

  return (
    <RemoveJobsActionSheet
      removeDirectoryJobId={removeDirectoryJobId}
      removeDocumentJobId={removeDocumentJobId}
    />
  );
};

export default RemoveJobsActionSheetContainer;
