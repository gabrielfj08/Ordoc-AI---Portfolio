import * as React from 'react';
import { Tab } from '@headlessui/react';
import { TasksProps } from './types';
import TasksTabs from '../components/Tasks/Tabs';
import TasksRefusedTab from '../components/Tasks/Tabs/TasksRefusedTab';
import TasksRunningTab from '../components/Tasks/Tabs/TasksRunningTab';
import TasksStartedTab from '../components/Tasks/Tabs/TasksStartedTab';
import TasksFinishedTab from '../components/Tasks/Tabs/TasksFinishedTab';

const Tasks = ({
  totalTasksRefused,
  totalTasksStarted,
  totalTasksRunning,
  totalTasksFinished,
}: TasksProps) => {
  return (
    <div className="w-full my-6">
      <TasksTabs
        totalTasksRunning={totalTasksRunning}
        totalTasksStarted={totalTasksStarted}
        totalTasksRefused={totalTasksRefused}
        totalTasksFinished={totalTasksFinished}
      >
        <Tab.Panels className="rounded-lg h-full w-full">
          <TasksRunningTab />
          <TasksStartedTab />
          <TasksFinishedTab />
          <TasksRefusedTab />
        </Tab.Panels>
      </TasksTabs>
    </div>
  );
};

export default Tasks;
