'use client';

import React, { useState } from 'react';
import { reportsService } from '@/services/reports';
import { ReportTemplate, GenerateReportData } from '@/types/ordoc-reports';
import { toast } from 'react-hot-toast';

interface Props {
  templates: ReportTemplate[];
}

export default function CreateReportForm({ templates }: Props) {
  const [form, setForm] = useState<GenerateReportData>({
    template_id: '',
    title: '',
    description: '',
    format: 'html',
    filters: {},
    parameters: {},
    expires_in_days: 30,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reportId, setReportId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const parsed = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
    setForm((prev: GenerateReportData) => ({ ...prev, [name]: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus('loading');
      const report = await reportsService.generateReport(form);
      setReportId(report?.id ?? null);
      setStatus('success');
      toast.success('Relatório gerado com sucesso');
    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error('Erro ao gerar relatório');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Template</label>
        <select
          name="template_id"
          value={form.template_id}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="">Selecione...</option>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Formato</label>
        <select
          name="format"
          value={form.format}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="html">HTML</option>
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel</option>
          <option value="csv">CSV</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Expira em (dias)</label>
        <input
          type="number"
          name="expires_in_days"
          value={form.expires_in_days}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Gerando...' : 'Gerar Relatório'}
      </button>
      {status === 'success' && (
        <p className="text-green-600">
          Relatório gerado com sucesso.{' '}
          <a
            href={reportId ? `/dashboard/ordoc-reports/reports/${reportId}` : '/dashboard/ordoc-reports/reports'}
            className="underline text-blue-600"
          >
            {reportId ? 'Abrir relatório' : 'Ver relatórios'}
          </a>
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600">Erro ao gerar relatório. Tente novamente.</p>
      )}
    </form>
  );
}
