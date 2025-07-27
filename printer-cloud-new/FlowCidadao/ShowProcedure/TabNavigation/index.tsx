import * as React from 'react';
import {
  cidColors,
  TabItem,
  TabNavigation,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useSession } from '../../../hooks';
import TasksTable from './Tasks';
import ReportList from './Report';

const ShowProcedureTabNavigation = () => {
  const { themeColor } = useSession();

  const tabs: Array<TabItem> = [
    {
      title: 'Tarefas',
      icon: 'tasksV3',
      children: <TasksTable color={themeColor} />,
    },
    {
      title: 'Histórico',
      icon: 'clockV3',
      children: <ReportList color={themeColor} />,
    },
  ];

  return (
    <div className="space-y-8">
      <Typography
        variant="bodyLg"
        family="jakartaBold"
        color={themeColor}
        align="start"
      >
        Movimentações:
      </Typography>
      <div className={`p-2 rounded-lg border-2 border-${themeColor}`}>
        <TabNavigation color={themeColor as cidColors} items={tabs} />
      </div>
    </div>
  );
};

export default ShowProcedureTabNavigation;
