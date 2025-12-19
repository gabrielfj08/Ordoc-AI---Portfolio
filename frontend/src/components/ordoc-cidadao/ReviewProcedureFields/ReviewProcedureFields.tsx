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
  PencilIcon,
  CheckCircleIcon,
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

interface ReviewProcedureFieldsProps {
  procedure: ShowExternalProcedure;
  onUpdate: (values: any) => Promise<void>;
  onFinalize: () => Promise<void>;
}

interface ProcedureInfo {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function ReviewProcedureFields({ 
  procedure, 
  onUpdate, 
  onFinalize 
}: ReviewProcedureFieldsProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
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

  // Valores iniciais baseados no payload atual
  const initialValues = {
    payload: procedure.payload || [],
  };

  const validationSchema = Yup.object().shape({
    payload: Yup.array().of(
      Yup.object().shape({
        value: Yup.lazy((value, context) => {
          const field = context.parent;
          if (field.required) {
            if (field.fieldType === 'checkbox' || field.fieldType === 'attachment') {
              return Yup.array().min(1, 'Campo obrigatório');
            } else {
              return Yup.string().required('Campo obrigatório');
            }
          }
          return Yup.mixed();
        }),
      })
    ),
  });

  // Renderizar campo baseado no tipo (modo visualização ou edição)
  const renderField = (field: any, index: number, formik: any) => {
    const fieldName = `payload[${index}].value`;
    const fieldValue = formik.values.payload[index]?.value;

    const renderViewMode = () => {
      let displayValue: string | JSX.Element = 'Não preenchido';

      switch (field.fieldType) {
        case 'text':
        case 'textarea':
          displayValue = fieldValue || 'Não preenchido';
          break;
        case 'select':
          displayValue = fieldValue || 'Não selecionado';
          break;
        case 'checkbox':
          if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            displayValue = (
              <div className="flex flex-wrap gap-1">
                {fieldValue.map((value: any, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {value}
                  </Badge>
                ))}
              </div>
            );
          } else {
            displayValue = 'Nenhuma opção selecionada';
          }
          break;
        case 'attachment':
          if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            displayValue = `${fieldValue.length} arquivo(s) anexado(s)`;
          } else {
            displayValue = 'Nenhum arquivo anexado';
          }
          break;
      }

      return (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="text-sm text-gray-900">
                {typeof displayValue === 'string' ? (
                  <p className={fieldValue ? '' : 'text-gray-500 italic'}>
                    {displayValue}
                  </p>
                ) : (
                  displayValue
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderEditMode = () => {
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

        default:
          return renderViewMode();
      }
    };

    return isEditMode ? renderEditMode() : renderViewMode();
  };

  const handleUpdate = async (values: any) => {
    try {
      setIsSubmitting(true);
      await onUpdate(values);
      setIsEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar campos:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setIsFinalizing(true);
      await onFinalize();
      router.push(`/cidadao/dashboard/procedures/${procedure.id}`);
    } catch (error) {
      console.error('Erro ao finalizar procedimento:', error);
    } finally {
      setIsFinalizing(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Revisar Campos do Procedimento</h1>
          <p className="text-gray-600 mt-2">
            Revise as informações preenchidas antes de finalizar o processo.
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

        {/* Formulário de Revisão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Campos Preenchidos</span>
              {!isEditMode && initialValues.payload.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center space-x-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Editar Campos</span>
                </Button>
              )}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {isEditMode 
                ? 'Edite os campos necessários e salve as alterações.'
                : 'Revise as informações e finalize o processo quando estiver pronto.'
              }
            </p>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
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
                        Nenhum campo preenchido
                      </h3>
                      <p className="text-gray-600">
                        Este procedimento não possui campos preenchidos para revisão.
                      </p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div>
                      {isEditMode && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditMode(false)}
                          disabled={isSubmitting}
                        >
                          Cancelar Edição
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      {isEditMode && (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                      )}
                      
                      {!isEditMode && (
                        <Button
                          type="button"
                          onClick={handleFinalize}
                          disabled={isFinalizing}
                          className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>{isFinalizing ? 'Finalizando...' : 'Finalizar Procedimento'}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}