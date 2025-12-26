'use client';

import { Folder, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FolderInsight {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  count?: number;
  action?: string;
}

interface FolderCardProps {
  id: string | number;
  name: string;
  documentCount: number;
  healthStatus?: 'healthy' | 'needs_attention' | 'critical';
  insights?: FolderInsight[];
  pendingActions?: number;
  onClick?: () => void;
}

const FolderCard = ({
  name,
  documentCount,
  healthStatus = 'healthy',
  insights = [],
  pendingActions = 0,
  onClick
}: FolderCardProps) => {
  // Ícone de status
  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-medical-500" />;
      case 'needs_attention':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  // Badge de status
  const getStatusBadge = () => {
    switch (healthStatus) {
      case 'healthy':
        return (
          <Badge className="bg-medical-50 text-medical-700 border-medical-200">
            Organizada
          </Badge>
        );
      case 'needs_attention':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            Atenção
          </Badge>
        );
      case 'critical':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            Crítico
          </Badge>
        );
    }
  };

  // Ícone do insight
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-3 w-3 text-medical-500" />;
      case 'info':
        return <Info className="h-3 w-3 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-orange-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105',
        'border-2',
        healthStatus === 'healthy' && 'border-neutral-200 hover:border-medical-300',
        healthStatus === 'needs_attention' && 'border-orange-200 hover:border-orange-400',
        healthStatus === 'critical' && 'border-red-200 hover:border-red-400'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header com ícone e nome */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 rounded-lg bg-gradient-soft">
              <Folder className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-neutral-800 truncate">
                {name}
              </h3>
              <p className="text-xs text-neutral-500">
                {documentCount} {documentCount === 1 ? 'documento' : 'documentos'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  {getStatusIcon()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Status: {healthStatus === 'healthy' ? 'Saudável' : healthStatus === 'needs_attention' ? 'Precisa de atenção' : 'Crítico'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Badge de status */}
        <div className="mb-3">
          {getStatusBadge()}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            {insights.slice(0, 2).map((insight, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-start gap-1.5 text-xs">
                      {getInsightIcon(insight.type)}
                      <span className="text-neutral-600 line-clamp-1">
                        {insight.message}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">{insight.message}</p>
                    {insight.count && (
                      <p className="text-xs text-neutral-400 mt-1">
                        {insight.count} {insight.count === 1 ? 'item' : 'itens'}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {insights.length > 2 && (
              <p className="text-xs text-neutral-400 italic">
                +{insights.length - 2} {insights.length - 2 === 1 ? 'insight' : 'insights'}
              </p>
            )}
          </div>
        )}

        {/* Ações pendentes */}
        {pendingActions > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Ações pendentes</span>
              <Badge variant="outline" className="text-xs">
                {pendingActions}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FolderCard;
