'use client';

import * as React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const HomeError = () => {
  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro! Não foi possível carregar a página inicial, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default HomeError;
