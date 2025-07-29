'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAssignment } from '@/services/signature';
import AssignmentList from '@/components/ordoc-sign/AssignmentList';

export default function OrdocSignPage() {
  const { data: assignments, isLoading } = useQuery<SignatureAssignment[]>({
    queryKey: ['my-signature-assignments'],
    queryFn: () => signatureService.getMyAssignments(),
  });

  const hasAssignments = (assignments && assignments.length > 0) || false;

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
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-bold text-gray-900">OrdocSign</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <p>Carregando...</p>
          ) : hasAssignments ? (
            <AssignmentList assignments={assignments as SignatureAssignment[]} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhuma assinatura pendente</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
