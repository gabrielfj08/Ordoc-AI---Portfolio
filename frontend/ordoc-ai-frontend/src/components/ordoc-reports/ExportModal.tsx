'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, DocumentArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { reportsService } from '@/services/reports';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId?: string;
  reportData?: any;
  title?: string;
}

const exportFormats = [
  { id: 'pdf', name: 'PDF', description: 'Documento portátil para impressão' },
  { id: 'excel', name: 'Excel', description: 'Planilha para análise de dados' },
  { id: 'csv', name: 'CSV', description: 'Dados separados por vírgula' },
  { id: 'json', name: 'JSON', description: 'Formato estruturado para APIs' },
];

const validationSchema = Yup.object({
  format: Yup.string().required('Selecione um formato'),
  includeCharts: Yup.boolean(),
  includeRawData: Yup.boolean(),
  fileName: Yup.string()
    .min(1, 'Nome do arquivo é obrigatório')
    .max(100, 'Nome muito longo')
    .matches(/^[a-zA-Z0-9_\-\s]+$/, 'Nome contém caracteres inválidos'),
});

export default function ExportModal({ isOpen, onClose, reportId, reportData, title }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      format: 'pdf',
      includeCharts: true,
      includeRawData: false,
      fileName: title ? title.replace(/[^a-zA-Z0-9_\-\s]/g, '') : 'relatorio',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsExporting(true);
      try {
        let downloadUrl: string;
        
        if (reportId) {
          // Export existing report
          downloadUrl = await reportsService.exportReport(reportId, values.format, {
            includeCharts: values.includeCharts,
            includeRawData: values.includeRawData,
            fileName: values.fileName,
          });
        } else if (reportData) {
          // Export report data directly
          downloadUrl = await reportsService.exportReportData(reportData, values.format, {
            includeCharts: values.includeCharts,
            includeRawData: values.includeRawData,
            fileName: values.fileName,
          });
        } else {
          throw new Error('Nenhum relatório ou dados fornecidos para exportação');
        }

        // Trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${values.fileName}.${values.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportSuccess(true);
        setTimeout(() => {
          setExportSuccess(false);
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Erro na exportação:', error);
        alert('Erro ao exportar relatório. Tente novamente.');
      } finally {
        setIsExporting(false);
      }
    },
  });

  const handleClose = () => {
    if (!isExporting) {
      formik.resetForm();
      setExportSuccess(false);
      onClose();
    }
  };

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Exportar Relatório
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                    disabled={isExporting}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {exportSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <CheckIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Exportação concluída!</h3>
                    <p className="text-sm text-gray-600">O download do arquivo foi iniciado.</p>
                  </div>
                ) : (
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* File Name */}
                    <div>
                      <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do arquivo
                      </label>
                      <input
                        type="text"
                        id="fileName"
                        {...formik.getFieldProps('fileName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="nome-do-relatorio"
                      />
                      {formik.touched.fileName && formik.errors.fileName && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.fileName}</p>
                      )}
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Formato de exportação
                      </label>
                      <div className="space-y-2">
                        {exportFormats.map((format) => (
                          <label key={format.id} className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="format"
                              value={format.id}
                              checked={formik.values.format === format.id}
                              onChange={formik.handleChange}
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{format.name}</div>
                              <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Export Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Opções de exportação
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...formik.getFieldProps('includeCharts')}
                            checked={formik.values.includeCharts}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Incluir gráficos e visualizações</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            {...formik.getFieldProps('includeRawData')}
                            checked={formik.values.includeRawData}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Incluir dados brutos</span>
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isExporting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isExporting || !formik.isValid}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isExporting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Exportando...
                          </>
                        ) : (
                          <>
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Exportar
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
