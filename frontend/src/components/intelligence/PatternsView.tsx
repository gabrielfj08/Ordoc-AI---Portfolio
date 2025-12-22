'use client';

/**
 * PatternsView - Visualiza padrões aprendidos pela IA
 */

import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import intelligenceService from '@/services/intelligence';

interface Pattern {
  id: string;
  name: string;
  description: string;
  layer: string;
  pattern_type: string;
  confidence: number;
  occurrences: number;
  is_active: boolean;
  created_at: string;
  last_triggered_at?: string;
}

interface PatternCardProps {
  pattern: Pattern;
}

function PatternCard({ pattern }: PatternCardProps) {
  const layerColors = {
    user: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-700',
    organization: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700',
    sector: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-700',
    platform: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700',
  };

  const layerLabels = {
    user: 'Usuário',
    organization: 'Organização',
    sector: 'Setor',
    platform: 'Plataforma',
  };

  const confidenceColor = pattern.confidence >= 0.8 ? 'text-green-600 dark:text-green-400' :
                          pattern.confidence >= 0.6 ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400';

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-sm">{pattern.name}</h4>
        </div>
        {pattern.is_active ? (
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-3">{pattern.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={cn('text-xs px-2 py-1 rounded-full border', layerColors[pattern.layer as keyof typeof layerColors] || layerColors.platform)}>
          {layerLabels[pattern.layer as keyof typeof layerLabels] || pattern.layer}
        </span>
        <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
          {pattern.pattern_type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-muted-foreground">Confiança</p>
          <p className={cn('font-semibold', confidenceColor)}>
            {Math.round(pattern.confidence * 100)}%
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Ocorrências</p>
          <p className="font-semibold">{pattern.occurrences}</p>
        </div>
      </div>

      {pattern.last_triggered_at && (
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Último acionamento: {new Date(pattern.last_triggered_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
}

export function PatternsView() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    async function loadPatterns() {
      try {
        const data = await intelligenceService.getPatterns() as Pattern[];
        setPatterns(data);
      } catch (error) {
        console.error('Failed to load patterns:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPatterns();
  }, []);

  const filteredPatterns = patterns.filter((pattern) => {
    if (filter === 'all') return true;
    if (filter === 'active') return pattern.is_active;
    return !pattern.is_active;
  });

  const activeCount = patterns.filter(p => p.is_active).length;

  return (
    <div className="rounded-lg border bg-card">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Padrões Aprendidos</h3>
            {activeCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {activeCount} ativo{activeCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Filter */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
              onClick={() => setFilter('active')}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                filter === 'active'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Ativos
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                filter === 'inactive'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Inativos
            </button>
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                filter === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Todos
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Padrões identificados pelo sistema de aprendizado hierárquico
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando padrões...</span>
          </div>
        ) : filteredPatterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === 'active'
                ? 'Nenhum padrão ativo no momento'
                : filter === 'inactive'
                ? 'Nenhum padrão inativo'
                : 'Nenhum padrão aprendido ainda'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A IA aprende continuamente com suas ações
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {patterns.length > 0 && (
        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          {patterns.length} padrão{patterns.length > 1 ? 'ões' : ''} no total
        </div>
      )}
    </div>
  );
}

export default PatternsView;
