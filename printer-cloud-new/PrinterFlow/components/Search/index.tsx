import * as React from 'react';
import { IndexProceduresPayload } from '../../../services/printer-flow/types';
import GeneralSearchPage from './Search';

const GeneralSearchPageContainer = ({ setInitialTable }) => {
  const [params, setParams] = React.useState<IndexProceduresPayload>({
    order: 'name',
    direction: 'asc',
    q: '',
    page: 1,
    perPage: 20,
  });
  return (
    <GeneralSearchPage
      params={params}
      setParams={setParams}
      onSubmit={setInitialTable}
    />
  );
};

export default GeneralSearchPageContainer;
