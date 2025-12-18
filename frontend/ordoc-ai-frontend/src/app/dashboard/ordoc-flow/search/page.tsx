'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Users,
  ListTodo,
  Folder,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface SearchResult {
  id: number;
  type: 'procedure' | 'template' | 'requester' | 'task' | 'group';
  title: string;
  description?: string;
  status?: string;
  created_at: string;
}

const SearchPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);

    // Simulação de busca - em produção, você faria chamadas aos serviços
    setTimeout(() => {
      // Aqui você implementaria a lógica real de busca usando os serviços
      setResults([]);
      setLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'procedure':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'template':
        return <Folder className="w-5 h-5 text-purple-600" />;
      case 'requester':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'task':
        return <ListTodo className="w-5 h-5 text-orange-600" />;
      case 'group':
        return <Users className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      procedure: { color: 'blue', label: 'Procedimento' },
      template: { color: 'purple', label: 'Template' },
      requester: { color: 'green', label: 'Requerente' },
      task: { color: 'orange', label: 'Tarefa' },
      group: { color: 'indigo', label: 'Grupo' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      active: { icon: CheckCircle, color: 'green', label: 'Ativo' },
      inactive: { icon: XCircle, color: 'red', label: 'Inativo' },
      draft: { icon: Clock, color: 'gray', label: 'Rascunho' },
      completed: { icon: CheckCircle, color: 'green', label: 'Concluído' },
      cancelled: { icon: XCircle, color: 'red', label: 'Cancelado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleResultClick = (result: SearchResult) => {
    const routes = {
      procedure: `/dashboard/ordoc-flow/procedures/${result.id}`,
      template: `/dashboard/ordoc-flow/procedure-templates/${result.id}`,
      requester: `/dashboard/ordoc-flow/requesters/${result.id}`,
      task: `/dashboard/ordoc-flow/tasks/${result.id}`,
      group: `/dashboard/ordoc-flow/groups/${result.id}`,
    };

    const route = routes[result.type];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Busca Global</h1>
        <p className="text-gray-600">Pesquise por procedimentos, templates, requerentes e muito mais</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Digite sua busca..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar
                </>
              )}
            </button>
          </div>

          {/* Type Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('procedure')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'procedure'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Procedimentos
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('template')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'template'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Templates
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('requester')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'requester'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Requerentes
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('task')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'task'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tarefas
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('group')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'group'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grupos
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {query && (
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Buscando resultados...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {result.title}
                          </h3>
                          {getTypeBadge(result.type)}
                          {getStatusBadge(result.status)}
                        </div>
                        {result.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {result.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Criado em {new Date(result.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou use filtros diferentes
              </p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Digite algo para começar a busca
          </h3>
          <p className="text-gray-600">
            Use a barra de pesquisa acima para encontrar procedimentos, templates, requerentes e muito mais
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
