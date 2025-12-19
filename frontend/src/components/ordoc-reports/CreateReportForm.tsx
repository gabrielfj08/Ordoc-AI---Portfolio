'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DocumentChartBarIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { reportsService } from '@/services/reports';
import { ReportTemplate, GenerateReportData } from '@/types/ordoc-reports';

interface Props {
  templates: ReportTemplate[];
  onReportGenerated?: (reportId: string) => void;
}

const validationSchema = Yup.object({
  template_id: Yup.string().required('Template é obrigatório'),
  title: Yup.string().required('Título é obrigatório'),
  description: Yup.string(),
  format: Yup.string().oneOf(['html', 'pdf', 'excel', 'csv']).required('Formato é obrigatório'),
  expires_in_days: Yup.number().min(1, 'Deve ser pelo menos 1 dia').max(365, 'Máximo 365 dias'),
});

export default function CreateReportForm({ templates, onReportGenerated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: GenerateReportData) => {
    setIsSubmitting(true);
    try {
      const report = await reportsService.generateReport(values);
      if (report?.id && onReportGenerated) {
        onReportGenerated(report.id);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <DocumentChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Criar Novo Relatório</h2>
      </div>

      <Formik
        initialValues={{
          template_id: '',
          title: '',
          description: '',
          format: 'html' as const,
          filters: {},
          parameters: {},
          expires_in_days: 30,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 mb-2">
                <FunnelIcon className="h-4 w-4 inline mr-1" />
                Template do Relatório
              </label>
              <Field
                as="select"
                id="template_id"
                name="template_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="template_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Relatório
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do relatório"
              />
              <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o objetivo do relatório"
              />
              <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Exportação
                </label>
                <Field
                  as="select"
                  id="format"
                  name="format"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="html">HTML (Visualização)</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </Field>
                <ErrorMessage name="format" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="expires_in_days" className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-1" />
                  Expira em (dias)
                </label>
                <Field
                  type="number"
                  id="expires_in_days"
                  name="expires_in_days"
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="expires_in_days" component="div" className="text-red-600 text-sm mt-1" />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => window.history.back()}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
