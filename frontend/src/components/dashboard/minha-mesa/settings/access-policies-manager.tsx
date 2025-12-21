'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Plus,
    Search,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Layers,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useSettings } from './settings-context';
import { policiesService } from '@/services/policies';
import { toast } from 'react-hot-toast';

export const AccessPoliciesManager = () => {
    const { policies, refreshData } = useSettings();
    const [viewingPolicy, setViewingPolicy] = useState<any>(null);
    const [isAddingPolicy, setIsAddingPolicy] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        resource: '',
        effect: 'Allow',
        actions: '*'
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            resource: '',
            effect: 'Allow',
            actions: '*'
        });
    };

    const handleStatusUpdate = async (policyId: string) => {
        try {
            await policiesService.togglePolicyStatus(policyId);
            toast.success("Status da política atualizado");
            refreshData();
        } catch (error) {
            toast.error("Erro ao atualizar status");
            console.error(error);
        }
    };

    const handleCreatePolicy = async () => {
        if (!formData.name || !formData.resource) {
            toast.error("Nome e Recurso (Escopo) são obrigatórios");
            return;
        }

        setIsLoadingAction(true);
        try {
            await policiesService.createPolicy({
                name: formData.name,
                description: formData.description,
                effect: formData.effect as 'Allow' | 'Deny',
                resource: formData.resource,
                actions: formData.actions.split(',').map(a => a.trim())
            });
            toast.success("Política criada com sucesso");
            refreshData();
            setIsAddingPolicy(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar política");
        } finally {
            setIsLoadingAction(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar políticas..." className="pl-9 bg-background" />
                </div>
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    onClick={() => { resetForm(); setIsAddingPolicy(true); }}
                >
                    <Plus className="w-4 h-4" /> Nova Política
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                    <Card
                        key={policy.id}
                        className={`border-border/50 shadow-sm hover:shadow-md transition-shadow transition-all cursor-pointer ${policy.status === 'inactive' ? 'opacity-60 grayscale bg-muted/50' : ''}`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${policy.status === 'inactive' ? 'bg-gray-200' : 'bg-primary/10'}`}>
                                    <ShieldCheck className={`w-5 h-5 ${policy.status === 'inactive' ? 'text-gray-500' : 'text-primary'}`} />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {policy.status === 'active' ? (
                                            <>
                                                <DropdownMenuItem onClick={() => setViewingPolicy(policy)}>
                                                    Visualizar Regras
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toast.success('Duplicada com sucesso!')}>
                                                    Duplicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    onClick={() => handleStatusUpdate(policy.id)}
                                                >
                                                    Desativar
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                className="text-primary font-medium focus:text-primary focus:bg-primary/10"
                                                onClick={() => handleStatusUpdate(policy.id)}
                                            >
                                                Reativar Política
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {policy.name}
                                {policy.status === 'inactive' && <Badge variant="secondary" className="text-xs font-normal">Inativa</Badge>}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">{policy.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className={`w-4 h-4 ${policy.status === 'inactive' ? 'text-gray-400' : 'text-muted-foreground'}`} />
                                <span className="text-xs font-medium text-muted-foreground">Recurso: {policy.resource}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                {/* policy.type removed/unknown from updated model */}
                                {policy.effect === 'Allow' ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Permitir
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                                        <XCircle className="w-3 h-3" /> Negar
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!viewingPolicy} onOpenChange={(open) => !open && setViewingPolicy(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{viewingPolicy?.name}</DialogTitle>
                        <DialogDescription>
                            Detalhes e definições desta política de acesso.
                        </DialogDescription>
                    </DialogHeader>
                    {viewingPolicy && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Recurso</Label>
                                    <div className="font-medium flex items-center gap-1">
                                        <Layers className="w-4 h-4 text-muted-foreground" /> {viewingPolicy.resource}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Descrição</Label>
                                <div className="text-sm bg-muted/30 p-2 rounded-md border">{viewingPolicy.description}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Efeito da Política</Label>
                                <div>
                                    {viewingPolicy.effect === 'Allow' ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Permitir Acesso</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Negar Acesso</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1 mt-2">
                                <Label className="text-xs text-muted-foreground">JSON da Regra (Preview)</Label>
                                <pre className="bg-slate-950 text-slate-50 p-3 rounded-lg text-xs font-mono overflow-auto max-h-[150px]">
                                    {JSON.stringify({
                                        version: "1.0",
                                        statement: [{
                                            effect: viewingPolicy.effect,
                                            action: viewingPolicy.actions || "*",
                                            resource: viewingPolicy.resource
                                        }]
                                    }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setViewingPolicy(null)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD POLICY DIALOG */}
            <Dialog open={isAddingPolicy} onOpenChange={(open) => !open && setIsAddingPolicy(false)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Criar Nova Política</DialogTitle>
                        <DialogDescription>
                            Defina uma nova regra de acesso e permissão.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-policy-name">Nome da Política</Label>
                            <Input id="new-policy-name" placeholder="Ex: Acesso Financeiro" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-policy-desc">Descrição</Label>
                            <Input id="new-policy-desc" placeholder="Descreva o propósito desta regra" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-scope">Recurso (Resource)</Label>
                                <Input id="new-scope" placeholder="Ex: Financeiro, Global..." value={formData.resource} onChange={e => setFormData({ ...formData, resource: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-actions">Ações (separadas por vírgula)</Label>
                                <Input id="new-actions" placeholder="Ex: read, write, *" value={formData.actions} onChange={e => setFormData({ ...formData, actions: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-effect">Efeito</Label>
                            <div className="flex items-center gap-4 border p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="effect" id="allow" checked={formData.effect === 'Allow'} onChange={() => setFormData({ ...formData, effect: 'Allow' })} />
                                    <Label htmlFor="allow" className="text-green-700 cursor-pointer">Permitir</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="effect" id="deny" checked={formData.effect === 'Deny'} onChange={() => setFormData({ ...formData, effect: 'Deny' })} />
                                    <Label htmlFor="deny" className="text-red-700 cursor-pointer">Negar</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingPolicy(false)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreatePolicy} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Criar Política
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
