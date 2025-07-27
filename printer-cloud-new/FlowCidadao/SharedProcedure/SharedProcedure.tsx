import * as React from 'react';
import {
  PaginationV3 as Pagination,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useSession } from '../../hooks';
import { ExternalSharedProcedureProps } from './types';
import SharedProcedureTable from './Table';

const ExternalSharedProcedure = ({
  params,
  setParams,
}: ExternalSharedProcedureProps) => {
  const { session, themeColor } = useSession();

  if (!session) return null;

  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <div className="w-full flex flex-col  sm:pr-10 sm:pl-20 px-4">
      <Typography
        variant="headline4"
        family="jakartaBold"
        color={themeColor}
        align="start"
        className="py-4"
      >
        Solicitações - Processos compartilhados com você
      </Typography>
      <div className="w-full sm:h-[295px] h-56 overflow-x-auto">
        <SharedProcedureTable
          params={params}
          setTotalObjects={setTotalObjects}
        />
      </div>
      <div className="items-center justify-center flex mt-4">
        <Pagination
          color={themeColor}
          page={Number(params.page)}
          setPage={(page) => setParams({ ...params, page: page })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
    </div>
  );
};

export default ExternalSharedProcedure;
