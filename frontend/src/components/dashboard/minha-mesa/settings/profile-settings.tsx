'use client';

import React from 'react';
import { User, Mail, Lock, Bell, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const ProfileSettings = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-600" />
                        Informações Pessoais
                    </CardTitle>
                    <CardDescription>Atualize seus dados básicos e informações de contato.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="name" placeholder="Seu nome" defaultValue="Ricardo Silva" className="pl-9" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="seu@email.com" defaultValue="ricardo.silva@adsum.com" className="pl-9" disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-orange-600" />
                        Segurança
                    </CardTitle>
                    <CardDescription>Gerencie sua senha e métodos de autenticação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">Senha Atual</Label>
                            <Input id="current_password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new_password">Nova Senha</Label>
                            <Input id="new_password" type="password" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                            <Label>Autenticação de Dois Fatores (2FA)</Label>
                            <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança.</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Save className="w-4 h-4" /> Salvar Alterações
                </Button>
            </div>
        </div>
    );
};
