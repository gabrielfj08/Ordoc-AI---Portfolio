'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ShowOrganizationContainer from '@/components/ordoc-cloud/organizations/show';

export default function ShowOrganizationPage() {
  const params = useParams();
  const organizationId = params.id as string;

  // Validate UUID format
  const isValidUUID = React.useMemo(() => {
    if (!organizationId || typeof organizationId !== 'string') {
      return false;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(organizationId);
  }, [organizationId]);

  if (!isValidUUID) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">ID de organização inválido</p>
            <p className="text-sm">O ID fornecido não é um UUID válido.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ShowOrganizationContainer organizationId={organizationId} />
    </ProtectedRoute>
  );
}
