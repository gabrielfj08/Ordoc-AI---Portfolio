'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  Clock,
  PlayCircle,
  FileText,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { Procedure, FilterProceduresParams } from '@/types/ordoc-flow';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const ProceduresPage = () => {
  const router = useRouter();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [params, setParams] = useState<FilterProceduresParams>({
    direction: 'asc',
    order: 'name',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
  });

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setParams(prev => ({ ...prev, q: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadProcedures();
  }, [params]);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await proceduresService.getProcedures(params);
      setProcedures(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      setError('Erro ao carregar procedimentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (procedure: Procedure) => {
    try {
      await proceduresService.toggleProcedureStatus(procedure.id);
      loadProcedures();
    } catch (error) {
      console.error('Erro ao alterar status do procedimento:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'; // Black/Dark
      case 'completed': return 'default'; // We might want green, Shadcn badge "default" is usually black. We can style with className.
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-600 hover:bg-blue-700';
      case 'completed': return 'bg-green-600 hover:bg-green-700';
      case 'cancelled': return ''; // Destructive handles it
      default: return '';
    }
  };

  const getProgressPercentage = (procedure: Procedure) => {
    const total = procedure.tasks_count || 0;
    const completed = procedure.completed_tasks_count || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Procedimentos</h2>
            <p className="text-muted-foreground">
              Gerencie e acompanhe a execução dos procedimentos.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/dashboard/ordoc-flow/procedures/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Procedimento
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar procedimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {/* Filter button could be here */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listagem</CardTitle>
            <CardDescription>
              Visualização de todos os procedimentos registrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : procedures.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum procedimento encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Requerente</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procedures.map((procedure) => (
                    <TableRow key={procedure.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{procedure.name}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{procedure.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(procedure.status) as any}
                          className={getStatusColorClass(procedure.status)}
                        >
                          {procedure.status === 'draft' ? 'Rascunho' :
                            procedure.status === 'active' ? 'Ativo' :
                              procedure.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={getProgressPercentage(procedure)} className="w-[60px] h-2" />
                          <span className="text-xs text-muted-foreground">
                            {procedure.completed_tasks_count || 0}/{procedure.tasks_count || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-1 h-3 w-3" />
                          #{procedure.requester_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(procedure.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ordoc-flow/procedures/${procedure.id}/tasks`)}>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              Ver Tarefas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(procedure)}>
                              <Clock className="mr-2 h-4 w-4" />
                              Alterar Status
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination could go here */}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ProceduresPage;
