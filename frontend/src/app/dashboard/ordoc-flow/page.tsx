'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  FileText, 
  Workflow, 
  ClipboardList, 
  UserCheck, 
  CheckSquare,
  Settings,
  FolderOpen
} from 'lucide-react';

const OrdocFlowDashboard = () => {
  const router = useRouter();

  const modules = [
    {
      title: 'Grupos',
      description: 'Gerenciar grupos de usuários e permissões',
      icon: Users,
      path: '/dashboard/ordoc-flow/groups',
      color: 'bg-blue-500',
    },
    {
      title: 'Templates de Procedimento',
      description: 'Criar e gerenciar templates de procedimentos',
      icon: FileText,
      path: '/dashboard/ordoc-flow/procedure-templates',
      color: 'bg-green-500',
    },
    {
      title: 'Procedimentos',
      description: 'Visualizar e gerenciar procedimentos ativos',
      icon: Workflow,
      path: '/dashboard/ordoc-flow/procedures',
      color: 'bg-purple-500',
    },
    {
      title: 'Requerentes',
      description: 'Gerenciar requerentes do sistema',
      icon: UserCheck,
      path: '/dashboard/ordoc-flow/requesters',
      color: 'bg-orange-500',
    },
    {
      title: 'Assinaturas',
      description: 'Controlar assinaturas e aprovações',
      icon: CheckSquare,
      path: '/dashboard/ordoc-flow/signatures',
      color: 'bg-red-500',
    },
    {
      title: 'Templates de Tarefa',
      description: 'Configurar templates de tarefas',
      icon: ClipboardList,
      path: '/dashboard/ordoc-flow/task-templates',
      color: 'bg-indigo-500',
    },
    {
      title: 'Tarefas',
      description: 'Acompanhar tarefas em andamento',
      icon: FolderOpen,
      path: '/dashboard/ordoc-flow/tasks',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ordoc Flow
        </h1>
        <p className="text-gray-600">
          Sistema de gestão de workflows e procedimentos empresariais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.path}
              onClick={() => router.push(module.path)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`${module.color} p-3 rounded-lg mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {module.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {module.description}
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <span className="text-sm text-blue-600 font-medium hover:text-blue-800">
                  Acessar módulo →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Sobre o Ordoc Flow
        </h2>
        <p className="text-gray-700 leading-relaxed">
          O Ordoc Flow é um sistema completo de gestão de workflows empresariais que permite 
          criar, gerenciar e acompanhar procedimentos organizacionais de forma eficiente. 
          Com recursos avançados de automação, controle de permissões e rastreabilidade, 
          o sistema oferece uma solução robusta para otimizar processos internos.
        </p>
      </div>
    </div>
  );
};

export default OrdocFlowDashboard;