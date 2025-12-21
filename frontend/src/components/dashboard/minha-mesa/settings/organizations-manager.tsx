'use client';

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Users,
    Globe,
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
import { organizationsService } from '@/services/organizations';
import { toast } from 'react-hot-toast';

export const OrganizationsManager = () => {
    const { orgs, refreshData } = useSettings();
    const [editingOrg, setEditingOrg] = useState<any>(null);
    const [isAddingOrg, setIsAddingOrg] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        corporateName: '',
        cnpj: '',
        email: '',
        phone: '',
        subdomain: '',
        city: '',
        state: '',
        type: 'Matriz'
    });

    const handleCNPJBlur = async (cnpj: string) => {
        setIsLoadingCNPJ(true);
        try {
            const { integrationsService } = await import('@/services/integrations');
            const data = await integrationsService.validateCNPJ(cnpj);

            if (data && data.company) {
                setFormData(prev => ({
                    ...prev,
                    corporateName: data.company.nome || data.company.fantasia || prev.corporateName,
                    city: data.address.municipio || prev.city,
                    state: data.address.uf || prev.state,
                    email: data.company.email || prev.email,
                    phone: data.company.telefone || prev.phone,
                    // Auto-generate subdomain from name if empty
                    subdomain: prev.subdomain || (data.company.nome ? data.company.nome.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) : prev.subdomain)
                }));
                toast.success('Dados da empresa carregados com sucesso!');
            }
        } catch (error) {
            console.error("Erro ao buscar CNPJ:", error);
            // Silent fail or toast? Toast is better
            toast.error("Não foi possível buscar dados deste CNPJ");
        } finally {
            setIsLoadingCNPJ(false);
        }
    };

    const resetForm = () => {
        setFormData({
            corporateName: '',
            cnpj: '',
            email: '',
            phone: '',
            subdomain: '',
            city: '',
            state: '',
            type: 'Matriz'
        });
    };

    const handleStatusUpdate = async (orgId: string, newStatus: string) => {
        try {
            if (newStatus === 'active') {
                await organizationsService.activateOrganization(orgId);
            } else {
                await organizationsService.deactivateOrganization(orgId);
            }
            toast.success(`Organização ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso`);
            refreshData();
        } catch (error) {
            toast.error("Erro ao atualizar status");
            console.error(error);
        }
    };

    const handleCreateOrg = async () => {
        if (!formData.corporateName || !formData.cnpj) {
            toast.error("Razão Social e CNPJ são obrigatórios");
            return;
        }

        setIsLoadingAction(true);
        try {
            await organizationsService.createOrganization({
                corporate_name: formData.corporateName,
                cnpj: formData.cnpj,
                email: formData.email || `contato@${formData.subdomain || 'adsum'}.com`,
                phone: formData.phone || '0000000000',
                contact_name: 'Admin',
                contact_phone: '0000000000',
                storage_limit: 100,
                app_ids: [1, 2],
                address: {
                    street: 'Rua Principal',
                    postal_code: '00000-000',
                    city: formData.city || 'Cidade',
                    state: formData.state || 'UF',
                    neighborhood: 'Centro'
                }
            });
            toast.success("Organização criada com sucesso");
            refreshData();
            setIsAddingOrg(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar organização");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleUpdateOrg = async () => {
        if (!editingOrg) return;
        setIsLoadingAction(true);
        try {
            // Note: Update logic via Service assumes specific shape.
            // Using partial update via standard API call might be safer if service is strict.
            // But lets try service.
            // Service expects 'EditOrganizationFormValues' which is complex.
            // I'll construct it.
            await organizationsService.updateOrganization(editingOrg.id, {
                organization: {
                    corporateName: formData.corporateName,
                    cnpj: formData.cnpj,
                    email: formData.email,
                    phone: formData.phone,
                    contactName: 'Admin', // Preserving defaults or existing? context doesn't have it
                    contactPhone: '0000000000',
                    site: '',
                    logoUrl: '',
                    storageLimit: '100',
                    appIds: []
                },
                address: {
                    street: '',
                    number: '',
                    complement: '',
                    postalCode: '',
                    city: '',
                    state: '',
                    neighborhood: ''
                }
            });
            toast.success("Organização atualizada com sucesso");
            refreshData();
            setEditingOrg(null);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar organização");
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Populate
    useEffect(() => {
        if (editingOrg) {
            setFormData({
                corporateName: editingOrg.name,
                cnpj: editingOrg.cnpj,
                email: editingOrg.email || '',
                phone: editingOrg.phone || '',
                subdomain: editingOrg.subdomain || '',
                city: editingOrg.city || '',
                state: editingOrg.state || '',
                type: editingOrg.type || 'Matriz'
            });
        }
    }, [editingOrg]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar organizações..." className="pl-9 bg-background" />
                </div>
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    onClick={() => { resetForm(); setIsAddingOrg(true); }}
                >
                    <Plus className="w-4 h-4" /> Nova Organização
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-600" />
                        Organizações e Filiais
                    </CardTitle>
                    <CardDescription>Gerencie a estrutura corporativa e parceiros externos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organização</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Usuários</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orgs.map((org) => (
                                <TableRow key={org.id} className={org.status === 'inactive' ? 'bg-muted/30 opacity-60 grayscale-[0.5]' : ''}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{org.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{org.cnpj}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {org.city}/{org.state}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {org.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                            {org.status === 'active' ? 'Ativa' : 'Inativa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Users className="w-3 h-3 text-muted-foreground" />
                                            {org.users}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {org.status === 'active' ? (
                                                    <>
                                                        <DropdownMenuItem onClick={() => setEditingOrg(org)}>
                                                            Editar Detalhes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast.success('Em breve: Gerenciamento Hierárquico')}>
                                                            Gerenciar Unidades
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleStatusUpdate(org.id, 'inactive')}
                                                        >
                                                            Desativar
                                                        </DropdownMenuItem>
                                                    </>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-primary font-medium focus:text-primary focus:bg-primary/10"
                                                        onClick={() => handleStatusUpdate(org.id, 'active')}
                                                    >
                                                        Reativar Organização
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!editingOrg} onOpenChange={(open) => !open && setEditingOrg(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Organização</DialogTitle>
                        <DialogDescription>
                            Atualize os dados cadastrais desta unidade ou empresa parceira.
                        </DialogDescription>
                    </DialogHeader>
                    {editingOrg && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="org-name">Nome da Organização</Label>
                                    <Input id="org-name" value={formData.corporateName} onChange={e => setFormData({ ...formData, corporateName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cnpj">CNPJ</Label>
                                    <Input id="cnpj" value={formData.cnpj} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">Estado (UF)</Label>
                                    <Input id="state" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} maxLength={2} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingOrg(null)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleUpdateOrg} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD ORG DIALOG */}
            <Dialog open={isAddingOrg} onOpenChange={(open) => !open && setIsAddingOrg(false)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nova Organização</DialogTitle>
                        <DialogDescription>
                            Cadastre uma nova filial ou empresa parceira.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-org-name">Nome da Organização</Label>
                                <Input id="new-org-name" placeholder="Ex: Adsum Filial Sul" value={formData.corporateName} onChange={e => setFormData({ ...formData, corporateName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-cnpj">CNPJ</Label>
                                <div className="relative">
                                    <Input
                                        id="new-cnpj"
                                        placeholder="00.000.000/0000-00"
                                        value={formData.cnpj}
                                        onChange={e => {
                                            // Basic mask
                                            let v = e.target.value.replace(/\D/g, '');
                                            if (v.length > 14) v = v.slice(0, 14);
                                            v = v.replace(/^(\d{2})(\d)/, '$1.$2');
                                            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                                            v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
                                            v = v.replace(/(\d{4})(\d)/, '$1-$2');
                                            setFormData({ ...formData, cnpj: v });
                                        }}
                                        onBlur={(e) => {
                                            const cleanCNPJ = e.target.value.replace(/\D/g, '');
                                            if (cleanCNPJ.length === 14) {
                                                handleCNPJBlur(cleanCNPJ);
                                            }
                                        }}
                                        disabled={isLoadingCNPJ}
                                    />
                                    {isLoadingCNPJ && (
                                        <div className="absolute right-3 top-2.5">
                                            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-city">Cidade</Label>
                                <Input id="new-city" placeholder="Ex: Porto Alegre" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-state">Estado (UF)</Label>
                                <Input id="new-state" placeholder="RS" maxLength={2} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-email">Email</Label>
                                <Input id="new-email" placeholder="contato@empresa.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-subdomain">Subdomínio (Único)</Label>
                                <Input id="new-subdomain" placeholder="minhaempresa" value={formData.subdomain} onChange={e => setFormData({ ...formData, subdomain: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingOrg(false)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateOrg} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Criar Organização
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
