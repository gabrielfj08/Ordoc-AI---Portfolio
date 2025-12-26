'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Mail, Users, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: any;
}

// Mock de usuários/conexões
const MOCK_CONNECTIONS = [
    { id: '1', name: 'João Silva', email: 'joao@example.com', avatar: 'JS' },
    { id: '2', name: 'Maria Santos', email: 'maria@example.com', avatar: 'MS' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@example.com', avatar: 'PC' },
];

export function ShareDocumentDialog({ open, onOpenChange, document }: ShareDocumentDialogProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    const shareLink = `${window.location.origin}/shared/${document?.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setLinkCopied(true);
        toast.success('Link copiado para a área de transferência!');
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleToggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleShareWithUsers = () => {
        if (selectedUsers.length === 0) {
            toast.error('Selecione pelo menos um usuário');
            return;
        }

        // TODO: Implementar compartilhamento via API
        toast.success(`Documento compartilhado com ${selectedUsers.length} usuário(s)!`);
        onOpenChange(false);
    };

    const handleShareByEmail = () => {
        if (!emailInput || !emailInput.includes('@')) {
            toast.error('Digite um e-mail válido');
            return;
        }

        // TODO: Implementar envio de e-mail via API
        toast.success(`Convite enviado para ${emailInput}!`);
        setEmailInput('');
    };

    if (!document) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-orange-600" />
                        Compartilhar Documento
                    </DialogTitle>
                    <DialogDescription>
                        {document.title || document.name}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="users" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="users">
                            <Users className="w-4 h-4 mr-2" />
                            Usuários
                        </TabsTrigger>
                        <TabsTrigger value="email">
                            <Mail className="w-4 h-4 mr-2" />
                            E-mail
                        </TabsTrigger>
                        <TabsTrigger value="link">
                            <Copy className="w-4 h-4 mr-2" />
                            Link
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Selecione os usuários</Label>
                            <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-lg p-3">
                                {MOCK_CONNECTIONS.map(user => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user.id)
                                                ? 'bg-orange-50 border border-orange-200'
                                                : 'hover:bg-accent'
                                            }`}
                                        onClick={() => handleToggleUser(user.id)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">
                                            {user.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        {selectedUsers.includes(user.id) && (
                                            <Check className="w-4 h-4 text-orange-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={handleShareWithUsers}
                        >
                            Compartilhar com {selectedUsers.length} usuário(s)
                        </Button>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail do destinatário</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                O destinatário receberá um e-mail com link para acessar o documento
                            </p>
                        </div>
                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={handleShareByEmail}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar Convite
                        </Button>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Link de compartilhamento</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={shareLink}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleCopyLink}
                                    className={linkCopied ? 'bg-green-50 border-green-200' : ''}
                                >
                                    {linkCopied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Qualquer pessoa com este link poderá visualizar o documento
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
