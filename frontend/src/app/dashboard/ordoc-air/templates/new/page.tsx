'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    FileText,
    Type,
    AlignLeft,
    Bold,
    Italic,
    List
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function NewTemplatePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Novo Template</h2>
                            <p className="text-muted-foreground">Construa o modelo do seu documento.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                        <Button onClick={() => router.push('/dashboard/ordoc-air/templates')}>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Template
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Metadata Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Modelo</CardTitle>
                                <CardDescription>Defina os dados básicos do template.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Nome do Template</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ex: Contrato de Trabalho 2024"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoria</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="juridico">Jurídico</SelectItem>
                                            <SelectItem value="rh">Recursos Humanos</SelectItem>
                                            <SelectItem value="comercial">Comercial</SelectItem>
                                            <SelectItem value="projetos">Projetos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição (Opcional)</Label>
                                    <Textarea placeholder="Descreva a finalidade deste documento..." />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variables/Placeholders Help */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Variáveis Disponíveis</CardTitle>
                                <CardDescription>Use estas tags para preenchimento automático.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-2 text-muted-foreground">
                                    <div className="flex justify-between border-b pb-2">
                                        <code className="bg-slate-100 px-1 rounded text-slate-800">{'{{nome_usuario}}'}</code>
                                        <span>Nome do usuário atual</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <code className="bg-slate-100 px-1 rounded text-slate-800">{'{{data_hoje}}'}</code>
                                        <span>Data atual (DD/MM/AAAA)</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <code className="bg-slate-100 px-1 rounded text-slate-800">{'{{empresa}}'}</code>
                                        <span>Nome da Organização</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <code className="bg-slate-100 px-1 rounded text-slate-800">{'{{departamento}}'}</code>
                                        <span>Departamento do usuário</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editor Column */}
                    <div className="space-y-6">
                        <Card className="h-full flex flex-col">
                            <CardHeader className="pb-3">
                                <CardTitle>Editor de Conteúdo</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                {/* Toolbar Mock */}
                                <div className="flex items-center space-x-1 border rounded-t-md p-2 bg-slate-50 mb-0 border-b-0">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Bold className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Italic className="h-4 w-4" /></Button>
                                    <Separator orientation="vertical" className="h-6" />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><AlignLeft className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><List className="h-4 w-4" /></Button>
                                    <Separator orientation="vertical" className="h-6" />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Type className="h-4 w-4" /></Button>
                                    <div className="flex-1"></div>
                                </div>

                                <Textarea
                                    className="min-h-[500px] rounded-t-none resize-none font-mono text-sm leading-relaxed"
                                    placeholder="Comece a digitar o conteúdo do seu template aqui..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
