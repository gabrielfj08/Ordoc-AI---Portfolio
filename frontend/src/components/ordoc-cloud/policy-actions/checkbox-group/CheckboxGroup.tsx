'use client';

import * as React from 'react';
import { PolicyActionsCheckboxGroupProps, PolicyAction } from './types';

const PolicyActionsCheckboxGroup = ({
  disabled = false,
  policyActions,
  selectedActions = [],
  onChange,
  error,
}: PolicyActionsCheckboxGroupProps) => {
  const handleActionToggle = (actionId: string) => {
    if (!disabled && onChange) {
      const isSelected = selectedActions.includes(actionId);
      if (isSelected) {
        onChange(selectedActions.filter(id => id !== actionId));
      } else {
        onChange([...selectedActions, actionId]);
      }
    }
  };

  const handleSelectAll = () => {
    if (!disabled && onChange) {
      if (selectedActions.length === policyActions.length) {
        onChange([]);
      } else {
        onChange(policyActions.map(action => action.id));
      }
    }
  };

  // Group actions by category if available
  const groupedActions = React.useMemo(() => {
    const groups: Record<string, PolicyAction[]> = {};
    
    policyActions.forEach(action => {
      const category = action.category || 'Geral';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(action);
    });
    
    return groups;
  }, [policyActions]);

  const getActionIcon = (action: PolicyAction): string => {
    if (action.icon) return action.icon;
    
    // Default icons based on action name/type
    const name = action.name.toLowerCase();
    if (name.includes('read') || name.includes('visualizar') || name.includes('view')) return '👁️';
    if (name.includes('write') || name.includes('edit') || name.includes('criar') || name.includes('editar')) return '✏️';
    if (name.includes('delete') || name.includes('excluir') || name.includes('remove')) return '🗑️';
    if (name.includes('share') || name.includes('compartilhar')) return '🔗';
    if (name.includes('approve') || name.includes('aprovar')) return '✅';
    if (name.includes('manage') || name.includes('gerenciar') || name.includes('admin')) return '⚙️';
    if (name.includes('sign') || name.includes('assinar')) return '✍️';
    if (name.includes('export') || name.includes('exportar')) return '📤';
    if (name.includes('import') || name.includes('importar')) return '📥';
    
    return '🔧';
  };

  const getAccessLevelColor = (level: number): string => {
    if (level <= 1) return 'bg-green-100 text-green-800';
    if (level <= 3) return 'bg-yellow-100 text-yellow-800';
    if (level <= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getAccessLevelText = (level: number): string => {
    if (level <= 1) return 'Baixo';
    if (level <= 3) return 'Médio';
    if (level <= 5) return 'Alto';
    return 'Crítico';
  };

  if (policyActions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📋</div>
        <p>Nenhuma ação disponível para este serviço</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with select all */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-700">
          {selectedActions.length} de {policyActions.length} ações selecionadas
        </div>
        
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={disabled}
          className={`
            text-sm font-medium px-3 py-1 rounded transition-colors
            ${disabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            }
          `}
        >
          {selectedActions.length === policyActions.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
        </button>
      </div>

      {/* Actions grouped by category */}
      <div className="space-y-6">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category} className="space-y-3">
            {Object.keys(groupedActions).length > 1 && (
              <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
                {category}
              </h4>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              {actions.map((action) => {
                const isSelected = selectedActions.includes(action.id);
                
                return (
                  <label
                    key={action.id}
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                      ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleActionToggle(action.id)}
                      disabled={disabled}
                      className="sr-only"
                    />
                    
                    {/* Checkbox visual */}
                    <div
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }
                      `}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-2xl mr-3">
                      {getActionIcon(action)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{action.name}</div>
                        <span
                          className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${getAccessLevelColor(action.accessLevel)}
                          `}
                        >
                          {getAccessLevelText(action.accessLevel)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default PolicyActionsCheckboxGroup;
