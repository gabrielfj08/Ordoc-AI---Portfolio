'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signatureService } from '@/services/signature';
import { toast } from 'react-hot-toast';

interface SignatureDialogProps {
    isOpen: boolean;
    onClose: () => void;
    signerId: string; // ID do SignatureRequestSigner (não do documento)
    documentTitle: string;
    onSuccess?: () => void;
}

export const SignatureDialog = ({ isOpen, onClose, signerId, documentTitle, onSuccess }: SignatureDialogProps) => {
    const queryClient = useQueryClient();
    const [selectedCertId, setSelectedCertId] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Buscar certificados do usuário
    const { data: certificates, isLoading: isLoadingCerts } = useQuery({
        queryKey: ['my-certificates'],
        queryFn: () => signatureService.getMyCertificates(),
        enabled: isOpen,
    });

    // Selecionar certificado padrão automaticamente
    useEffect(() => {
        if (certificates && certificates.length > 0 && !selectedCertId) {
            const defaultCert = certificates.find(c => c.is_default);
            if (defaultCert) {
                setSelectedCertId(defaultCert.id);
            } else {
                setSelectedCertId(certificates[0].id);
            }
        }
    }, [certificates, selectedCertId]);

    // Mutação para assinar
    const signMutation = useMutation({
        mutationFn: async () => {
            // Limpar erros anteriores
            setError(null);

            if (!selectedCertId) {
                throw new Error("Selecione um certificado digital para assinar.");
            }

            return await signatureService.signDocument(signerId, {
                certificate_id: selectedCertId,
                signing_reason: reason || 'Aprovação de documento',
                signing_location: location || 'Curitiba/PR', // Poderia pegar localização do browser
            });
        },
        onSuccess: () => {
            toast.success("Documento assinado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['prioritized-signatures'] });
            queryClient.invalidateQueries({ queryKey: ['day-summary'] }); // Atualizar contadores
            if (onSuccess) onSuccess();
            onClose();
        },
        onError: (err: any) => {
            console.error("Erro ao assinar:", err);
            const msg = err.response?.data?.error || err.response?.data?.detail || err.message || "Falha ao assinar documento.";
            setError(msg);
            toast.error(`Erro ao assinar documento: ${msg}`);
        }
    });

    const handleSign = () => {
        signMutation.mutate();
    };

    // Formatar validade do certificado
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Assinar Documento Digitalmente
                    </DialogTitle>
                    <DialogDescription>
                        Você está assinando: <span className="font-semibold text-foreground">{documentTitle}</span>
                        <br />
                        Esta ação tem validade jurídica e não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label>Certificado Digital (A1)</Label>
                        {isLoadingCerts ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
                                <Loader2 className="w-4 h-4 animate-spin" /> Carregando certificados...
                            </div>
                        ) : certificates && certificates.length > 0 ? (
                            <Select value={selectedCertId} onValueChange={setSelectedCertId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um certificado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {certificates.map((cert) => (
                                        <SelectItem key={cert.id} value={cert.id}>
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">{cert.subject_name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Emissor: {cert.issuer_name.split(',')[0]} (Val: {formatDate(cert.valid_until)})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Alert variant="destructive" className="bg-orange-50 text-orange-800 border-orange-200">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription>
                                    Você não possui certificados cadastrados. Por favor,
                                    <a href="/dashboard/ordoc-sign/certificates/new" className="font-semibold underline ml-1">
                                        cadastre um certificado A1
                                    </a> antes de continuar.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input
                                id="location"
                                placeholder="Curitiba/PR"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Motivo</Label>
                            <Input
                                id="reason"
                                placeholder="Aprovação"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button
                        onClick={handleSign}
                        disabled={signMutation.isPending || !selectedCertId || (certificates?.length || 0) === 0}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                        {signMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Assinando...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" /> Assinar Digitalmente
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
