'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { ShowExternalProcedure } from '@/services/ordoc-cidadao';

interface NewProcedureFieldsProps {
  procedure: ShowExternalProcedure;
  onSubmit: (values: any) => Promise<void>;
}

interface ProcedureInfo {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function NewProcedureFields({ procedure, onSubmit }: NewProcedureFieldsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Informações do procedimento
  const procedureInfo: ProcedureInfo[] = [
    {
      label: 'Solicitante',
      value: procedure.requester?.name || 'N/A',
      icon: UserIcon,
    },
    {
      label: 'Tipo de Processo',
      value: procedure.parentProcedureTemplateName || 'N/A',
      icon: BuildingOfficeIcon,
    },
    {
      label: 'Assunto do Processo',
      value: procedure.procedureTemplateName || 'N/A',
      icon: DocumentTextIcon,
    },
    {
      label: 'Grupo Responsável',
      value: procedure.responsibleGroup?.name || 'N/A',
      icon: TagIcon,
    },
  ];

  // Valores iniciais baseados no schema do procedimento
  const initialValues = {
    payload: procedure.schema?.map((field) => ({
      ...field,
      value: field.fieldType === 'checkbox' || field.fieldType === 'attachment' ? [] : '',
    })) || [],
  };

  // Validação dinâmica baseada no tipo de campo
  const getFieldValidation = (field: any) => {
    let validation = Yup.mixed();
    
    if (field.required) {
      if (field.fieldType === 'checkbox' || field.fieldType === 'attachment') {
        validation = Yup.array().min(1, 'Campo obrigatório');
      } else {
        validation = Yup.string().required('Campo obrigatório');
      }
    }
    
    return validation;
  };

  const validationSchema = Yup.object().shape({
    payload: Yup.array().of(
      Yup.object().shape({
        value: Yup.lazy((value, context) => {
          const field = context.parent;
          return getFieldValidation(field);
        }),
      })
    ),
  });

  // Renderizar campo baseado no tipo
  const renderField = (field: any, index: number, formik: any) => {
    const fieldName = `payload[${index}].value`;
    const fieldValue = formik.values.payload[index]?.value;

    switch (field.fieldType) {
      case 'text':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Field name={fieldName}>
              {({ field: formikField }: any) => (
                <Input
                  {...formikField}
                  id={fieldName}
                  placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                  className="w-full"
                />
              )}
            </Field>
            {formik.errors.payload?.[index]?.value && (
              <p className="text-sm text-red-600">{formik.errors.payload[index].value}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Field name={fieldName}>
              {({ field: formikField }: any) => (
                <Textarea
                  {...formikField}
                  id={fieldName}
                  placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                  rows={4}
                  className="w-full"
                />
              )}
            </Field>
            {formik.errors.payload?.[index]?.value && (
              <p className="text-sm text-red-600">{formik.errors.payload[index].value}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select 
              value={fieldValue || ''} 
              onValueChange={(value) => formik.setFieldValue(fieldName, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any, optionIndex: number) => (
                  <SelectItem key={optionIndex} value={option.value || option}>
                    {option.label || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.errors.payload?.[index]?.value && (
              <p className="text-sm text-red-600">{formik.errors.payload[index].value}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={index} className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option: any, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldName}-${optionIndex}`}
                    checked={fieldValue?.includes(option.value || option)}
                    onCheckedChange={(checked) => {
                      const currentValues = fieldValue || [];
                      const optionValue = option.value || option;
                      
                      if (checked) {
                        formik.setFieldValue(fieldName, [...currentValues, optionValue]);
                      } else {
                        formik.setFieldValue(fieldName, currentValues.filter((v: any) => v !== optionValue));
                      }
                    }}
                  />
                  <Label htmlFor={`${fieldName}-${optionIndex}`} className="text-sm text-gray-700">
                    {option.label || option}
                  </Label>
                </div>
              ))}
            </div>
            {formik.errors.payload?.[index]?.value && (
              <p className="text-sm text-red-600">{formik.errors.payload[index].value}</p>
            )}
          </div>
        );

      case 'attachment':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <DocumentTextIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Clique para selecionar ou arraste arquivos aqui
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
            {/* TODO: Implementar upload de arquivo */}
            {formik.errors.payload?.[index]?.value && (
              <p className="text-sm text-red-600">{formik.errors.payload[index].value}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      router.push(`/cidadao/dashboard/procedures/${procedure.id}`);
    } catch (error) {
      console.error('Erro ao salvar campos:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Preencher Campos do Procedimento</h1>
          <p className="text-gray-600 mt-2">
            Complete as informações necessárias para continuar o processo.
          </p>
        </div>

        {/* Informações do Procedimento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5" />
              <span>Informações do Procedimento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedureInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <info.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{info.label}</p>
                    <p className="text-sm text-gray-900">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Status: {procedure.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Campos */}
        <Card>
          <CardHeader>
            <CardTitle>Campos do Formulário</CardTitle>
            <p className="text-sm text-gray-600">
              Preencha todos os campos obrigatórios para continuar.
            </p>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formik) => (
                <Form className="space-y-6">
                  {formik.values.payload.length > 0 ? (
                    formik.values.payload.map((field, index) => 
                      renderField(field, index, formik)
                    )
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum campo configurado
                      </h3>
                      <p className="text-gray-600">
                        Este procedimento não possui campos adicionais para preenchimento.
                      </p>
                    </div>
                  )}

                  {formik.values.payload.length > 0 && (
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || formik.isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
                      </Button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}