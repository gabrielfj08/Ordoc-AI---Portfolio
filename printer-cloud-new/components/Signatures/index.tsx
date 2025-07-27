import * as React from 'react';
import { PublicIndexSignaturesPayload } from '../../services/types';
import VerifySignatures from './Signatures';
import { VerifySignaturesContainerProps } from './types';

const VerifySignaturesContainer = ({
  documentToken,
}: VerifySignaturesContainerProps) => {
  const [params, setParams] = React.useState<PublicIndexSignaturesPayload>({
    documentToken,
    q: '',
    page: 1,
    perPage: 1000,
  });

  return <VerifySignatures params={params} setParams={setParams} />;
};

export default VerifySignaturesContainer;
