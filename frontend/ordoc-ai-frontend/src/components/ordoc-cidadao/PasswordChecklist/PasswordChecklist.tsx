'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordChecklistProps {
  password: string;
}

const PasswordChecklist = ({ password }: PasswordChecklistProps) => {
  const checks = [
    {
      label: 'Pelo menos 8 caracteres',
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: 'Pelo menos uma letra minúscula',
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: 'Pelo menos uma letra maiúscula',
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Pelo menos um número',
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      label: 'Pelo menos um caractere especial',
      test: (pwd: string) => /\W/.test(pwd),
    },
  ];

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
      <div className="space-y-1">
        {checks.map((check, index) => {
          const isValid = check.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  isValid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {check.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordChecklist;
