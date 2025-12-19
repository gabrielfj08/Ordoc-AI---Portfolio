'use client';

import * as React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NewPolicyContainer from '@/components/ordoc-cloud/policies/new';

export default function NewPolicyPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <NewPolicyContainer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
