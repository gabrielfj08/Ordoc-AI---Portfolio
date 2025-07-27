import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '../../../../../services';
import { useAuth } from '../../../../../hooks';
import AttachPolicyToUserSelect from './IndexUserSelect';
import Skeleton from './Skeleton';
import Error from './Error';

const IndexUsersSelectContainer = () => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['policy', token, subdomain],
    queryFn: () => UserService.index(token, subdomain, { perPage: 1000 }),
  });

  if (isError) {
    return <Error />;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return <AttachPolicyToUserSelect users={data.users} />;
};

export default IndexUsersSelectContainer;
