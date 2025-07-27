import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../../../../hooks';
import { ShareableLinkService } from '../../../../../services/printer-air';
import { ShareableLinksHistoryModalContainerProps } from './types';
import ShareableLinksHistoryModal from './History';
import ShareableLinksHistoryError from './Error';
import ShareableLinksHistorySkeleton from './Skeleton';

const ShareableLinksHistoryModalContainer = ({
  documentId,
}: ShareableLinksHistoryModalContainerProps) => {
  const { session } = useSession();
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['shareableLinks', session.organization.id, documentId, token],
    queryFn: () =>
      ShareableLinkService.index(
        token,
        subdomain,
        session.organization.id,
        documentId
      ),
  });

  if (isError) {
    return <ShareableLinksHistoryError />;
  }

  if (isLoading) {
    return <ShareableLinksHistorySkeleton />;
  }

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Nenhum link criado até o momento.
        </Typography>
      </div>
    );
  }

  return (
    <ShareableLinksHistoryModal
      documentId={documentId}
      shareableLinks={data.shareableLinks}
    />
  );
};

export default ShareableLinksHistoryModalContainer;
