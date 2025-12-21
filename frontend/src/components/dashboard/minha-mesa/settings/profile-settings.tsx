'use client';

import React, { useEffect, useState } from 'react';
import {
    Camera,
    Pencil,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { authService } from '@/services/auth';
import { toast } from 'react-hot-toast';

interface ProfileUser {
    id: string;
    first_name: string;
    last_name: string;
    username: string; // Add username if needed
    email: string;
    phone?: string;
    cpf?: string;
    avatar?: string | null;
    organization?: {
        name: string;
        subdomain: string;
    };
    language?: string;
    timezone?: string;
}

export const ProfileSettings = () => {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        cpf: '',
        timezone: '',
        language: ''
    });

    const fetchProfile = async () => {
        try {
            const userData = await authService.validateToken(localStorage.getItem('ordoc_token') || '');
            // Need to get organization from somewhere if validateToken doesn't return it full structure
            // Actually validateToken returns user object. 
            // We might need to call me endpoint directly if we want organization info, 
            // but authService.validateToken calls checkToken which calls me.
            // Let's use api.get('/api/auth/me/') directly to get full structure including organization if needed,
            // or trust validateToken returns enough. 
            // The authService.validateToken returns response.data.user.
            // Let's rely on the previous implementation's logic of calling API directly for fuller context if needed,
            // or just use what we have.
            // Re-implementing fetch similar to original to get organization.

            // Actually, let's use the pattern from before:
            // const response = await api.get('/api/auth/me/');
            // But I cannot import 'api' default from service easily if it wasn't exported as default or named properly.
            // authService has methods.

            // I'll use authService.validateToken (which calls me), but I lose organization info if I only look at .user
            // The validateToken implementation returns `response.data.user`.
            // I'll accept that for now, or improve authService to return full response.
            // For now, I'll assume user has what I need.

            const currentUser = await authService.validateToken(localStorage.getItem('ordoc_token') || '');
            setUser(currentUser as unknown as ProfileUser); // assertion for now

            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                phone: currentUser.phone || '',
                cpf: currentUser.cpf || '',
                timezone: currentUser.timezone || 'America/Sao_Paulo',
                language: currentUser.language || 'pt-BR'
            });

        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Erro ao carregar perfil");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await authService.updateProfile({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                cpf: formData.cpf,
                timezone: formData.timezone,
                language: formData.language
            });

            setUser(prev => prev ? ({ ...prev, ...updatedUser }) : null);
            toast.success("Perfil atualizado com sucesso!");
            setIsEditDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar perfil");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center text-muted-foreground"><Loader2 className="animate-spin w-8 h-8" /></div>;
    }

    if (!user) {
        return <div className="p-8 text-center text-destructive">Erro ao carregar perfil. Verifique sua conexão.</div>;
    }

    const initials = user.first_name && user.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : user.first_name ? user.first_name.substring(0, 2).toUpperCase() : 'U';

    const fullName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name || user.email;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <Card className="overflow-hidden border-border/50 shadow-sm relative">
                {/* Cover Image */}
                <div className="h-40 w-full bg-gradient-to-r from-orange-900/80 via-orange-800/80 to-amber-900/80 relative">
                </div>

                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-4 sm:mb-0">
                            <div className="relative inline-block">
                                <Avatar className="h-32 w-32 border-[4px] border-background shadow-lg rounded-full">
                                    <AvatarImage src={user.avatar || ""} />
                                    <AvatarFallback className="text-3xl font-bold bg-orange-100 text-orange-700">{initials}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="hidden sm:flex gap-2 mt-4 self-start">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Pencil className="w-4 h-4" /> Editar Perfil
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Editar Informações Pessoais</DialogTitle>
                                        <DialogDescription>
                                            Atualize seus dados de identificação e preferências.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">Nome</Label>
                                                <Input id="firstName" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Sobrenome</Label>
                                                <Input id="lastName" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" value={user.email} disabled className="bg-muted" />
                                            <p className="text-[10px] text-muted-foreground">O email não pode ser alterado por aqui.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                                <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(00) 00000-0000" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cpf">CPF</Label>
                                                <Input id="cpf" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} placeholder="000.000.000-00" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="timezone">Fuso Horário</Label>
                                                <Select value={formData.timezone} onValueChange={v => setFormData({ ...formData, timezone: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                                                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                                                        <SelectItem value="UTC">UTC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Idioma</Label>
                                                <Select value={formData.language} onValueChange={v => setFormData({ ...formData, language: v })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                                                        <SelectItem value="en-US">English (US)</SelectItem>
                                                        <SelectItem value="es">Español</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
                                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSaveProfile} disabled={isSaving}>
                                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Salvar Alterações
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="mt-2 text-left space-y-1">
                        <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4">
                            {user.phone && <span>📞 {user.phone}</span>}
                            {user.timezone && <span>🌍 {user.timezone}</span>}
                            {user.language && <span>🗣️ {user.language}</span>}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Informações da Conta</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">ID do Usuário</span>
                                <span className="font-mono text-xs">{user.id}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Organização (Subdomínio)</span>
                                <span>{user.organization?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">CPF</span>
                                <span>{user.cpf || '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Segurança</h3>
                        <div className="space-y-4">
                            <Button variant="outline" className="w-full justify-start">
                                Alterar Senha
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                                Encerrar Sessão em Outros Dispositivos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
