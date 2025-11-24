'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SubjectEmpty = () => {
  return (
    <div className="space-y-2">
      <label htmlFor="subjectTemplateId" className="text-sm font-medium text-gray-700">
        Assunto do processo*
      </label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Nome do assunto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" disabled>
            Selecione primeiro o tipo de processo
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubjectEmpty;
