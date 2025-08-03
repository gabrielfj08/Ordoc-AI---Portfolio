'use client';

import React from 'react';
import Link from 'next/link';
import { SignatureAssignment } from '@/services/signature';

interface AssignmentListProps {
  assignments: SignatureAssignment[];
  onSign?: (id: string) => void;
}

export default function AssignmentList({ assignments, onSign }: AssignmentListProps) {
  if (!assignments.length) {
    return (
      <p className="text-gray-500">Nenhuma assinatura pendente.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {assignment.signature_request.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {assignment.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                {assignment.can_sign ? (
                  onSign ? (
                    <button
                      onClick={() => onSign(assignment.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Assinar
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/ordoc-sign/sign/${assignment.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Assinar
                    </Link>
                  )
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
