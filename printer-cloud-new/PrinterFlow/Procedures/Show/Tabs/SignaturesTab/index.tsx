import * as React from 'react';
import { IndexSignaturesPayload } from '../../../../../services/printer-flow/types';
import { SignaturesTabContainerProps } from './types';
import SignaturesTab from './SignaturesTab';

const SignaturesTabContainer = ({ procedure }: SignaturesTabContainerProps) => {
  const [params, setParams] = React.useState<IndexSignaturesPayload>({
    page: 1,
    perPage: 9,
    procedureId: procedure.id,
  });

  return (
    <SignaturesTab
      params={params}
      setParams={setParams}
      procedure={procedure}
    />
  );
};

export default SignaturesTabContainer;
