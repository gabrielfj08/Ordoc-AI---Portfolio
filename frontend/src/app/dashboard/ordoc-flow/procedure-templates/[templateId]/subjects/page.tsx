'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ListOrdered,
  FileText
} from 'lucide-react';
import { subjectsService } from '@/services/ordoc-flow/subjects';
import { Subject } from '@/types/ordoc-flow';

const SubjectsListPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSubjects();
  }, [templateId]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectsService.getSubjects({
        page: 1,
        perPage: 100,
        direction: 'asc',
        order: 'order',
        status: '',
        procedure_template_id: templateId,
      });
      setSubjects(data.data);
    } catch (error) {
      console.error('Erro ao carregar subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o campo "${name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await subjectsService.deleteSubject(id);
      if (response.success) {
        loadSubjects();
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" />
        Inativo
      </span>
    );
  };

  const getFieldTypeBadge = (type: string) => {
    const typeConfig = {
      text: { color: 'blue', label: 'Texto' },
      number: { color: 'green', label: 'Número' },
      date: { color: 'purple', label: 'Data' },
      select: { color: 'orange', label: 'Seleção' },
      textarea: { color: 'indigo', label: 'Área de Texto' },
      checkbox: { color: 'pink', label: 'Checkbox' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campos do Template</h1>
              <p className="text-gray-600">Gerencie os campos do formulário do procedimento</p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Campo
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar campos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSubjects.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum campo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Tente ajustar sua busca' : 'Adicione campos ao formulário do procedimento'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/new`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adicionar Primeiro Campo
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obrigatório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subject.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ListOrdered className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{subject.order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      {subject.description && (
                        <div className="text-sm text-gray-500">{subject.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getFieldTypeBadge(subject.field_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subject.is_required ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Não
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subject.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subject.id}/edit`);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(subject.id, subject.name);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsListPage;
