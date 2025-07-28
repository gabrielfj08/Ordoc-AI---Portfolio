'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAssignment } from '@/services/signature';

export default function OrdocSignPage() {
  const { data: assignments, isLoading } = useQuery<SignatureAssignment[]>({
    queryKey: ['signature-assignments'],
    queryFn: () => signatureService.getMyAssignments(),
  });

  const hasAssignments = assignments && assignments.length > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  ← Voltar ao Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-bold text-gray-900">OrdocSign</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <p>Carregando...</p>
          ) : hasAssignments ? (
            <ul className="space-y-4">
              {assignments!.map((ass) => (
                <li
                  key={ass.id}
                  className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {ass.signature_request.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ass.signature_request.document_name}
                    </p>
                  </div>
                  {ass.can_sign && (
                    <Link
                      href={`/dashboard/ordoc-sign/sign/${ass.id}`}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Assinar
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhum documento pendente</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
