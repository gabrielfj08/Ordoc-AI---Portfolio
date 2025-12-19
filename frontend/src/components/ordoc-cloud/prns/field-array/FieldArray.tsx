'use client';

import * as React from 'react';
import { PrnFieldArrayProps, PrnExample, PrnValidationResult } from './types';

const PrnFieldArray = ({
  disabled = false,
  values = [''],
  onChange,
  service = '',
  organizationCnpj = '',
  error,
}: PrnFieldArrayProps) => {
  const [validationResults, setValidationResults] = React.useState<Record<number, PrnValidationResult>>({});

  // PRN examples for different services
  const prnExamples: PrnExample[] = [
    {
      id: 'user_specific',
      title: 'Usuário Específico',
      description: 'Acesso a um usuário específico',
      pattern: `prn:${service}:${organizationCnpj}:user/john.doe`,
      service: 'all',
    },
    {
      id: 'air_folder',
      title: 'Pasta do OrdocAir',
      description: 'Acesso a uma pasta específica no OrdocAir',
      pattern: `prn:ordoc_air:${organizationCnpj}:Meu Air/Administração/*`,
      service: 'ordoc_air',
    },
    {
      id: 'flow_requester',
      title: 'Solicitante do OrdocFlow',
      description: 'Acesso a solicitações internas no OrdocFlow',
      pattern: `prn:ordoc_flow:${organizationCnpj}:requester_internal/*`,
      service: 'ordoc_flow',
    },
    {
      id: 'sign_certificate',
      title: 'Certificado do OrdocSign',
      description: 'Acesso a certificados específicos',
      pattern: `prn:ordoc_sign:${organizationCnpj}:certificate/company-cert`,
      service: 'ordoc_sign',
    },
    {
      id: 'reports_dashboard',
      title: 'Dashboard de Relatórios',
      description: 'Acesso a dashboards específicos',
      pattern: `prn:ordoc_reports:${organizationCnpj}:dashboard/financial/*`,
      service: 'ordoc_reports',
    },
    {
      id: 'cloud_settings',
      title: 'Configurações do OrdocCloud',
      description: 'Acesso a configurações específicas',
      pattern: `prn:ordoc_cloud:${organizationCnpj}:settings/security/*`,
      service: 'ordoc_cloud',
    },
    {
      id: 'wildcard_all',
      title: 'Todos os Recursos',
      description: 'Acesso a todos os recursos do serviço',
      pattern: `prn:${service}:${organizationCnpj}:*`,
      service: 'all',
    },
  ];

  // Filter examples based on current service
  const relevantExamples = prnExamples.filter(
    example => example.service === 'all' || example.service === service
  );

  const validatePrn = (prn: string): PrnValidationResult => {
    if (!prn.trim()) {
      return { isValid: false, error: 'PRN não pode estar vazio' };
    }

    // Basic PRN format validation: prn:service:organization:resource
    const prnRegex = /^prn:[a-zA-Z_]+:[a-zA-Z0-9._-]+:.+$/;
    
    if (!prnRegex.test(prn)) {
      return {
        isValid: false,
        error: 'Formato inválido. Use: prn:serviço:organização:recurso',
        suggestions: [
          `prn:${service}:${organizationCnpj}:*`,
          `prn:${service}:${organizationCnpj}:user/*`,
        ],
      };
    }

    const parts = prn.split(':');
    if (parts.length < 4) {
      return {
        isValid: false,
        error: 'PRN deve ter pelo menos 4 partes separadas por ":"',
      };
    }

    // Check if service matches (if specified)
    if (service && parts[1] !== service) {
      return {
        isValid: false,
        error: `Serviço deve ser "${service}", encontrado "${parts[1]}"`,
        suggestions: [`prn:${service}:${parts[2]}:${parts.slice(3).join(':')}`],
      };
    }

    // Check if organization matches (if specified)
    if (organizationCnpj && parts[2] !== organizationCnpj) {
      return {
        isValid: false,
        error: `Organização deve ser "${organizationCnpj}", encontrado "${parts[2]}"`,
        suggestions: [`prn:${parts[1]}:${organizationCnpj}:${parts.slice(3).join(':')}`],
      };
    }

    return { isValid: true };
  };

  const handleValueChange = (index: number, newValue: string) => {
    if (!onChange) return;

    const newValues = [...values];
    newValues[index] = newValue;
    onChange(newValues);

    // Validate the new value
    const validation = validatePrn(newValue);
    setValidationResults(prev => ({
      ...prev,
      [index]: validation,
    }));
  };

  const handleAddField = () => {
    if (!onChange) return;

    const newPrn = service && organizationCnpj 
      ? `prn:${service}:${organizationCnpj}:*`
      : '';
    
    onChange([...values, newPrn]);
  };

  const handleRemoveField = (index: number) => {
    if (!onChange || values.length <= 1) return;

    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);

    // Remove validation result for this index
    setValidationResults(prev => {
      const newResults = { ...prev };
      delete newResults[index];
      
      // Reindex remaining results
      const reindexed: Record<number, PrnValidationResult> = {};
      Object.entries(newResults).forEach(([key, value]) => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = value;
        } else {
          reindexed[oldIndex] = value;
        }
      });
      
      return reindexed;
    });
  };

  const handleUseExample = (pattern: string) => {
    if (!onChange) return;

    const newValues = [...values];
    if (newValues.length === 1 && !newValues[0]) {
      newValues[0] = pattern;
    } else {
      newValues.push(pattern);
    }
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      {/* Instructions and Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 Instruções PRN</h4>
        <p className="text-sm text-blue-800 mb-3">
          PRN (Policy Resource Name) define os recursos aos quais esta política se aplica.
          Use o formato: <code className="bg-blue-100 px-1 rounded">prn:serviço:organização:recurso</code>
        </p>
        
        {relevantExamples.length > 0 && (
          <div>
            <p className="text-sm font-medium text-blue-900 mb-2">Exemplos:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {relevantExamples.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => handleUseExample(example.pattern)}
                  disabled={disabled}
                  className="text-left p-2 bg-white border border-blue-200 rounded text-xs hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-blue-900">{example.title}</div>
                  <div className="text-blue-700 font-mono text-xs break-all">{example.pattern}</div>
                  <div className="text-blue-600 text-xs mt-1">{example.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PRN Fields */}
      <div className="space-y-3">
        {values.map((value, index) => {
          const validation = validationResults[index];
          const hasError = validation && !validation.isValid;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    disabled={disabled}
                    placeholder={`prn:${service}:${organizationCnpj}:*`}
                    className={`
                      w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent font-mono text-sm
                      ${hasError 
                        ? 'border-red-300 focus:ring-red-500' 
                        : validation?.isValid 
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                      }
                      ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                  />
                </div>
                
                {!disabled && values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="p-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Validation feedback */}
              {validation && (
                <div className={`text-sm flex items-start space-x-1 ${
                  validation.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    {validation.isValid ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                  <div>
                    <div>{validation.isValid ? 'PRN válido' : validation.error}</div>
                    {validation.suggestions && validation.suggestions.length > 0 && (
                      <div className="mt-1">
                        <div className="text-xs">Sugestões:</div>
                        {validation.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleValueChange(index, suggestion)}
                            className="block text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 hover:bg-gray-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Field Button */}
      {!disabled && (
        <button
          type="button"
          onClick={handleAddField}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Adicionar Recurso PRN</span>
          </div>
        </button>
      )}

      {/* Global Error */}
      {error && (
        <div className="text-red-500 text-sm flex items-center">
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

export default PrnFieldArray;
