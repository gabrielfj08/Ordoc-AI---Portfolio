'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

export default function ConstructionPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard/ordoc-reports" className="text-gray-500 hover:text-gray-700">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Em Desenvolvimento</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <WrenchScrewdriverIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Funcionalidade em Breve</h2>
                        <p className="text-gray-500 mb-8">
                            Estamos implementando esta funcionalidade do OrdocReports.
                        </p>
                        <Link href="/dashboard/ordoc-reports">
                            <Button variant="outline">Voltar para Relatórios</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
