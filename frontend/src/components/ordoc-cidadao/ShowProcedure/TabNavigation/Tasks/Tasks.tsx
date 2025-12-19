'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, User, CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface TasksProps {
  tasks: Array<{
    id: number;
    name: string;
    status: string;
    assignedTo: { name: string };
    createdAt: string;
    completedAt: string | null;
  }>;
}

const Tasks = ({ tasks }: TasksProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          label: 'Concluída', 
          variant: 'default' as const, 
          icon: <CheckCircle className="h-4 w-4 text-green-600" />
        };
      case 'in_progress':
        return { 
          label: 'Em Andamento', 
          variant: 'secondary' as const, 
          icon: <AlertCircle className="h-4 w-4 text-yellow-600" />
        };
      case 'pending':
        return { 
          label: 'Pendente', 
          variant: 'outline' as const, 
          icon: <Circle className="h-4 w-4 text-gray-600" />
        };
      default:
        return { 
          label: 'Desconhecido', 
          variant: 'secondary' as const, 
          icon: <Circle className="h-4 w-4 text-gray-600" />
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-600">Tarefas do Procedimento</h3>
      
      {tasks?.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Concluída em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const statusConfig = getStatusConfig(task.status);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {task.assignedTo.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {statusConfig.icon}
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {formatDate(task.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.completedAt ? (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {formatDate(task.completedAt)}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Nenhuma tarefa encontrada para este procedimento
        </div>
      )}
    </div>
  );
};

export default Tasks;
