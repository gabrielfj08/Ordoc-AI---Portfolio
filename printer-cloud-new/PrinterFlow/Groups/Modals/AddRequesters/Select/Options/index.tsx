import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import {
  RequesterService,
  GroupRequesterService,
} from '../../../../../../services/printer-flow';
import { AddRequestersSelectOptionsContainerProps } from './types';
import AddRequestersSelectError from './Error';
import SelectAddRequestersOptions from './Options';

const AddRequestersSelectOptionsContainer = ({
  query,
  open,
  groupId,
}: AddRequestersSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const {
    isLoading: requestersIsLoading,
    isError: requestersIsError,
    data: requestersData,
  } = useQuery({
    queryKey: ['requesters', subdomain, token, query, {}],
    queryFn: () =>
      RequesterService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
        status: 'active',
        type: 'InternalRequester',
      }),
  });

  const {
    isLoading: requestersFromGroupIsLoading,
    isError: requestersFromGroupIsError,
    data: requestersFromGroupData,
  } = useQuery({
    queryKey: ['groupRequesters', { order: 'name', direction: 'asc' }],
    queryFn: () =>
      GroupRequesterService.indexRequestersFromGroup(
        token,
        subdomain,
        groupId,
        {
          order: 'name',
          direction: 'asc',
        }
      ),
  });

  if (requestersIsLoading || requestersFromGroupIsLoading) {
    return null;
  }

  if (
    requestersIsError ||
    !requestersData ||
    requestersFromGroupIsError ||
    !requestersFromGroupData
  ) {
    return <AddRequestersSelectError />;
  }

  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-10`}
    >
      <SelectAddRequestersOptions
        requesters={requestersData.requesters}
        requestersFromGroup={requestersFromGroupData.requestersFromGroup}
      />
    </div>
  );
};

export default AddRequestersSelectOptionsContainer;
