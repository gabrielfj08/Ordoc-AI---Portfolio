'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Activity, Settings } from 'lucide-react';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { FormErrors } from '@/types/ordoc-flow';
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

const NewProcedurePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    procedure_template_id: '',
    requester_id: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.procedure_template_id) newErrors.procedure_template_id = 'Template é obrigatório';
    if (!formData.requester_id) newErrors.requester_id = 'Requerente é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        status: formData.status as any,
        procedure_template_id: parseInt(formData.procedure_template_id),
        requester_id: parseInt(formData.requester_id),
      };

      const response = await proceduresService.createProcedure(submitData);

      if (response.success) {
        router.push('/dashboard/ordoc-flow/procedures');
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao criar:', error);
      setErrors({ general: 'Erro interno do servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Novo Procedimento</h2>
              <p className="text-muted-foreground">Preencha os dados para iniciar um workflow.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Procedimento'}
            </Button>
          </div>
        </div>

        {/* Split Layout */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Main Content - Left Column (2/3) */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-500" />
                  Informações Principais
                </CardTitle>
                <CardDescription>Dados essenciais para identificação do procedimento.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.general && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Procedimento *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Contratação de Fornecedor X"
                    className="text-lg font-medium"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o objetivo e os passos deste procedimento..."
                    className="min-h-[150px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Configurações
                </CardTitle>
                <CardDescription>Parâmetros técnicos e vinculações.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="procedure_template_id">Template Base (ID) *</Label>
                  <Input
                    type="number"
                    id="procedure_template_id"
                    name="procedure_template_id"
                    value={formData.procedure_template_id}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                  {errors.procedure_template_id && <p className="text-xs text-red-500">{errors.procedure_template_id}</p>}
                  <p className="text-[0.8rem] text-muted-foreground">ID do modelo de workflow a ser seguido.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requester_id">Requerente (ID) *</Label>
                  <Input
                    type="number"
                    id="requester_id"
                    name="requester_id"
                    value={formData.requester_id}
                    onChange={handleInputChange}
                    placeholder="456"
                  />
                  {errors.requester_id && <p className="text-xs text-red-500">{errors.requester_id}</p>}
                  <p className="text-[0.8rem] text-muted-foreground">ID do usuário solicitante.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status Inicial</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleSelectChange('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewProcedurePage;
