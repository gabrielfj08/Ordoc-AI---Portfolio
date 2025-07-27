import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import TreeView from '../../components/TreeView';
import ShowGroupTreeUnauthorized from './Unauthorized';
import TreeViewSkeleton from './TreeViewSkeleton';
import TreeViewError from './TreeViewError';

const NewGroupRequesterPage = ({ groupId }) => {
  const { token, subdomain } = useAuth();
  const [error, setError] = React.useState<number>();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['newGroupRequester', token, subdomain, groupId],
    queryFn: () => GroupRequesterService.showTree(token, subdomain, groupId),
    onError: (error: any) => {
      setError(error.response.status);
    },
  });

  if (isLoading) return <TreeViewSkeleton />;

  if (isError) {
    if (error === 401) {
      return <ShowGroupTreeUnauthorized />;
    }
    return <TreeViewError />;
  }

  return (
    <>
      <TreeView data={data} />
    </>
  );
};

export default NewGroupRequesterPage;
