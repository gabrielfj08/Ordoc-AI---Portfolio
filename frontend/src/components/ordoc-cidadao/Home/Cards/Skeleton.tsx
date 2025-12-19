'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, CheckCircle, PenTool, Share2 } from 'lucide-react';

const CardsSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            Processos
          </CardTitle>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Tarefas
          </CardTitle>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <PenTool className="h-4 w-4 mr-2 text-purple-600" />
            Assinaturas
          </CardTitle>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Share2 className="h-4 w-4 mr-2 text-orange-600" />
            Compartilhamentos
          </CardTitle>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsSkeleton;
