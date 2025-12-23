import React from 'react';
import Link from 'next/link';
import {
    ShieldCheckIcon,
    CheckBadgeIcon,
    ClipboardDocumentListIcon,
    KeyIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRightIcon } from 'lucide-react';

export function SignaturesView() {
    const options = [
        {
            title: 'Certificados Digitais',
            description: 'Gerencie seus certificados ICP-Brasil (A1)',
            icon: ShieldCheckIcon,
            href: '/dashboard/ordoc-sign/certificates',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'hover:border-blue-600',
        },
        {
            title: 'Validador de Assinaturas',
            description: 'Verifique a autenticidade e validade jurídica',
            icon: CheckBadgeIcon,
            href: '/dashboard/ordoc-sign/validator',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            borderColor: 'hover:border-green-600',
        },
        {
            title: 'Logs de Autenticação',
            description: 'Histórico de uso e autenticações realizadas',
            icon: ClipboardDocumentListIcon,
            href: '/dashboard/ordoc-sign/history',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            borderColor: 'hover:border-purple-600',
        },
        {
            title: 'Configurar Assinatura',
            description: 'Templates e configurações de posicionamento',
            icon: KeyIcon,
            href: '/dashboard/ordoc-sign/settings',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            borderColor: 'hover:border-orange-600',
        }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Central de Assinaturas e Certificados</h1>
                    <p className="text-sm text-gray-500">Gestão de identidade digital, validações ICP-Brasil e logs de auditoria.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {options.map((option) => (
                    <Link key={option.title} href={option.href} className="group">
                        <Card className={`h-full transition-all duration-200 border-2 border-transparent ${option.borderColor} hover:shadow-lg cursor-pointer`}>
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}>
                                    <option.icon className={`w-8 h-8 ${option.color}`} />
                                </div>
                                <CardTitle className="text-lg group-hover:text-gray-900">
                                    {option.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 mt-2">
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
    );
}
