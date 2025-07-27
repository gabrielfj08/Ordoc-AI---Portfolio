import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination, Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import { OrganizationsContainerProps } from './types';
import Skeleton from '../Skeleton';
import Organizations from './Organizations';

const OrganizationsContainer = ({
  queryParams,
  page,
  setPage,
}: OrganizationsContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery(
    ['organizations', queryParams],
    () => OrganizationService.indexV3(token, subdomain, queryParams)
  );

  if (isLoading) return <Skeleton />;

  if (isError)
    return (
      <div className="h-60 items-center justify-center flex w-[38.5rem] space-x-2">
        <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
        <Typography variant="footnote2" color="gray">
          Erro ao listar instituições.
        </Typography>
      </div>
    );

  const totalObjects = data.meta.total;
  const docsPerPage = 20;

  const pageNumber =
    totalObjects > docsPerPage ? Math.ceil(totalObjects / docsPerPage) : 1;

  return (
    <div className="items-center flex flex-col">
      {data.organizations.length <= 0 ? (
        <div className="h-60 items-center justify-center flex w-[38.5rem] space-x-2">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhuma instituição encontrada.
          </Typography>
        </div>
      ) : (
        <>
          <Organizations organizations={data.organizations} />
          <div className="flex justify-center p-2 space-x-2 items-center">
            <Pagination
              page={page}
              totalPages={pageNumber}
              totalDocs={totalObjects}
              docsPerPage={docsPerPage}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationsContainer;
