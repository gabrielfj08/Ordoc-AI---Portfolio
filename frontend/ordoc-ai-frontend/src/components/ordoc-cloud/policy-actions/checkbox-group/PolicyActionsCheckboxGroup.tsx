/**
 * PolicyActions CheckboxGroup Component
 * Migrated from PrinterCloud PolicyActions/CheckboxGroup/CheckboxGroup.tsx
 * 
 * Modern React 19 component for displaying policy actions as checkboxes
 * with categorization, access levels, and visual feedback.
 */

import React from 'react';
import { Field } from 'formik';
import { Check, Shield, AlertCircle, Info } from 'lucide-react';
import { PolicyActionsCheckboxGroupProps, PolicyAction } from './types';

const PolicyActionsCheckboxGroup: React.FC<PolicyActionsCheckboxGroupProps> = ({
  disabled = false,
  policyActions,
  selectedActions = [],
  onChange,
  error
}) => {
  // Group actions by category for better organization
  const groupedActions = React.useMemo(() => {
    const groups: Record<string, PolicyAction[]> = {};
    
    policyActions.forEach(action => {
      const category = action.category || 'Geral';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(action);
    });

    // Sort actions within each category by access level
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.accessLevel - b.accessLevel);
    });

    return groups;
  }, [policyActions]);

  const handleActionChange = (actionId: string, checked: boolean) => {
    if (!onChange) return;

    const newSelectedActions = checked
      ? [...selectedActions, actionId]
      : selectedActions.filter(id => id !== actionId);
    
    onChange(newSelectedActions);
  };

  const getAccessLevelColor = (level: number) => {
    if (level <= 1) return 'text-green-600 bg-green-50 border-green-200';
    if (level <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAccessLevelIcon = (level: number) => {
    if (level <= 1) return <Check className="w-4 h-4" />;
    if (level <= 3) return <Info className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const getAccessLevelText = (level: number) => {
    if (level <= 1) return 'Básico';
    if (level <= 3) return 'Intermediário';
    return 'Avançado';
  };

  if (policyActions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm">Nenhuma ação disponível para este serviço</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {Object.entries(groupedActions).map(([category, actions]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action) => {
              const isSelected = selectedActions.includes(action.id);
              const accessLevelColor = getAccessLevelColor(action.accessLevel);
              
              return (
                <label
                  key={action.id}
                  className={`
                    flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200
                    ${disabled 
                      ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                      : 'hover:bg-gray-50 hover:border-blue-300'
                    }
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-300 shadow-sm' 
                      : 'bg-white border-gray-200'
                    }
                  `}
                >
                  <div className="flex-shrink-0">
                    <Field
                      type="checkbox"
                      name="actionIds"
                      value={action.id}
                      disabled={disabled}
                      className={`
                        w-4 h-4 rounded border-gray-300 text-blue-600 
                        focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
                        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {action.name}
                      </span>
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${accessLevelColor}
                      `}>
                        {getAccessLevelIcon(action.accessLevel)}
                        {getAccessLevelText(action.accessLevel)}
                      </span>
                    </div>
                    
                    {action.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {action.description}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <div className="text-xs text-gray-400">
                      Nível {action.accessLevel}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {selectedActions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              {selectedActions.length} ação{selectedActions.length !== 1 ? 'ões' : ''} selecionada{selectedActions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyActionsCheckboxGroup;
