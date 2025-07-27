import * as React from 'react';
import { useSession } from '../../../../../hooks';
import { IndexSignaturesPayload } from '../../../../../services/printer-flow/types';
import PendingSignaturesTab from './PendingSignatures';

const PendingSignaturesTabContainer = ({}) => {
  const { session } = useSession();

  if (!session.user?.internalRequester?.id) return null;

  const [params, setParams] = React.useState<IndexSignaturesPayload>({
    order: 'created_at',
    direction: 'desc',
    page: 1,
    perPage: 20,
    status: 'created',
    requesterId: session?.user?.internalRequester?.id,
  });

  return <PendingSignaturesTab params={params} setParams={setParams} />;
};

export default PendingSignaturesTabContainer;
