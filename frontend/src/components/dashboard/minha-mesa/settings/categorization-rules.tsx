import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Edit2,
    MoreHorizontal,
    PlayCircle,
    CheckCircle2,
    XCircle,
    Tag as TagIcon,
    Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

import categorizationService, { CategorizationRule, Tag } from '@/services/categorization';

export const CategorizationRules = () => {
    const [rules, setRules] = useState<CategorizationRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<CategorizationRule | null>(null);
    const [isTestOpen, setIsTestOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        match_type: 'contains',
        pattern: '',
        target_tag: '',
        target_directory: '' // Not integrated directory picker yet
    });

    // Test states
    const [testText, setTestText] = useState('');
    const [testResult, setTestResult] = useState<boolean | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rulesData, tagsData] = await Promise.all([
                categorizationService.getRules(),
                categorizationService.getTags()
            ]);
            setRules(rulesData);
            setTags(tagsData);
        } catch (error) {
            console.error('Erro ao carregar regras', error);
            toast.error('Erro ao carregar regras de categorização');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.name || !formData.pattern) {
                toast.error("Nome e Padrão são obrigatórios");
                return;
            }

            const payload = {
                ...formData,
                target_tag: formData.target_tag || undefined
            };

            if (editingRule) {
                await categorizationService.updateRule(editingRule.id, payload);
                toast.success("Regra atualizada com sucesso");
            } else {
                await categorizationService.createRule(payload);
                toast.success("Regra criada com sucesso");
            }

            setIsCreateOpen(false);
            setEditingRule(null);
            resetForm();
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar regra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta regra?')) return;
        try {
            await categorizationService.deleteRule(id);
            toast.success("Regra excluída");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir regra");
        }
    };

    const handleToggleActive = async (rule: CategorizationRule) => {
        try {
            await categorizationService.toggleRule(rule.id, !rule.is_active);
            toast.success(rule.is_active ? "Regra desativada" : "Regra ativada");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar status");
        }
    };

    const handleTest = async () => {
        try {
            const result = await categorizationService.testRule(
                formData.pattern,
                formData.match_type,
                testText
            );
            setTestResult(result.matched);
        } catch (error) {
            toast.error("Erro ao testar regra");
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            match_type: 'contains',
            pattern: '',
            target_tag: '',
            target_directory: ''
        });
        setTestResult(null);
    };

    const openEdit = (rule: CategorizationRule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            description: rule.description || '',
            match_type: rule.match_type,
            pattern: rule.pattern,
            target_tag: rule.target_tag || '',
            target_directory: rule.target_directory || ''
        });
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Regras de Auto-Categorização</h2>
                    <p className="text-muted-foreground">
                        Defina regras para classificar documentos automaticamente após o upload.
                    </p>
                </div>
                <Button onClick={() => { resetForm(); setEditingRule(null); setIsCreateOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Nova Regra
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Regras Ativas</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar regras..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Lógica</TableHead>
                                <TableHead>Ação</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
                                </TableRow>
                            ) : rules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhuma regra encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rules.map((rule) => (
                                    <TableRow key={rule.id}>
                                        <TableCell>
                                            <div className="font-medium">{rule.name}</div>
                                            <div className="text-xs text-muted-foreground">{rule.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="mr-2">{rule.match_type}</Badge>
                                            <span className="text-sm font-mono bg-muted px-1 rounded">{rule.pattern}</span>
                                        </TableCell>
                                        <TableCell>
                                            {rule.target_tag_name && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <TagIcon className="w-3 h-3 text-blue-500" />
                                                    Apply: {rule.target_tag_name}
                                                </div>
                                            )}
                                            {rule.target_directory_path && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Folder className="w-3 h-3 text-yellow-500" />
                                                    Move to: {rule.target_directory_path}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={rule.is_active}
                                                onCheckedChange={() => handleToggleActive(rule)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(rule)}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(rule.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingRule ? 'Editar Regra' : 'Nova Regra de Categorização'}</DialogTitle>
                        <DialogDescription>
                            Configure o padrão de reconhecimento e as ações automáticas.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome da Regra</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Faturas de Fornecedores"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Correspondência</Label>
                                <Select
                                    value={formData.match_type}
                                    onValueChange={(v) => setFormData({ ...formData, match_type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="contains">Contém Texto</SelectItem>
                                        <SelectItem value="exact">Texto Exato</SelectItem>
                                        <SelectItem value="regex">Expressão Regular (Regex)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Padrão de Busca</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.pattern}
                                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                                    placeholder={formData.match_type === 'regex' ? 'Ex: ^INV-\\d{4}' : 'Ex: FATURA'}
                                />
                                <Button variant="outline" size="icon" onClick={() => setIsTestOpen(!isTestOpen)} title="Testar Regra">
                                    <PlayCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Test Area */}
                        {isTestOpen && (
                            <div className="bg-muted/50 p-4 rounded-md space-y-2 border">
                                <Label className="text-xs font-semibold">TESTAR REGRA</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={testText}
                                        onChange={(e) => { setTestText(e.target.value); setTestResult(null); }}
                                        placeholder="Cole um texto de exemplo aqui..."
                                        className="h-9"
                                    />
                                    <Button size="sm" onClick={handleTest}>Verificar</Button>
                                </div>
                                {testResult !== null && (
                                    <div className={`text-sm flex items-center gap-2 ${testResult ? 'text-green-600' : 'text-red-500'}`}>
                                        {testResult ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {testResult ? "Correspondência encontrada!" : "Nenhuma correspondência."}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Descrição (Opcional)</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <Label className="text-base font-semibold">Ações Automáticas</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2">
                                    <Label>Aplicar Tag</Label>
                                    <Select
                                        value={formData.target_tag || ''}
                                        onValueChange={(v) => setFormData({ ...formData, target_tag: v === 'none' ? '' : v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma tag..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Nenhuma --</SelectItem>
                                            {tags.map(tag => (
                                                <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mover para Diretório</Label>
                                    <Select disabled>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Em breve..." />
                                        </SelectTrigger>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground">Seleção de diretório indisponível nesta versão.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {editingRule ? 'Salvar Alterações' : 'Criar Regra'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
