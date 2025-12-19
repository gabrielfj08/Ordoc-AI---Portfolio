'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAssignment } from '@/services/signature';
import AssignmentList from '@/components/ordoc-sign/AssignmentList';
import CertificateManager from '@/components/ordoc-sign/CertificateManager';
import DocumentSigner from '@/components/ordoc-sign/DocumentSigner';

type View = 'list' | 'certificates' | 'sign';

export default function OrdocSignPage() {
  const { data: assignments, isLoading } = useQuery<SignatureAssignment[]>({
    queryKey: ['my-signature-assignments'],
    queryFn: () => signatureService.getMyAssignments(),
  });

  const [view, setView] = useState<View>('list');
  const [signId, setSignId] = useState<string>('');

  const openSign = (id: string) => {
    setSignId(id);
    setView('sign');
  };

  const hasAssignments = (assignments && assignments.length > 0) || false;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                {view === 'list' ? (
                  <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    ← Voltar ao Dashboard / Back to Dashboard
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    ← Voltar / Back
                  </button>
                )}
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-bold text-gray-900">OrdocSign</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'list' && (
            <>
              {isLoading ? (
                <p
                  aria-live="polite"
                  className="flex items-center justify-center gap-2 text-gray-600"
                >
                  <svg
                    className="h-5 w-5 animate-spin text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Carregando / Loading...
                </p>
              ) : hasAssignments ? (
                <AssignmentList
                  assignments={assignments as SignatureAssignment[]}
                  onSign={openSign}
                />
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    Nenhuma assinatura pendente / No pending signatures
                  </p>
                </div>
              )}
              <div className="mt-6 text-right">
                <button
                  type="button"
                  onClick={() => setView('certificates')}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gerenciar Certificados / Manage Certificates
                </button>
              </div>
            </>
          )}

          {view === 'certificates' && (
            <CertificateManager onBack={() => setView('list')} />
          )}

          {view === 'sign' && signId && (
            <DocumentSigner assignmentId={signId} onBack={() => setView('list')} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
