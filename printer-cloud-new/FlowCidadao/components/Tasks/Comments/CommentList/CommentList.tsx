import * as React from 'react';
import { TaskCommentListProps } from './types';
import TaskExternalCommentItem from '../CommentItem';

const TaskExternalCommentList = ({
  taskComments,
  task,
}: TaskCommentListProps) => {
  return (
    <>
      {taskComments.map((taskComment) => (
        <TaskExternalCommentItem
          key={taskComment.id}
          taskComments={taskComment}
          task={task}
        />
      ))}
    </>
  );
};

export default TaskExternalCommentList;
