import * as React from 'react';
import router from 'next/router';
import { useExternalSession } from '../../hooks';
import {
  FilterExternalSharedProcedureParams,
  statusExternalSharedProcedure,
} from './types';
import ExternalSharedProcedure from './SharedProcedure';

const ExternalSharedProcedureContainer = () => {
  const { externalSession } = useExternalSession();

  const [params, setParams] =
    React.useState<FilterExternalSharedProcedureParams>({
      order: 'created_at',
      direction: 'desc',
      page: 1,
      perPage: 10,
      status: router.query.status
        ? (router.query.status as statusExternalSharedProcedure)
        : 'allStatus',
      externalRequesterId: externalSession?.user?.id,
    });

  return <ExternalSharedProcedure params={params} setParams={setParams} />;
};

export default ExternalSharedProcedureContainer;
