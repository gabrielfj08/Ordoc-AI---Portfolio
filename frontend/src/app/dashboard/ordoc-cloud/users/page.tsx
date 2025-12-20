'use client';

import React from 'react';
import Link from 'next/link';
import {
    UsersIcon,
    GlobeAltIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersSelectionPage() {
    const options = [
        {
            title: 'Usuários da Organização',
            description: 'Gerenciar usuários internos e suas permissões',
            icon: UsersIcon,
            href: '/dashboard/ordoc-cloud/users/organization',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            borderColor: 'hover:border-green-600',
        },
        {
            title: 'Usuários Externos',
            description: 'Em desenvolvimento - Gestão de usuários externos',
            icon: GlobeAltIcon,
            href: '/dashboard/ordoc-cloud/users/external',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'hover:border-blue-600',
        }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                {/* Back to Dashboard root or previous */}
                                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
