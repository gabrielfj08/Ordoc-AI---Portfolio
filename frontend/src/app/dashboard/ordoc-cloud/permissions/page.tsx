'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    CloudIcon,
    BuildingOfficeIcon,
    UsersIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function PermissionsDashboardPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const menuItems = [
        {
            id: 'overview',
            title: 'Visão Geral',
            description: 'Dashboard de configurações e estatísticas gerais',
            icon: ChartBarIcon,
            color: 'from-gray-600 to-gray-700',
            href: '#',
            onClick: () => setActiveSection(activeSection === 'overview' ? null : 'overview'),
            stats: '4 módulos ativos'
        },
        {
            id: 'users',
            title: 'Gestão de Usuários',
            description: 'Criar, editar e gerenciar usuários',
            icon: UsersIcon,
            color: 'from-green-600 to-green-700',
            href: '/dashboard/ordoc-cloud/users',
            stats: '12 usuários ativos'
        },
        {
            id: 'organizations',
            title: 'Organizações',
            description: 'Configurar organizações e filiais',
            icon: BuildingOfficeIcon,
            color: 'from-blue-600 to-blue-700',
            href: '/dashboard/ordoc-cloud/organizations',
            stats: '1 organização'
        },
        {
            id: 'policies',
            title: 'Políticas de Acesso',
            description: 'Definir permissões e controle de acesso',
            icon: ShieldCheckIcon,
            color: 'from-purple-600 to-purple-700',
            href: '/dashboard/ordoc-cloud/policies',
            stats: '8 políticas ativas'
        }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Permissões de Acesso</h1>
                                    <p className="text-sm text-gray-500">Gestão centralizada de permissões e controle</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2">
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    Voltar ao Dashboard
                                </Link>
                                <button className="p-2 text-gray-400 hover:text-gray-500">
                                    <Cog6ToothIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 mb-8 text-white">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl font-bold mb-4">Gestão de Permissões</h2>
                            <p className="text-indigo-100 text-lg mb-6">
                                Gerencie organizações, usuários e políticas de acesso de forma centralizada e segura.
                                Escolha uma das opções abaixo para começar.
                            </p>
                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Sistema Online</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>Última atualização: Hoje</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    onClick={item.onClick || (() => window.location.href = item.href)}
                                    className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 mb-3">
                                                    {item.description}
                                                </p>
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.stats}
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Visão Geral do Sistema</h3>
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <UsersIcon className="w-8 h-8 text-blue-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Usuários</p>
                                            <p className="text-2xl font-bold text-blue-900">0</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <BuildingOfficeIcon className="w-8 h-8 text-green-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Organizações</p>
                                            <p className="text-2xl font-bold text-green-900">1</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <ShieldCheckIcon className="w-8 h-8 text-purple-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-purple-600 font-medium">Políticas</p>
                                            <p className="text-2xl font-bold text-purple-900">0</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <ChartBarIcon className="w-8 h-8 text-orange-600 mr-3" />
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">Módulos</p>
                                            <p className="text-2xl font-bold text-orange-900">4</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Status dos Módulos</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">OrdocAir (Gestão de Documentos)</span>
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">OrdocFlow (Workflow Empresarial)</span>
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">OrdocSign (Assinatura Digital)</span>
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">OrdocReports (Relatórios)</span>
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Sistema</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">1</div>
                                <div className="text-sm text-gray-500">Organização</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">12</div>
                                <div className="text-sm text-gray-500">Usuários Ativos</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">8</div>
                                <div className="text-sm text-gray-500">Políticas</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">4</div>
                                <div className="text-sm text-gray-500">Módulos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
