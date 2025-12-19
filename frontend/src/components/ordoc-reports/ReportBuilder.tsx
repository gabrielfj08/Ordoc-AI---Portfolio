'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  PlusIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { reportsService } from '@/services/reports';

interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  label: string;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
  dataSource: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

interface ReportTemplate {
  id?: string;
  name: string;
  description: string;
  category: string;
  fields: ReportField[];
  filters: ReportFilter[];
  charts: ChartConfig[];
  layout: 'single_column' | 'two_columns' | 'dashboard';
  isActive: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string().required('Descrição é obrigatória'),
  category: Yup.string().required('Categoria é obrigatória'),
  fields: Yup.array().min(1, 'Pelo menos um campo é obrigatório'),
  charts: Yup.array().min(1, 'Pelo menos um gráfico é obrigatório'),
});

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção' },
  { value: 'boolean', label: 'Sim/Não' },
];

const CHART_TYPES = [
  { value: 'bar', label: 'Gráfico de Barras' },
  { value: 'line', label: 'Gráfico de Linhas' },
  { value: 'pie', label: 'Gráfico de Pizza' },
  { value: 'table', label: 'Tabela' },
];

const OPERATORS = [
  { value: 'equals', label: 'Igual a' },
  { value: 'contains', label: 'Contém' },
  { value: 'greater_than', label: 'Maior que' },
  { value: 'less_than', label: 'Menor que' },
  { value: 'between', label: 'Entre' },
  { value: 'in', label: 'Em' },
];

interface Props {
  template?: ReportTemplate;
  onSave: (template: ReportTemplate) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function ReportBuilder({ template, onSave, onCancel, initialData, isEditing }: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'filters' | 'charts' | 'preview'>('basic');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const initialValues: ReportTemplate = initialData || template || {
    name: '',
    description: '',
    category: '',
    fields: [],
    filters: [],
    charts: [],
    layout: 'single_column',
    isActive: true,
  };

  const handlePreview = async (values: ReportTemplate) => {
    setIsPreviewLoading(true);
    try {
      const preview = await reportsService.previewTemplate(values.id || '', values);
      setPreviewData(preview);
      setActiveTab('preview');
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      alert('Erro ao gerar preview do relatório');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: DocumentChartBarIcon },
    { id: 'fields', label: 'Campos', icon: Cog6ToothIcon },
    { id: 'filters', label: 'Filtros', icon: FunnelIcon },
    { id: 'charts', label: 'Gráficos', icon: DocumentChartBarIcon },
    { id: 'preview', label: 'Preview', icon: EyeIcon },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Tab: Informações Básicas */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Template
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Relatório de Vendas Mensais"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Categoria
                        </label>
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="financial">Financeiro</option>
                          <option value="operational">Operacional</option>
                          <option value="analytics">Analytics</option>
                          <option value="compliance">Compliance</option>
                          <option value="custom">Personalizado</option>
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-red-600 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descreva o objetivo e conteúdo do relatório..."
                      />
                      <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label htmlFor="layout" className="block text-sm font-medium text-gray-700 mb-2">
                          Layout
                        </label>
                        <Field
                          as="select"
                          id="layout"
                          name="layout"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="single_column">Coluna Única</option>
                          <option value="two_columns">Duas Colunas</option>
                          <option value="dashboard">Dashboard</option>
                        </Field>
                      </div>

                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Template ativo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Campos */}
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Campos do Relatório</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newField: ReportField = {
                          id: generateFieldId(),
                          name: '',
                          label: '',
                          type: 'text',
                          required: false,
                        };
                        setFieldValue('fields', [...values.fields, newField]);
                      }}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Adicionar Campo
                    </button>
                  </div>

                  <FieldArray name="fields">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.fields.map((field, index) => (
                          <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-medium text-gray-900">
                                Campo {index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nome do Campo
                                </label>
                                <Field
                                  type="text"
                                  name={`fields.${index}.name`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="ex: total_vendas"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Rótulo
                                </label>
                                <Field
                                  type="text"
                                  name={`fields.${index}.label`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="ex: Total de Vendas"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tipo
                                </label>
                                <Field
                                  as="select"
                                  name={`fields.${index}.type`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {FIELD_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center">
                              <Field
                                type="checkbox"
                                name={`fields.${index}.required`}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 block text-sm text-gray-900">
                                Campo obrigatório
                              </label>
                            </div>

                            {field.type === 'select' && (
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Opções (uma por linha)
                                </label>
                                <Field
                                  as="textarea"
                                  name={`fields.${index}.options`}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        {values.fields.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p>Nenhum campo adicionado ainda</p>
                            <p className="text-sm">Clique em "Adicionar Campo" para começar</p>
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePreview(values)}
                    disabled={isPreviewLoading}
                    className="px-4 py-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isPreviewLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                        Gerando Preview...
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Preview
                      </>
                    )}
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                    Salvar Template
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
