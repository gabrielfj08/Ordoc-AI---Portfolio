'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcedureTemplateSelectProps } from './types';

const ProcedureTemplateSelect = ({
  items,
  formik,
}: ProcedureTemplateSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="procedureTemplateId" className="text-sm font-medium text-gray-700">
        Tipo de processo*
      </label>
      <Select
        name="procedureTemplateId"
        value={formik.values.procedureTemplateId?.toString() || ''}
        onValueChange={(value) => {
          formik.setFieldValue('procedureTemplateId', Number(value));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Nome do tipo de processo" />
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
              Nenhum tipo de processo encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProcedureTemplateSelect;
