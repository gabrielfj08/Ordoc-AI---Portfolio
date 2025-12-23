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
    procedure_template: z.string().min(1, "Selecione um modelo"),
    priority: z.enum(['normal', 'high']),
});

interface CreateProcedureDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateProcedureDialog = ({ open, onOpenChange }: CreateProcedureDialogProps) => {
    const queryClient = useQueryClient();

    const { data: templates, isLoading: isLoadingTemplates } = useQuery({
        queryKey: ['procedure-templates'],
        queryFn: () => flowService.getProcedureTemplates(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            procedure_template: '',
            priority: 'normal',
        },
    });

    const createMutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return flowService.createProcedure(values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procedures'] });
            toast.success("Procedimento iniciado com sucesso!");
            form.reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Erro ao iniciar procedimento.");
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo Procedimento</DialogTitle>
                    <DialogDescription>
                        Selecione um modelo para iniciar um novo fluxo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="procedure_template"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modelo de Procedimento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={isLoadingTemplates}>
                                                <SelectValue placeholder={isLoadingTemplates ? "Carregando..." : "Selecione o modelo"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {templates?.map((tpl: any) => (
                                                <SelectItem key={tpl.id} value={tpl.id}>
                                                    {tpl.name}
                                                </SelectItem>
                                            ))}
                                            {(!templates || templates.length === 0) && !isLoadingTemplates && (
                                                <div className="p-2 text-sm text-muted-foreground">Nenhum modelo disponível</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-700">
                                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Iniciar Fluxo
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
