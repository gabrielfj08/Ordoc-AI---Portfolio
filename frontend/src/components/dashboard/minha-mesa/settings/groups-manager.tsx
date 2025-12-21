'use client';

import React, { useState } from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    Users,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { groupsService } from '@/services/groups';
import { toast } from 'react-hot-toast';

export const GroupsManager = () => {
    const { groups, orgs, refreshData } = useSettings();
    const [editingGroup, setEditingGroup] = useState<any>(null);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        organization_id: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            organization_id: ''
        });
    };

    const handleStatusUpdate = async (groupId: string, newStatus: string) => {
        try {
            await groupsService.updateGroup(groupId, { is_active: newStatus === 'active' });
            toast.success("Status do grupo atualizado");
            refreshData();
        } catch (error) {
            toast.error("Erro ao atualizar status do grupo");
            console.error(error);
        }
    };

    const handleCreateGroup = async () => {
        if (!formData.name) {
            toast.error("Nome do grupo é obrigatório");
            return;
        }
        if (!formData.organization_id) {
            toast.error("Selecione uma organização");
            return;
        }

        setIsLoadingAction(true);
        try {
            await groupsService.createGroup({
                name: formData.name,
                description: formData.description,
                is_active: true,
                organization_id: formData.organization_id
            });
            toast.success("Grupo criado com sucesso");
            refreshData();
            setIsAddingGroup(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar grupo");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleUpdateGroup = async () => {
        if (!editingGroup) return;
        setIsLoadingAction(true);
        try {
            await groupsService.updateGroup(editingGroup.id, {
                name: formData.name,
                description: formData.description
            });
            toast.success("Grupo atualizado com sucesso");
            refreshData();
            setEditingGroup(null);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar grupo");
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Populate form on edit
    React.useEffect(() => {
        if (editingGroup) {
            setFormData({
                name: editingGroup.name,
                description: editingGroup.description || '',
                organization_id: editingGroup.organization || ''
            });
        }
    }, [editingGroup]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar grupos..." className="pl-9 bg-background" />
                </div>
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    onClick={() => { resetForm(); setIsAddingGroup(true); }}
                >
                    <Plus className="w-4 h-4" /> Novo Grupo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <Card
                        key={group.id}
                        className={`border-border/50 shadow-sm hover:shadow-md transition-shadow transition-all cursor-pointer ${group.status === 'inactive' ? 'opacity-60 grayscale bg-muted/50' : ''}`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${group.status === 'inactive' ? 'bg-gray-200' : 'bg-primary/10'}`}>
                                    <Users className={`w-5 h-5 ${group.status === 'inactive' ? 'text-gray-500' : 'text-primary'}`} />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {group.status === 'active' ? (
                                            <>
                                                <DropdownMenuItem onClick={() => setEditingGroup(group)}>
                                                    Editar Grupo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toast.success('Em breve: Interface de Permissões Detalhada')}>
                                                    Gerenciar Permissões
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(group.id, 'inactive'); }}
                                                >
                                                    Desativar
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                className="text-primary font-medium focus:text-primary focus:bg-primary/10"
                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(group.id, 'active'); }}
                                            >
                                                Reativar Grupo
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {group.name}
                                {group.status === 'inactive' && <Badge variant="secondary" className="text-xs font-normal">Inativo</Badge>}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className={`w-4 h-4 ${group.status === 'inactive' ? 'text-gray-400' : 'text-green-600'}`} />
                                <span className="text-xs font-medium text-muted-foreground">{group.permissions} Levels</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                <span className="text-xs text-muted-foreground">Membros</span>
                                <Badge variant="secondary">{group.members} usuários</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Grupo</DialogTitle>
                        <DialogDescription>
                            Modifique os detalhes e escopo deste grupo de usuários.
                        </DialogDescription>
                    </DialogHeader>
                    {editingGroup && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Grupo</Label>
                                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Descrição</Label>
                                <Input id="desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingGroup(null)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleUpdateGroup} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD GROUP DIALOG */}
            <Dialog open={isAddingGroup} onOpenChange={(open) => !open && setIsAddingGroup(false)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Grupo</DialogTitle>
                        <DialogDescription>
                            Defina os detalhes e a organização do novo departamento.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="org-select">Organização</Label>
                            <div className="relative">
                                {/* Using native select for simplicity, could be replaced by ui/select */}
                                <select
                                    id="org-select"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.organization_id}
                                    onChange={e => setFormData({ ...formData, organization_id: e.target.value })}
                                >
                                    <option value="" disabled>Selecione uma organização...</option>
                                    {orgs.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-group-name">Nome do Grupo</Label>
                            <Input id="new-group-name" placeholder="Ex: Marketing" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-group-desc">Descrição</Label>
                            <Input id="new-group-desc" placeholder="Breve descrição das responsabilidades" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingGroup(false)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateGroup} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Criar Grupo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
