'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { reportsService } from '@/services/reports';
import { ReportTemplate } from '@/types/ordoc-reports';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ReportTemplate[];
  onScheduleCreated?: (schedule: any) => void;
}

const frequencies = [
  { id: 'daily', name: 'Diário', description: 'Todo dia às 08:00' },
  { id: 'weekly', name: 'Semanal', description: 'Toda segunda-feira às 08:00' },
  { id: 'monthly', name: 'Mensal', description: 'Todo dia 1º do mês às 08:00' },
  { id: 'yearly', name: 'Anual', description: 'Todo dia 1º de janeiro às 08:00' },
];

const exportFormats = [
  { id: 'pdf', name: 'PDF' },
  { id: 'excel', name: 'Excel' },
  { id: 'csv', name: 'CSV' },
  { id: 'html', name: 'HTML' },
];

const validationSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string(),
  template_id: Yup.string().required('Selecione um template'),
  frequency: Yup.string().required('Selecione a frequência'),
  export_format: Yup.string().required('Selecione o formato'),
});

export default function ScheduleModal({ isOpen, onClose, templates, onScheduleCreated }: ScheduleModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      template_id: '',
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
      export_format: 'pdf' as 'html' | 'pdf' | 'xlsx' | 'csv',
      filters: {},
      parameters: {},
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsCreating(true);
      try {
        const schedule = await reportsService.createSchedule(values);
        
        setCreateSuccess(true);
        if (onScheduleCreated) {
          onScheduleCreated(schedule);
        }
        
        setTimeout(() => {
          setCreateSuccess(false);
          formik.resetForm();
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento. Tente novamente.');
      } finally {
        setIsCreating(false);
      }
    },
  });

  const handleClose = () => {
    if (!isCreating) {
      formik.resetForm();
      setCreateSuccess(false);
      onClose();
    }
  };

  const selectedTemplate = templates.find(t => t.id === formik.values.template_id);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Agendar Relatório
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                    disabled={isCreating}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {createSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <CheckIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Agendamento criado!</h3>
                    <p className="text-sm text-gray-600">O relatório será gerado automaticamente conforme configurado.</p>
                  </div>
                ) : (
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do agendamento *
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...formik.getFieldProps('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Relatório semanal de vendas"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        id="description"
                        {...formik.getFieldProps('description')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descreva o propósito deste agendamento..."
                      />
                    </div>

                    {/* Template Selection */}
                    <div>
                      <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 mb-2">
                        Template *
                      </label>
                      <select
                        id="template_id"
                        {...formik.getFieldProps('template_id')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um template</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.template_id && formik.errors.template_id && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.template_id}</p>
                      )}
                      {selectedTemplate && (
                        <p className="mt-1 text-xs text-gray-500">{selectedTemplate.description}</p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Frequência *
                      </label>
                      <div className="space-y-2">
                        {frequencies.map((freq) => (
                          <label key={freq.id} className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="frequency"
                              value={freq.id}
                              checked={formik.values.frequency === freq.id}
                              onChange={formik.handleChange}
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{freq.name}</div>
                              <div className="text-xs text-gray-500">{freq.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Export Format */}
                    <div>
                      <label htmlFor="export_format" className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de exportação *
                      </label>
                      <select
                        id="export_format"
                        {...formik.getFieldProps('export_format')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {exportFormats.map((format) => (
                          <option key={format.id} value={format.id}>
                            {format.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isCreating}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating || !formik.isValid}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isCreating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Criando...
                          </>
                        ) : (
                          <>
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Criar Agendamento
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
