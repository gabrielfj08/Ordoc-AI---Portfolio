import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAuth,
  useSnackbar,
  useSession,
  useActionSheet,
} from '../../../hooks';
import {
  DocumentService,
  DirectoryService,
} from '../../../services/printer-air';
import { getSubdomain } from '../../../utils';
import { MoveJobsActionSheetContainerProps } from './types';
import MoveJobsActionSheet from './ActionSheet';

const MoveJobsActionSheetContainer = ({
  directoryIds,
  documentIds,
}: MoveJobsActionSheetContainerProps) => {
  const { token } = useAuth();
  const { session } = useSession();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();
  const queryClient = useQueryClient();

  const [restoreDocumentJobId, setRestoreDocumentJobId] = React.useState<
    number | null
  >(null);
  const [restoreDirectoryJobId, setRestoreDirectoryJobId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (directoryIds.length) {
      DirectoryService.restore(token, getSubdomain(), session.organization.id, {
        ids: directoryIds,
      })
        .then((res) => {
          setRestoreDirectoryJobId(res.id);
          queryClient.invalidateQueries(['directories', {}]);
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }

    if (documentIds.length) {
      DocumentService.restore(token, getSubdomain(), session.organization.id, {
        ids: documentIds,
      })
        .then((res) => {
          setRestoreDocumentJobId(res.id);
          queryClient.invalidateQueries(['documents', {}]);
        })
        .catch((err) => {
          closeActionSheet();
          showSnackbar(err.response.data.message, 'error');
        });
    }
  }, [directoryIds, documentIds]);

  return (
    <MoveJobsActionSheet
      restoreDocumentJobId={restoreDocumentJobId}
      restoreDirectoryJobId={restoreDirectoryJobId}
    />
  );
};

export default MoveJobsActionSheetContainer;
