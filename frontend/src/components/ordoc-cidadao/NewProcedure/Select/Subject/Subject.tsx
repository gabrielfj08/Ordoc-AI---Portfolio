'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubjectSelectProps } from './types';

const SubjectSelect = ({ items, formik }: SubjectSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="subjectTemplateId" className="text-sm font-medium text-gray-700">
        Assunto do processo*
      </label>
      <Select
        name="subjectTemplateId"
        value={formik.values.subjectTemplateId?.toString() || ''}
        onValueChange={(value) => {
          formik.setFieldValue('subjectTemplateId', Number(value));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Nome do assunto" />
        </SelectTrigger>
        <SelectContent>
          {items?.length > 0 ? (
            items.map((item) => (
              <SelectItem key={item.value} value={item.value.toString()}>
                {item.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>
              Nenhum assunto encontrado - Selecione outro tipo de processo
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectSelect;
