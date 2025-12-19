'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { ExternalProcedureTemplateService, ExternalProcedureService, ExternalFieldService } from '@/services/ordoc-cidadao';
import type { 
  ExternalBaseProcedureTemplate, 
  ShowExternalProcedureTemplateAPIResponse,
  IndexExternalField,
  CreateExternalProcedurePayload 
} from '@/services/ordoc-cidadao';

export default function NewCidadaoProcedurePage() {
  const [templates, setTemplates] = useState<ExternalBaseProcedureTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ShowExternalProcedureTemplateAPIResponse | null>(null);
  const [templateFields, setTemplateFields] = useState<IndexExternalField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateFields();
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      const response = await ExternalProcedureTemplateService.index('', '', {});
      setTemplates(response.procedureTemplates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplateFields = async () => {
    if (!selectedTemplate) return;
    
    try {
      const response = await ExternalFieldService.index({ procedureTemplateId: selectedTemplate.id });
      setTemplateFields(response.data);
    } catch (error) {
      console.error('Erro ao carregar campos do template:', error);
    }
  };

  const handleTemplateSelect = async (templateId: number) => {
    try {
      const template = await ExternalProcedureTemplateService.show('', '', templateId);
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Erro ao carregar template:', error);
    }
  };

  const buildValidationSchema = () => {
    const schemaFields: any = {};
    
    templateFields.forEach(field => {
      let fieldSchema = Yup.mixed();
      
      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.name} é obrigatório`);
      }
      
      if (field.fieldType === 'email') {
        fieldSchema = Yup.string().email('Email inválido') as any;
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.name} é obrigatório`);
        }
      } else if (field.fieldType === 'number') {
        fieldSchema = Yup.number().transform((value, originalValue) => 
          originalValue === '' ? undefined : value
        ) as any;
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.name} é obrigatório`);
        }
      } else if (field.fieldType === 'date') {
        fieldSchema = Yup.date().transform((value, originalValue) => 
          originalValue === '' ? undefined : value
        ) as any;
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.name} é obrigatório`);
        }
      }
      
      schemaFields[`field_${field.id}`] = fieldSchema;
    });
    
    return Yup.object(schemaFields);
  };

  const handleSubmit = async (values: any) => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);
    try {
      const payload: CreateExternalProcedurePayload = {
        procedureTemplateId: selectedTemplate.id,
        payload: templateFields.map(field => ({
          fieldId: field.id,
          value: values[`field_${field.id}`] || null,
          label: field.name,
          fieldType: field.fieldType,
        })),
      };

      const response = await ExternalProcedureService.create('', '', payload);
      router.push(`/cidadao/dashboard/procedures/${response.id}`);
    } catch (error) {
      console.error('Erro ao criar procedimento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: IndexExternalField, formikProps: any) => {
    const fieldName = `field_${field.id}`;
    
    switch (field.fieldType) {
      case 'select':
        return (
          <Field as="select" name={fieldName} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Selecione uma opção</option>
            {field.fieldValueOptions.map(option => (
              <option key={option.id} value={option.name}>{option.name}</option>
            ))}
          </Field>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.fieldValueOptions.map(option => (
              <label key={option.id} className="flex items-center">
                <Field
                  type="checkbox"
                  name={fieldName}
                  value={option.name}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.name}</span>
              </label>
            ))}
          </div>
        );
      
      case 'textarea':
        return (
          <Field
            as="textarea"
            name={fieldName}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              formikProps.setFieldValue(fieldName, file);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'date':
        return (
          <Field
            type="date"
            name={fieldName}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'number':
        return (
          <Field
            type="number"
            name={fieldName}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      case 'email':
        return (
          <Field
            type="email"
            name={fieldName}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      default:
        return (
          <Field
            type="text"
            name={fieldName}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard/procedures')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Novo Procedimento</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTemplate ? (
          /* Template Selection */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Selecione um Template de Procedimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="text-xs text-gray-500">
                    Criado em: {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Procedure Form */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setTemplateFields([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Trocar Template
              </button>
            </div>

            <Formik
              initialValues={templateFields.reduce((acc, field) => {
                acc[`field_${field.id}`] = '';
                return acc;
              }, {} as any)}
              validationSchema={buildValidationSchema()}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formikProps) => (
                <Form className="space-y-6">
                  {templateFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field, formikProps)}
                      <ErrorMessage 
                        name={`field_${field.id}`} 
                        component="div" 
                        className="mt-1 text-sm text-red-600" 
                      />
                    </div>
                  ))}

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => router.push('/cidadao/dashboard/procedures')}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>{isSubmitting ? 'Criando...' : 'Criar Procedimento'}</span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </main>
    </div>
  );
}
