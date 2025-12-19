'use client';

import * as React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SelectError = () => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Erro! Não foi possível carregar as informações da lista, tente novamente
        mais tarde.
      </AlertDescription>
    </Alert>
  );
};

export default SelectError;
