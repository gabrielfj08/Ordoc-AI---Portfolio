'use client';

import React from 'react';
import Link from 'next/link';
import {
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArchiveBoxIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function OrdocReportsSelectionPage() {
  const options = [
    {
      title: 'Meus Relatórios',
      description: 'Gerencie e visualize seus relatórios gerados',
      icon: ArchiveBoxIcon,
      href: '/dashboard/ordoc-reports/reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      borderColor: 'hover:border-indigo-600',
    },
    {
      title: 'Templates',
      description: 'Crie e edite modelos de relatórios',
      icon: DocumentDuplicateIcon,
      href: '/dashboard/ordoc-reports/templates',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'hover:border-emerald-600',
    },
    {
      title: 'Agendamentos',
      description: 'Configure envios automáticos',
      icon: CalendarIcon,
      href: '/dashboard/ordoc-reports/schedules',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'hover:border-purple-600',
    },
    {
      title: 'Exportações',
      description: 'Central de downloads e exportações em massa',
      icon: ArrowDownTrayIcon,
      href: '/dashboard/ordoc-reports/exports',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      borderColor: 'hover:border-cyan-600',
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <ArchiveBoxIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Relatórios</h1>
                  <p className="text-sm text-gray-500">OrdocReports</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {options.map((option) => (
              <Link key={option.title} href={option.href} className="group">
                <Card className={`h-full transition-all duration-200 border-2 border-transparent ${option.borderColor} hover:shadow-lg cursor-pointer`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}>
                      <option.icon className={`w-8 h-8 ${option.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-gray-900">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-500 mt-2">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-900">
                      Acessar
                      <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
