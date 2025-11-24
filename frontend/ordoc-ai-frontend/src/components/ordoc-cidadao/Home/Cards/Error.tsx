'use client';

import * as React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const CardsError = () => {
  return (
    <div className="my-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro! Não foi possível carregar as informações, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CardsError;
