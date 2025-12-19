'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SimpleUserManagement from '@/components/dashboard/SimpleUserManagement';
import SimpleOrganizationManagement from '@/components/dashboard/SimpleOrganizationManagement';
import statsService from '@/services/stats';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  usersNeedingPasswordChange: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'organizations'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrganizations: 0,
    activeOrganizations: 0,
    usersNeedingPasswordChange: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load dashboard statistics (simplified version)
  const loadStats = async () => {
    try {
      setLoading(true);

      const [userStats, orgStats] = await Promise.all([
        statsService.getUserStatistics(),
        statsService.getOrganizationStatistics(),
      ]);

      setStats({
        totalUsers: userStats.total_users,
        activeUsers: userStats.active_users,
        totalOrganizations: orgStats.total_organizations,
        activeOrganizations: orgStats.active_organizations,
        usersNeedingPasswordChange: userStats.users_needing_password_change,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'blue' 
  }: { 
    title: string; 
    value: number; 
    subtitle?: string; 
    icon: React.ReactNode; 
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">
                Bem-vindo, {user?.first_name || user?.username}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleTimeString('pt-BR')}
              </div>
              <button
                onClick={loadStats}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 mt-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'organizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Organizações
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Usuários"
                value={stats.totalUsers}
                subtitle="Usuários cadastrados"
                color="blue"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Usuários Ativos"
                value={stats.activeUsers}
                subtitle="Usuários habilitados"
                color="green"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                }
              />

              <StatCard
                title="Organizações"
                value={stats.totalOrganizations}
                subtitle="Organizações cadastradas"
                color="purple"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />

              <StatCard
                title="Trocar Senha"
                value={stats.usersNeedingPasswordChange}
                subtitle="Usuários pendentes"
                color="yellow"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Gerenciar Usuários</h4>
                      <p className="text-sm text-gray-500">Criar, editar e gerenciar usuários</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('organizations')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Gerenciar Organizações</h4>
                      <p className="text-sm text-gray-500">Configurar organizações e departamentos</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={loadStats}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Atualizar Dados</h4>
                      <p className="text-sm text-gray-500">Recarregar estatísticas do sistema</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Backend</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Banco de Dados</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Autenticação</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="mt-6">
            <SimpleUserManagement />
          </div>
        )}
        {activeTab === 'organizations' && (
          <div className="mt-6">
            <SimpleOrganizationManagement />
          </div>
        )}
      </div>
    </div>
  );
}
