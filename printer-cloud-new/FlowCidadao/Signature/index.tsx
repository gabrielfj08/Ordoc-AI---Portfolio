import * as React from 'react';
import router from 'next/router';
import {
  FilterExternalSignaturesParams,
  statusExternalSignature,
} from './types';
import ExternalSignatures from './Signature';

const ExternalSignaturesContainer = () => {
  const [params, setParams] = React.useState<FilterExternalSignaturesParams>({
    order: 'created_at',
    direction: 'desc',
    page: 1,
    perPage: 10,
    status: router.query.status
      ? (router.query.status as statusExternalSignature)
      : 'allStatus',
    createdAtGte: '',
    createdAtLte: '',
  });

  return <ExternalSignatures params={params} setParams={setParams} />;
};

export default ExternalSignaturesContainer;
