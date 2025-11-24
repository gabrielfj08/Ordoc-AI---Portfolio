'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, PenTool, Share2 } from 'lucide-react';
import { CardsProps } from '../types';

const Cards = ({ reportData, handleClick }: CardsProps) => {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            Processos
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClick}>
            Atualizar
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div 
            className="cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => router.push('/ordoc-cidadao/procedures?status=running')}
          >
            <div className="text-2xl font-bold text-blue-600">
              {reportData.proceduresRunningCount}
            </div>
            <p className="text-xs text-muted-foreground">em análise</p>
          </div>
          <div 
            className="cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => router.push('/ordoc-cidadao/procedures?status=started')}
          >
            <div className="text-2xl font-bold text-blue-600">
              {reportData.proceduresStartedCount}
            </div>
            <p className="text-xs text-muted-foreground">tramitando</p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Tarefas
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClick}>
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div 
            className="cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => router.push('/ordoc-cidadao/tasks?status=running')}
          >
            <div className="text-2xl font-bold text-green-600">
              {reportData.tasksRunningCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.tasksRunningCount === 1 ? 'pendente' : 'pendentes'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <PenTool className="h-4 w-4 mr-2 text-purple-600" />
            Assinaturas
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClick}>
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div 
            className="cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => router.push('/ordoc-cidadao/signatures?status=created')}
          >
            <div className="text-2xl font-bold text-purple-600">
              {reportData.signaturesPendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.signaturesPendingCount === 1 ? 'pendente' : 'pendentes'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Share2 className="h-4 w-4 mr-2 text-orange-600" />
            Compartilhamentos
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleClick}>
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <div 
            className="cursor-pointer hover:bg-muted p-2 rounded"
            onClick={() => router.push('/ordoc-cidadao/shared')}
          >
            <div className="text-2xl font-bold text-orange-600">
              {reportData.sharedProceduresPendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.sharedProceduresPendingCount === 1 ? 'pendente' : 'pendentes'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cards;
