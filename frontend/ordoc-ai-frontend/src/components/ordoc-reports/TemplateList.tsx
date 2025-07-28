import React from 'react';
import { ReportTemplate } from '@/services/reports';

interface TemplateListProps {
  templates: ReportTemplate[];
}

export default function TemplateList({ templates }: TemplateListProps) {
  if (!templates.length) {
    return <p className="text-gray-500">Em construção</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((tpl) => (
        <li key={tpl.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
          {tpl.description && (
            <p className="text-sm text-gray-500 mt-1">{tpl.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
