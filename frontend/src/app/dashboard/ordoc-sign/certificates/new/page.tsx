'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, FileKey, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { signatureService } from '@/services/signature';
import { useToast } from '@/components/ui/use-toast';

// Schema de validação
const uploadCertSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória para certificados A1'),
  is_default: z.boolean(),
});

type UploadCertFormData = z.infer<typeof uploadCertSchema>;

export default function NewCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<UploadCertFormData>({
    resolver: zodResolver(uploadCertSchema),
    defaultValues: {
      is_default: true,
      password: ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (extension !== 'pfx' && extension !== 'p12') {
        toast({
          title: "Formato inválido",
          description: "Por favor selecione um arquivo .pfx ou .p12 (Certificado A1)",
          variant: "destructive"
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: UploadCertFormData) => {
    if (!file) {
      toast({
        title: "Arquivo ausente",
        description: "Selecione o arquivo do certificado",
        variant: "destructive"
      });
      return;
    }

    if (!data.password) {
      toast({
        title: "Senha obrigatória",
        description: "A senha é necessária para validar o certificado.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      await signatureService.uploadCertificate({
        certificate_file: file,
        password: data.password,
        certificate_type: 'A1',
        is_default: data.is_default
      });

      toast({
        title: "Certificado importado!",
        description: "Seu certificado digital foi validado e salvo com sucesso.",
      });

      router.push('/dashboard/ordoc-sign/certificates');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro na importação",
        description: error.response?.data?.error || "Verifique se a senha está correta e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 h-16">
              <Link href="/dashboard/ordoc-sign/certificates" className="text-gray-500 hover:text-gray-700">
                ← Voltar
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Importar Certificado A1</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-blue-50/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-blue-900">Certificado Digital ICP-Brasil</h2>
                  <p className="text-sm text-blue-700 mt-1">
                    Importe seu certificado A1 (.pfx ou .p12) para assinar documentos com validade jurídica.
                    Sua chave privada será criptografada e armazenada com segurança máxima (AES-256).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* File Upload Area */}
                <div className="space-y-2">
                  <Label htmlFor="certificate_file" className="text-base font-medium">Arquivo do Certificado (.pfx ou .p12)</Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pfx,.p12,application/x-pkcs12"
                      onChange={handleFileChange}
                    />

                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileKey className="w-12 h-12 text-green-600 mb-3" />
                        <p className="font-medium text-green-900">{file.name}</p>
                        <p className="text-sm text-green-700">{(file.size / 1024).toFixed(2)} KB</p>
                        <Button type="button" variant="ghost" size="sm" className="mt-4 text-green-700 hover:text-green-900 hover:bg-green-100" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                          Trocar arquivo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="font-medium text-gray-700">Clique para selecionar o arquivo</p>
                        <p className="text-sm text-gray-500">Suporta apenas certificados A1 (.pfx, .p12)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha do Certificado</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha para desbloquear a chave privada"
                    {...register('password')}
                    className="w-full"
                  />
                  {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> A senha é necessária para validar e extrair os dados. Ela será salva criptografada.
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    {...register('is_default')}
                  />
                  <Label htmlFor="is_default" className="font-normal text-gray-700">Definir como certificado padrão para assinaturas</Label>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <Link href="/dashboard/ordoc-sign/certificates">
                    <Button type="button" variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" disabled={isUploading || !file} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]">
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                      </>
                    ) : (
                      'Importar Certificado'
                    )}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
