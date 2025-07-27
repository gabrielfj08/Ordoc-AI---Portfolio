import * as React from 'react';
import { Skeleton } from 'printer-ui';

const TaskFileMentionListSkeleton = () => {
  return (
    <div className="w-full pt-2 space-y-2">
      <Skeleton w="full" h={12} rounded="md" />
    </div>
  );
};

export default TaskFileMentionListSkeleton;
