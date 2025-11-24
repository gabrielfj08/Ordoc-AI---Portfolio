'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ExternalFieldTypesProps {
  setDisableSubmitButton: () => void;
  disabled?: boolean;
  formik: any;
  type: string;
  fieldName: string;
  label: string;
  value: any;
  procedure: any;
  options?: string[];
  index: number;
}

const ExternalFieldTypes = ({
  disabled = false,
  formik,
  type,
  fieldName,
  label,
  value,
  options = [],
  index,
}: ExternalFieldTypesProps) => {
  const fieldId = `field_${index}`;

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            id={fieldId}
            name={fieldId}
            type={type === 'number' ? 'number' : 'text'}
            placeholder={`Digite ${label.toLowerCase()}`}
            disabled={disabled}
            value={formik.values[fieldId] || ''}
            onChange={formik.handleChange}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            name={fieldId}
            placeholder={`Digite ${label.toLowerCase()}`}
            disabled={disabled}
            value={formik.values[fieldId] || ''}
            onChange={formik.handleChange}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            name={fieldId}
            value={formik.values[fieldId] || ''}
            onValueChange={(value) => formik.setFieldValue(fieldId, value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, optIndex) => (
                <SelectItem key={optIndex} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            name={fieldId}
            type="date"
            disabled={disabled}
            value={formik.values[fieldId] || ''}
            onChange={formik.handleChange}
          />
        );

      case 'file':
        return (
          <Input
            id={fieldId}
            name={fieldId}
            type="file"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              formik.setFieldValue(fieldId, file);
            }}
          />
        );

      default:
        return (
          <Input
            id={fieldId}
            name={fieldId}
            placeholder={`Digite ${label.toLowerCase()}`}
            disabled={disabled}
            value={formik.values[fieldId] || ''}
            onChange={formik.handleChange}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {renderField()}
    </div>
  );
};

export default ExternalFieldTypes;
