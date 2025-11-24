'use client';

import * as React from 'react';
import { cnpjMask, cpfMask, phoneNumberMask } from '@/utils/ordoc-cidadao';
import AttachmentList from './AttachmentList';

interface PayloadValueFormattingProps {
  fieldType: string;
  procedureId: number;
  value: any;
}

const PayloadValueFormatting = ({ fieldType, procedureId, value }: PayloadValueFormattingProps) => {
  const renderValue = () => {
    switch (fieldType) {
      case 'attachment':
        return <AttachmentList procedureId={procedureId} value={value} />;
      
      case 'cnpj':
        return <span className="text-gray-900">{cnpjMask(value)}</span>;
      
      case 'cpf':
        return <span className="text-gray-900">{cpfMask(value)}</span>;
      
      case 'phone':
        return <span className="text-gray-900">{phoneNumberMask(value)}</span>;
      
      case 'date':
        return (
          <span className="text-gray-900">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
            }).format(
              new Date(new Date(value).toISOString().replace('.000Z', ''))
            )}
          </span>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-1">
            {Array.isArray(value) ? value.map((item, index) => (
              <div key={index} className="text-gray-900">{item}</div>
            )) : (
              <span className="text-gray-900">{value}</span>
            )}
          </div>
        );
      
      default:
        return <span className="text-gray-900">{value}</span>;
    }
  };

  return <div>{renderValue()}</div>;
};

export default PayloadValueFormatting;
