import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { FieldService } from '../../../../../services/printer-flow';
import { ShowFieldSubjectContainerProps } from './types';
import ShowFieldSubjectError from './Error';
import ShowFieldSubjectSkeleton from './Skeleton';
import ShowFieldSubjectEmpty from './Empty';
import ShowFieldSubject from './SubjectField';

const ShowFieldSubjectContainer = ({
  procedureTemplate,
}: ShowFieldSubjectContainerProps) => {
  const { subdomain, token } = useAuth();
  const [page, setPage] = React.useState(1);

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['fields', subdomain, token, procedureTemplate.id, { page }],
    queryFn: () =>
      FieldService.index(token, subdomain, procedureTemplate.id, {
        page,
        perPage: 3,
      }),
  });

  if (isError)
    return <ShowFieldSubjectError procedureTemplate={procedureTemplate} />;

  if (isLoading || isFetching) return <ShowFieldSubjectSkeleton />;

  const totalDocs = data.meta.total;

  if (!data.meta.total) {
    return <ShowFieldSubjectEmpty procedureTemplate={procedureTemplate} />;
  }

  return (
    <ShowFieldSubject
      procedureTemplate={procedureTemplate}
      fields={data.fields}
      totalDocs={totalDocs}
      page={page}
      setPage={setPage}
    />
  );
};

export default ShowFieldSubjectContainer;
