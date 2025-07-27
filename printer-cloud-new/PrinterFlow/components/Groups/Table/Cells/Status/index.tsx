import * as React from 'react';
import GroupStatusCell from './Status';

const GroupStatusCellContainer = ({ group }) => {
  return <GroupStatusCell group={group} groupStatus={group.status} />;
};

export default GroupStatusCellContainer;
