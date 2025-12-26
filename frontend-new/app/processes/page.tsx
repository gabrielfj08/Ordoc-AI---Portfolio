"use client"

import { useState, useEffect, useMemo } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import TaskDetailSidebar from "@/components/ordoc-flow/kanban-task-detail"
import {
  LayoutGrid,
  Plus,
  Search,
  MoreVertical,
  Clock,
  Workflow,
} from "lucide-react"
import { useTasks, useProcedures } from "./hooks"
import { TaskFormModal, ProcedureFormModal } from "./components"
import type { Task, TaskStatus, KanbanColumn } from "./types"

// Mapeamento de status para colunas do Kanban
const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "draft",
    title: "To Do",
    status: "draft",
    color: "bg-blue-500",
    tasks: [],
  },
  {
    id: "running",
    title: "In Progress",
    status: "running",
    color: "bg-orange-500",
    tasks: [],
  },
  {
    id: "started",
    title: "Started",
    status: "started",
    color: "bg-purple-500",
    tasks: [],
  },
  {
    id: "finished",
    title: "Completed",
    status: "finished",
    color: "bg-green-500",
    tasks: [],
  },
  {
    id: "refused",
    title: "Blocked",
    status: "refused",
    color: "bg-red-500",
    tasks: [],
  },
]

export default function ProcessesPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showProcedureForm, setShowProcedureForm] = useState(false)

  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const { tasks, loading, fetchTasks, transitionTaskStatus } = useTasks()
  const { procedures, fetchProcedures } = useProcedures()

  // Carregar dados iniciais
  useEffect(() => {
    fetchTasks()
    fetchProcedures()
  }, [])

  // Organizar tarefas em colunas do Kanban
  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.status === column.status),
    }))
  }, [tasks])

  // Filtrar tarefas por busca, status e prioridade
  const filteredColumns = useMemo(() => {
    return columns.map((column) => {
      let filteredTasks = column.tasks

      // Filtro de busca
      if (searchTerm) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Filtro de prioridade
      if (priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter((task) => task.priority === priorityFilter)
      }

      return {
        ...column,
        tasks: filteredTasks,
      }
    }).filter((column) => {
      // Filtro de status (ocultar colunas vazias se filtro ativo)
      if (statusFilter !== 'all') {
        return column.status === statusFilter
      }
      return true
    })
  }, [columns, searchTerm, statusFilter, priorityFilter])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const newStatus = destination.droppableId as TaskStatus

    try {
      // Transição de status via API
      await transitionTaskStatus(draggableId, newStatus)

      // Atualizar selectedTask se for o card sendo movido
      if (selectedTask && selectedTask.id === draggableId) {
        setSelectedTask({ ...selectedTask, status: newStatus })
      }
    } catch (error) {
      // Erro já tratado no hook
      console.error('Erro ao mover tarefa:', error)
    }
  }

  const updateTask = async (updatedTask: Task) => {
    // Atualizar via API será feito pelo sidebar
    setSelectedTask(updatedTask)
  }

  const deleteTask = async (taskId: string) => {
    // Deletar via API será feito pelo sidebar
    setSelectedTask(null)
  }

  const duplicateTask = async (task: Task, columnId?: string) => {
    // Implementar duplicação via API
    console.log('Duplicar tarefa:', task, columnId)
  }

  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Processos</h2>
            <p className="text-muted-foreground">Gerencie workflows e automações com quadros Kanban</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-full bg-transparent"
              onClick={() => fetchProcedures()}
            >
              <LayoutGrid className="size-4" />
              Procedimentos
            </Button>
            <Button
              className="gap-2 rounded-full shadow-lg shadow-primary/20 bg-orange-600 hover:bg-orange-700"
              onClick={() => setShowProcedureForm(true)}
            >
              <Plus className="size-4" />
              Novo Procedimento
            </Button>
          </div>
        </div>

        {/* Toolbar com busca e filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10 rounded-full bg-secondary/30 border-transparent hover:bg-secondary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] rounded-full bg-secondary/30 border-transparent hover:bg-secondary/50 h-10">
              <div className="flex items-center gap-2 truncate">
                <span className="text-muted-foreground text-xs shrink-0">Status</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">To Do</SelectItem>
              <SelectItem value="running">In Progress</SelectItem>
              <SelectItem value="started">Started</SelectItem>
              <SelectItem value="finished">Completed</SelectItem>
              <SelectItem value="refused">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[170px] rounded-full bg-secondary/30 border-transparent hover:bg-secondary/50 h-10">
              <div className="flex items-center gap-2 truncate">
                <span className="text-muted-foreground text-xs shrink-0">Prioridade</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board com Drag and Drop */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando tarefas...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6">
              {filteredColumns.map((column) => (
                <div key={column.id} className="shrink-0 w-80">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`size-3 rounded-full ${column.color}`} />
                      <h3 className="font-bold text-base">{column.title}</h3>
                      <Badge variant="secondary" className="rounded-full">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="size-8 rounded-full">
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] p-3 rounded-lg ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                      >
                        {column.tasks.map((task, index) => {
                          const priorityColor = task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'

                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTask(task)
                                  }}
                                  className={`p-4 border-border bg-white hover:shadow-lg transition-all cursor-pointer group ${snapshot.isDragging ? "shadow-2xl rotate-2 ring-2 ring-primary" : ""
                                    }`}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                        {task.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs flex-wrap">
                                      {task.deadline && (
                                        <Badge variant="secondary" className="text-[10px] px-2 gap-1">
                                          <Clock className="size-3" />
                                          {new Date(task.deadline).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "short",
                                          })}
                                        </Badge>
                                      )}
                                      <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-2 ${priorityColor}`}
                                      >
                                        Priority: {task.priority === 'high' ? 'Alta' : 'Normal'}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}

                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 rounded-xl text-muted-foreground hover:bg-muted"
                        >
                          <Plus className="size-4" />
                          Add Task
                        </Button>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}

              <Button
                variant="outline"
                className="shrink-0 w-80 h-auto min-h-[200px] rounded-2xl border-dashed bg-transparent hover:bg-muted/50"
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="size-6" />
                  <span className="font-semibold">Add Column</span>
                </div>
              </Button>
            </div>
          </DragDropContext>
        )}

        {/* Lista de Procedimentos */}
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-bold mb-4">Procedimentos Ativos</h3>
          <div className="space-y-3">
            {procedures.slice(0, 5).map((proc, i) => (
              <div
                key={proc.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="size-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Workflow className="size-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{proc.procedure_template_name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {proc.process_number}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Criado em {new Date(proc.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-orange-100 text-orange-700"
                    >
                      {proc.status}
                    </Badge>
                  </div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">
                  Ver detalhes
                </Button>
              </div>
            ))}

            {procedures.length === 0 && !loading && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum procedimento ativo
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Sidebar de detalhes do card */}
      {selectedTask && (
        <TaskDetailSidebar
          task={selectedTask as any}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask as any}
          onDelete={deleteTask}
          onDuplicate={duplicateTask as any}
          columns={filteredColumns as any}
        />
      )}

      {/* Modais de Formulário */}
      <TaskFormModal
        open={showTaskForm}
        onOpenChange={setShowTaskForm}
        onSuccess={() => fetchTasks()}
      />

      <ProcedureFormModal
        open={showProcedureForm}
        onOpenChange={setShowProcedureForm}
        onSuccess={() => {
          fetchProcedures()
          fetchTasks()
        }}
      />
    </div>
  )
}
