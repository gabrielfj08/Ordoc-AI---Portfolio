'use client';

import * as React from 'react';
import { PolicyEffectsRadioGroupProps, PolicyEffect } from './types';

const PolicyEffectsRadioGroup = ({
  disabled = false,
  value,
  onChange,
  error,
}: PolicyEffectsRadioGroupProps) => {
  const effects: PolicyEffect[] = [
    {
      id: 'allow',
      name: 'Permitir',
      description: 'Concede acesso aos recursos especificados',
      color: 'green',
      icon: '✓',
    },
    {
      id: 'deny',
      name: 'Negar',
      description: 'Nega acesso aos recursos especificados',
      color: 'red',
      icon: '✗',
    },
  ];

  const handleChange = (effectId: string) => {
    if (!disabled && onChange) {
      onChange(effectId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {effects.map((effect) => (
          <label
            key={effect.id}
            className={`
              flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              ${
                value === effect.id
                  ? effect.color === 'green'
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-red-500 bg-red-50 ring-2 ring-red-200'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
          >
            <input
              type="radio"
              name="effect"
              value={effect.id}
              checked={value === effect.id}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            
            {/* Icon */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3
                ${
                  effect.color === 'green'
                    ? value === effect.id
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                    : value === effect.id
                    ? 'bg-red-500'
                    : 'bg-gray-300'
                }
              `}
            >
              {effect.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{effect.name}</div>
              <div className="text-sm text-gray-600 mt-1">{effect.description}</div>
            </div>
            
            {/* Radio indicator */}
            <div
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${
                  value === effect.id
                    ? effect.color === 'green'
                      ? 'border-green-500 bg-green-500'
                      : 'border-red-500 bg-red-500'
                    : 'border-gray-300'
                }
              `}
            >
              {value === effect.id && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-2 flex items-center">
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

export default PolicyEffectsRadioGroup;
