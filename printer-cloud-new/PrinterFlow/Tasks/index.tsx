import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../queryClient';
import { useAuth, useSession, useSessionGroupRequester } from '../../hooks';
import { TaskService } from '../../services/printer-flow';
import Tasks from './Tasks';

const TasksContainer = () => {
  const { session } = useSession();
  const { token, subdomain } = useAuth();
  const { sessionGroupRequester } = useSessionGroupRequester();

  React.useEffect(() => {
    queryClient.invalidateQueries([
      'tasksRunning',
      subdomain,
      token,
      { groupAssigneeId: sessionGroupRequester?.id },
    ]);
    queryClient.invalidateQueries([
      'tasksStarted',
      subdomain,
      token,
      {
        status: 'started',
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester?.id,
      },
    ]);
    queryClient.invalidateQueries([
      'tasksRefused',
      subdomain,
      token,
      { createdById: session.user?.id },
    ]);
    queryClient.invalidateQueries(['procedure', token, subdomain]);
    queryClient.invalidateQueries([
      'tasksFinished',
      subdomain,
      token,
      {
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester?.id,
      },
    ]);
  }, [sessionGroupRequester.id]);

  const {
    isLoading: tasksRunningIsLoading,
    isError: tasksRunningIsError,
    data: tasksRunningData,
  } = useQuery({
    queryKey: [
      'tasksRunning',
      subdomain,
      token,
      { status: 'running', groupAssigneeId: sessionGroupRequester?.id },
    ],
    queryFn: () =>
      TaskService.index(token, subdomain, {
        status: 'running',
        groupAssigneeId: sessionGroupRequester?.id,
      }),
    enabled: !!sessionGroupRequester?.id,
  });

  const {
    isLoading: tasksStartedIsLoading,
    isError: tasksStartedIsError,
    data: tasksStartedData,
  } = useQuery({
    queryKey: [
      'tasksStarted',
      subdomain,
      token,
      {
        status: 'started',
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester.id,
      },
    ],
    queryFn: () =>
      TaskService.index(token, subdomain, {
        status: 'started',
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester.id,
      }),
    enabled:
      !!sessionGroupRequester.id || !!session.user?.internalRequester?.id,
  });

  const {
    isLoading: tasksRefusedIsLoading,
    isError: tasksRefusedIsError,
    data: tasksRefusedData,
  } = useQuery({
    queryKey: [
      'taskRefused',
      subdomain,
      token,
      {
        status: 'refused',
        createdById: session.user?.id,
      },
    ],
    queryFn: () =>
      TaskService.index(token, subdomain, {
        status: 'refused',
        createdById: session.user?.id,
      }),
    enabled: !!session.user?.id,
  });

  const {
    isLoading: tasksFinishedIsLoading,
    isError: tasksFinishedIsError,
    data: tasksFinishedData,
  } = useQuery({
    queryKey: [
      'tasksFinished',
      subdomain,
      token,
      {
        status: 'doneByMe',
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester.id,
      },
    ],
    queryFn: () =>
      TaskService.index(token, subdomain, {
        status: 'doneByMe',
        assigneeId: session.user?.internalRequester?.id,
        groupAssigneeId: sessionGroupRequester.id,
      }),
    enabled:
      !!sessionGroupRequester.id || !!session.user?.internalRequester?.id,
  });

  if (
    tasksRunningIsError ||
    tasksStartedIsError ||
    tasksRefusedIsError ||
    tasksFinishedIsError
  )
    return null;

  if (
    tasksRunningIsLoading ||
    tasksStartedIsLoading ||
    tasksRefusedIsLoading ||
    tasksFinishedIsLoading
  )
    return null;

  return (
    <Tasks
      totalTasksRunning={tasksRunningData.meta.total}
      totalTasksStarted={tasksStartedData.meta.total}
      totalTasksRefused={tasksRefusedData.meta.total}
      totalTasksFinished={tasksFinishedData.meta.total}
    />
  );
};

export default TasksContainer;
