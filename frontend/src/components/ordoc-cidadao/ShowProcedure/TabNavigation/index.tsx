'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ReportContainer from './Report';
import TasksContainer from './Tasks';

const ShowProcedureTabNavigation = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="report" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report">Relatório</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="report" className="mt-6">
            <ReportContainer />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6">
            <TasksContainer />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShowProcedureTabNavigation;
