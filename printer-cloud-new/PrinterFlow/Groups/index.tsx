import * as React from 'react';
import { FilterGroupsParams } from './types';
import GroupsPage from './Groups';

const GroupsPageContainer = ({}) => {
  const [params, setParams] = React.useState<FilterGroupsParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
  });

  return <GroupsPage params={params} setParams={setParams} />;
};

export default GroupsPageContainer;
