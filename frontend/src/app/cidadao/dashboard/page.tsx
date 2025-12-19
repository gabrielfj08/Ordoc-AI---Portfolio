'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ExternalAuthService } from '@/services/ordoc-cidadao';
import type { LoginAPIResponse } from '@/services/ordoc-cidadao';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  count?: number;
}

export default function CidadaoDashboardPage() {
  const [user, setUser] = useState<LoginAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('cidadao_token');
        if (!token) {
          router.push('/cidadao/login');
          return;
        }

        const response = await ExternalAuthService.me();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('cidadao_token');
        localStorage.removeItem('cidadao_user');
        router.push('/cidadao/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cidadao_token');
    localStorage.removeItem('cidadao_user');
    router.push('/cidadao/login');
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Meus Procedimentos',
      description: 'Visualize e gerencie seus procedimentos em andamento',
      icon: DocumentTextIcon,
      href: '/cidadao/dashboard/procedures',
      color: 'bg-blue-500',
      count: 0, // TODO: Fetch real count
    },
    {
      title: 'Minhas Tarefas',
      description: 'Acompanhe tarefas atribuídas a você',
      icon: ClipboardDocumentListIcon,
      href: '/cidadao/dashboard/tasks',
      color: 'bg-green-500',
      count: 0, // TODO: Fetch real count
    },
    {
      title: 'Assinaturas Pendentes',
      description: 'Documentos aguardando sua assinatura',
      icon: PencilSquareIcon,
      href: '/cidadao/dashboard/signatures',
      color: 'bg-orange-500',
      count: 0, // TODO: Fetch real count
    },
    {
      title: 'Relatórios',
      description: 'Acesse relatórios e histórico de atividades',
      icon: ChartBarIcon,
      href: '/cidadao/dashboard/reports',
      color: 'bg-purple-500',
    },
  ];

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
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Portal do Cidadão</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Gerencie seus procedimentos, tarefas e documentos de forma simples e eficiente.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(card.href)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                {card.count !== undefined && (
                  <span className="text-2xl font-bold text-gray-900">{card.count}</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/cidadao/dashboard/procedures/new')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Novo Procedimento</div>
                <div className="text-sm text-gray-500">Iniciar um novo procedimento</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/cidadao/dashboard/profile')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserCircleIcon className="h-8 w-8 text-green-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Meu Perfil</div>
                <div className="text-sm text-gray-500">Atualizar dados pessoais</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/cidadao/dashboard/help')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Ajuda</div>
                <div className="text-sm text-gray-500">Central de ajuda e suporte</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
