'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

export default function OrganizationGroupsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard/ordoc-cloud/groups" className="text-gray-500 hover:text-gray-700">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Grupos da Organização</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <WrenchScrewdriverIcon className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Em Desenvolvimento</h2>
                        <p className="text-gray-500 mb-8">
                            Gestão de grupos internos
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/dashboard/ordoc-cloud/groups">
                                <Button variant="outline">
                                    Voltar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
