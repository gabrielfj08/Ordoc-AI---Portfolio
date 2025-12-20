'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import signatureService, {
  DigitalCertificate,
  UploadCertificateData,
} from '@/services/signature';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ShieldCheck,
  Upload,
  Trash2,
  CheckCircle,
  ShieldAlert,
  Star,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CertificateManagerProps {
  onBack: () => void;
}

export default function CertificateManager({ onBack }: CertificateManagerProps) {
  const { data: certificates, isLoading, refetch } = useQuery<DigitalCertificate[]>({
    queryKey: ['my-certificates'],
    queryFn: () => signatureService.getMyCertificates(),
  });

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [certificateType, setCertificateType] = useState<string>('A1');

  const uploadMutation = useMutation({
    mutationFn: (data: UploadCertificateData) =>
      signatureService.uploadCertificate(data),
    onSuccess: () => {
      setFile(null);
      setPassword('');
      setIsDefault(false);
      refetch();
      toast.success('Certificado enviado com sucesso');
    },
    onError: () => toast.error('Erro ao enviar certificado'),
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    uploadMutation.mutate({
      certificate_file: file,
      certificate_type: certificateType as 'A1' | 'A3' | 'ICP_BRASIL' | 'SELF_SIGNED',
      password,
      is_default: isDefault,
    });
  };

  const handleVerify = async (id: string) => {
    try {
      const result = await signatureService.verifyCertificate(id);
      if (result.is_valid) {
        toast.success(`Certificado válido: ${result.message}`);
      } else {
        toast.error(`Certificado inválido: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao verificar certificado');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await signatureService.setDefaultCertificate(id);
      refetch();
      toast.success('Certificado definido como padrão');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao definir padrão');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este certificado?')) return;
    try {
      await signatureService.deleteCertificate(id);
      refetch();
      toast.success('Certificado excluído');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir certificado');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Upload Form */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Novo Certificado
            </CardTitle>
            <CardDescription>
              Importe seu certificado digital (A1/Pfx).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cert-file">Arquivo (.pfx ou .p12)</Label>
                <Input
                  id="cert-file"
                  type="file"
                  accept=".pfx,.p12"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-type">Tipo</Label>
                <Select
                  value={certificateType}
                  onValueChange={setCertificateType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 (Arquivo)</SelectItem>
                    <SelectItem value="A3">A3 (Token/Card)</SelectItem>
                    <SelectItem value="ICP_BRASIL">ICP-Brasil</SelectItem>
                    <SelectItem value="SELF_SIGNED">Autoassinado (Teste)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha do Certificado</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(c) => setIsDefault(!!c)}
                />
                <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                  Definir como padrão para assinaturas
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={uploadMutation.isPending || !file}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Upload
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Meus Certificados
            </CardTitle>
            <CardDescription>
              Gerencie seus certificados digitais ativos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : certificates && certificates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titular</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{cert.subject_name}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">ID: {cert.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {cert.is_default && (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Padrão</Badge>
                          )}
                          {!cert.is_default && (
                            <Badge variant="outline">Secundário</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVerify(cert.id)}
                            title="Verificar validade"
                          >
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                          </Button>

                          {!cert.is_default && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSetDefault(cert.id)}
                              title="Definir como Padrão"
                            >
                              <Star className="h-4 w-4 text-yellow-500" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(cert.id)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <ShieldAlert className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground">
                  Você ainda não possui certificados cadastrados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
