import * as React from 'react';
import router from 'next/router';
import { useExternalSession } from '../../hooks';
import {
  FilterExternalProceduresParams,
  statusExternalProcedure,
} from './types';
import ExternalProcedures from './Procedure';

const ExternalProceduresContainer = () => {
  const { externalSession } = useExternalSession();
  const [params, setParams] = React.useState<FilterExternalProceduresParams>({
    order: 'created_at',
    direction: 'desc',
    page: 1,
    perPage: 10,
    q: '',
    status: router.query.status
      ? (router.query.status as statusExternalProcedure)
      : '',
    requesterId: externalSession?.user?.id,
    createdAtGte: '',
    createdAtLte: '',
  });

  return <ExternalProcedures params={params} setParams={setParams} />;
};

export default ExternalProceduresContainer;
