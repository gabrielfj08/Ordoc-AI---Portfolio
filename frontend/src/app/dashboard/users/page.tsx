'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

const UsersIcon = () => (
  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

function UsersContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <UsersIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
                <p className="text-gray-600">Controle de acesso e permissões</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UsersIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Usuários</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Sistema completo de gestão de usuários, departamentos e controle de acesso granular 
              para toda a plataforma Ordoc-AI.
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/dashboard/ordoc-cloud/users" className="block">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Usuários da Organização</h3>
                    <p className="text-blue-700 text-sm">Gerenciar usuários internos e suas permissões</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 opacity-60">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Usuários Externos</h3>
                  <p className="text-gray-600 text-sm">Em desenvolvimento - Gestão de usuários externos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Sobre a Gestão de Usuários</h4>
                <p className="text-blue-800 mb-4">
                  A gestão de usuários está integrada ao módulo <strong>OrdocCloud</strong>, onde você pode:
                </p>
                <ul className="text-blue-800 space-y-2">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Criar e gerenciar contas de usuários</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Definir permissões e políticas de acesso</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Organizar usuários por departamentos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Controlar acesso aos módulos da plataforma</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Users() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  );
}
