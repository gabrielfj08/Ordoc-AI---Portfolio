import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ExternalFieldTypesProps {
  field?: {
    id: string;
    label: string;
    fieldType: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
  };
  value: any;
  onChange?: (value: any) => void;
  error?: string;
  setDisableSubmitButton?: () => void;
  disabled?: boolean;
  formik?: any;
  type?: string;
  fieldName?: string;
  label?: string;
  procedure?: any;
  options?: string[];
  index?: number;
}

const ExternalFieldTypes: React.FC<ExternalFieldTypesProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  if (!field) {
    return null;
  }

  const renderField = () => {
    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange || (() => {})}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || 'Selecione uma opção'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange || (() => {})}
            />
            <Label>{field.label}</Label>
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => onChange?.(e.target.files?.[0])}
            className={error ? 'border-red-500' : ''}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.fieldType !== 'checkbox' && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ExternalFieldTypes;
