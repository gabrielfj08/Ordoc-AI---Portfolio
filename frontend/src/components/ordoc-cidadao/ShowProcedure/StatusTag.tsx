'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProcedureStatusTagProps {
  status: string;
}

const ProcedureStatusTag = ({ status }: ProcedureStatusTagProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'RASCUNHO', variant: 'secondary' as const };
      case 'running':
        return { label: 'EM ANÁLISE', variant: 'default' as const };
      case 'archived':
        return { label: 'ARQUIVADO', variant: 'outline' as const };
      case 'finished':
        return { label: 'FINALIZADO', variant: 'default' as const };
      case 'started':
        return { label: 'TRAMITANDO', variant: 'default' as const };
      default:
        return { label: 'DESCONHECIDO', variant: 'secondary' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};

export default ProcedureStatusTag;
