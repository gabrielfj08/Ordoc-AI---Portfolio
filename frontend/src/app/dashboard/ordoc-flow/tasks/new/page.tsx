'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileCheck, SlidersHorizontal } from 'lucide-react';
import { tasksService } from '@/services/ordoc-flow/tasks';
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

const NewTaskPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await tasksService.createTask(formData as any);

      if (response.success) {
        router.push('/dashboard/ordoc-flow/tasks');
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao manter tarefa:', error);
      setErrors({ general: 'Erro interno do servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Nova Tarefa</h2>
              <p className="text-muted-foreground">Adicione uma nova tarefa ao fluxo de trabalho.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Tarefa'}
            </Button>
          </div>
        </div>

        {/* Split Layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content (2/3) */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-gray-500" />
                  Detalhes da Tarefa
                </CardTitle>
                <CardDescription>Informações descritivas sobre a atividade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.general && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Tarefa *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Revisar Contrato de Fornecimento"
                    className="text-lg font-medium"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição / Instruções</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Forneça detalhes sobre o que precisa ser feito..."
                    className="min-h-[150px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                  Prioridade e Prazo
                </CardTitle>
                <CardDescription>Defina a urgência da tarefa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleSelectChange('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) => handleSelectChange('priority', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Data de Vencimento</Label>
                  <Input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewTaskPage;
