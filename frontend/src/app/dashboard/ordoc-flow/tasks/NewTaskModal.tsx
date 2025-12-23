import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { usersService } from '@/services/users';
import { Procedure } from '@/types/ordoc-flow';
import { User } from '@/services/users';
import { toast } from 'react-hot-toast';

const taskSchema = z.object({
  procedure: z.string().min(1, 'Selecione um procedimento'),
  name: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  priority: z.string(),
  due_date: z.string().min(1, 'Prazo é obrigatório'),
  assignee: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => Promise<void>;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadProcedures();
      loadUsers();
      reset();
    }
  }, [isOpen]);

  const loadProcedures = async () => {
    try {
      setLoadingProcedures(true);
      // Carrega procedimentos "em andamento" ou "iniciados" para criar tarefas
      const response = await proceduresService.getProcedures({
        page: 1,
        perPage: 100,
        // status: 'running', // Pode filtrar se necessário
      });
      setProcedures(response.data);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      toast.error('Erro ao carregar lista de procedimentos');
    } finally {
      setLoadingProcedures(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersService.getUsers({
        page: 1,
        per_page: 100,
        status: 'active',
      });
      setUsers(response.results);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar lista de usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);

      const payload: any = {
        name: data.name,
        description: data.description,
        procedure: data.procedure,
        priority: data.priority,
        deadline: data.due_date,
      };

      if (data.assignee) {
        payload.assignee = data.assignee;
      }

      await onSuccess(payload);
      onClose();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      // Erro tratado no componente pai
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Adicione uma nova tarefa a um procedimento existente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Procedimento */}
          <div className="space-y-2">
            <Label htmlFor="procedure">Procedimento</Label>
            <Controller
              name="procedure"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loadingProcedures}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingProcedures ? "Carregando..." : "Selecione o procedimento"} />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures.map((proc) => (
                      <SelectItem key={proc.id} value={proc.id.toString()}>
                        {proc.process_number} - {proc.procedure_template_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.procedure && (
              <p className="text-sm text-destructive">{errors.procedure.message}</p>
            )}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              placeholder="Ex: Revisar minuta..."
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes da execução..."
              className="min-h-[100px]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label htmlFor="due_date">Prazo</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
              />
              {errors.due_date && (
                <p className="text-sm text-destructive">{errors.due_date.message}</p>
              )}
            </div>
          </div>

          {/* Responsável (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Responsável (Opcional)</Label>
            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loadingUsers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingUsers ? "Carregando..." : "Selecione um responsável"} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
