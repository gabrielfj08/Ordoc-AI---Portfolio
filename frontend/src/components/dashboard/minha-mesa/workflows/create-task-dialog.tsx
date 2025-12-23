'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import flowService from '@/services/flow';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
    procedure: z.string().min(1, "Selecione o procedimento"),
    priority: z.enum(['normal', 'high']),
    deadline: z.string().optional(),
    assignee_id: z.string().optional(),
});

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultStatus?: string;
}

export const CreateTaskDialog = ({ open, onOpenChange, defaultStatus = 'pending' }: CreateTaskDialogProps) => {
    const queryClient = useQueryClient();

    // Fetch running procedures to populate selection
    const { data: procedures, isLoading: isLoadingProcedures } = useQuery({
        queryKey: ['procedures'],
        queryFn: () => flowService.getProcedures(),
    });

    const activeProcedures = procedures?.filter((p: any) => p.status === 'running' || p.status === 'started' || p.status === 'draft') || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            procedure: '',
            priority: 'normal',
            deadline: '',
            assignee_id: '',
        },
    });

    const createMutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            // Clean payload
            const payload = {
                ...values,
                // Kanban columns: 'pending' (map to draft?), 'in_progress' (running), 'completed' (finished)
                status: defaultStatus === 'in_progress' ? 'running' : 'draft',
                deadline: values.deadline || null,
                assignee: values.assignee_id || null,
            };

            // Remove helper keys
            // @ts-ignore
            delete payload.assignee_id;

            return flowService.createTask(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success("Tarefa criada com sucesso!");
            form.reset();
            onOpenChange(false);
        },
        onError: (err: any) => {
            console.error(err);
            toast.error("Erro ao criar tarefa. Verifique os dados.");
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova tarefa a um procedimento existente.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="procedure"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Procedimento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={isLoadingProcedures}>
                                                <SelectValue placeholder={isLoadingProcedures ? "Carregando..." : "Selecione o procedimento"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {activeProcedures.map((proc: any) => (
                                                <SelectItem key={proc.id} value={proc.id}>
                                                    {proc.procedure_template_name} - {proc.process_number}
                                                </SelectItem>
                                            ))}
                                            {activeProcedures.length === 0 && !isLoadingProcedures && (
                                                <div className="p-2 text-sm text-muted-foreground">Nenhum procedimento ativo encontrado.</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Revisar minuta..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detalhes da execução..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prioridade</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="high">Alta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prazo</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || activeProcedures.length === 0} className="bg-orange-600 hover:bg-orange-700">
                                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Tarefa
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
