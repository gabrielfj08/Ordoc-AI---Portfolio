"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus, Loader2 } from "lucide-react"
import Column from "./kanban-column"
import TaskDetailSidebar from "./kanban-task-detail"
import AutomationRules from "./kanban-automation-rules"
import { ThemeToggle } from "./kanban-theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Task, Column as ColumnType, Rule } from "@/types/kanban"
import { generateId } from "@/lib/utils"
import { tasksApi } from "@/app/processes/api"

// Mapeamento de status do backend para colunas do Kanban
const statusToColumn: { [key: string]: string } = {
  'draft': 'To Do',
  'running': 'To Do',
  'started': 'In Progress',
  'finished': 'Completed',
  'refused': 'Blocked',
}

const columnToStatus: { [key: string]: string } = {
  'To Do': 'running',
  'In Progress': 'started',
  'Completed': 'finished',
  'Blocked': 'refused',
}

// Função auxiliar para converter Task do backend para Task do Kanban
const convertBackendTask = (backendTask: any): Task => {
  return {
    id: backendTask.id || `task-${generateId()}`,
    title: backendTask.name || backendTask.title || "Sem título",
    description: backendTask.description || "",
    status: statusToColumn[backendTask.status] || 'To Do',
    dueDate: backendTask.due_date || backendTask.deadline || undefined,
    subtasks: [],
    customFields: [
      { id: `field-priority-${backendTask.id}`, name: "Priority", value: backendTask.priority || "medium" },
      { id: `field-assignee-${backendTask.id}`, name: "Assigned To", value: backendTask.assignee_name || "Não atribuído" },
    ],
    createdAt: backendTask.created_at || new Date().toISOString(),
  }
}

export default function KanbanBoard() {
  const { toast } = useToast()
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [rules, setRules] = useState<Rule[]>([])
  const [activeTab, setActiveTab] = useState("board")
  const [isLoading, setIsLoading] = useState(true)

  // Buscar tarefas reais da API
  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const response = await tasksApi.list()
      const tasks = response.results || []

      // Agrupar tasks por status
      const tasksByStatus: { [key: string]: Task[] } = {
        'To Do': [],
        'In Progress': [],
        'Blocked': [],
        'Completed': [],
      }

      tasks.forEach((backendTask: any) => {
        const task = convertBackendTask(backendTask)
        const columnKey = task.status
        if (tasksByStatus[columnKey]) {
          tasksByStatus[columnKey].push(task)
        }
      })

      const initialColumns: ColumnType[] = [
        {
          id: "column-1",
          title: "To Do",
          tasks: tasksByStatus["To Do"],
        },
        {
          id: "column-2",
          title: "In Progress",
          tasks: tasksByStatus["In Progress"],
        },
        {
          id: "column-3",
          title: "Blocked",
          tasks: tasksByStatus["Blocked"],
        },
        {
          id: "column-4",
          title: "Completed",
          tasks: tasksByStatus["Completed"],
        },
      ]
      setColumns(initialColumns)
    } catch (error) {
      console.error('Erro ao carregar tasks:', error)
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar as tarefas do servidor.",
        variant: "destructive",
      })
      // Inicializar com colunas vazias
      setColumns([
        { id: "column-1", title: "To Do", tasks: [] },
        { id: "column-2", title: "In Progress", tasks: [] },
        { id: "column-3", title: "Blocked", tasks: [] },
        { id: "column-4", title: "Completed", tasks: [] },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize with real data from API
  useEffect(() => {
    loadTasks()

    // Polling: atualizar tasks a cada 30 segundos
    const interval = setInterval(() => {
      loadTasks()
    }, 30000)

    // Add a sample automation rule
    setRules([
      {
        id: `rule-${generateId()}`,
        name: "Move overdue tasks to Blocked",
        condition: {
          type: "due-date",
          operator: "is-overdue",
        },
        action: {
          type: "move-to-column",
          targetColumnId: "column-3", // Blocked column
        },
        enabled: true,
      },
      {
        id: `rule-${generateId()}`,
        name: "Move completed tasks when all subtasks done",
        condition: {
          type: "subtasks-completed",
          operator: "all-completed",
        },
        action: {
          type: "move-to-column",
          targetColumnId: "column-4", // Completed column
        },
        enabled: true,
      },
    ])

    return () => clearInterval(interval)
  }, [])

  // Process automation rules
  useEffect(() => {
    if (rules.length === 0) return

    // Only process enabled rules
    const enabledRules = rules.filter((rule) => rule.enabled)
    if (enabledRules.length === 0) return

    const tasksToMove: { taskId: string; sourceColumnId: string; targetColumnId: string }[] = []

    // Check each task against each rule
    columns.forEach((column) => {
      column.tasks.forEach((task) => {
        enabledRules.forEach((rule) => {
          const { condition, action } = rule
          let conditionMet = false

          // Check if condition is met
          if (condition.type === "due-date" && condition.operator === "is-overdue") {
            conditionMet = Boolean(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed")
          } else if (condition.type === "subtasks-completed" && condition.operator === "all-completed") {
            conditionMet = task.subtasks.length > 0 && task.subtasks.every((subtask) => subtask.completed)
          } else if (condition.type === "custom-field" && condition.field) {
            const field = task.customFields.find((f) => f.name === condition.field)
            if (field) {
              if (condition.operator === "equals") {
                conditionMet = field.value === condition.value
              } else if (condition.operator === "not-equals") {
                conditionMet = field.value !== condition.value
              } else if (condition.operator === "contains") {
                conditionMet = field.value.includes(condition.value || "")
              }
            }
          }

          // If condition is met and task is not already in the target column
          if (conditionMet && action.type === "move-to-column" && action.targetColumnId) {
            const targetColumn = columns.find((col) => col.id === action.targetColumnId)
            if (targetColumn && task.status !== targetColumn.title) {
              tasksToMove.push({
                taskId: task.id,
                sourceColumnId: column.id,
                targetColumnId: action.targetColumnId,
              })
            }
          }
        })
      })
    })

    // Apply the moves
    if (tasksToMove.length > 0) {
      const newColumns = [...columns]

      tasksToMove.forEach(({ taskId, sourceColumnId, targetColumnId }) => {
        const sourceColIndex = newColumns.findIndex((col) => col.id === sourceColumnId)
        const targetColIndex = newColumns.findIndex((col) => col.id === targetColumnId)

        if (sourceColIndex !== -1 && targetColIndex !== -1) {
          const sourceCol = newColumns[sourceColIndex]
          const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId)

          if (taskIndex !== -1) {
            const task = { ...sourceCol.tasks[taskIndex], status: newColumns[targetColIndex].title }

            // Remove from source
            newColumns[sourceColIndex] = {
              ...sourceCol,
              tasks: sourceCol.tasks.filter((t) => t.id !== taskId),
            }

            // Add to target
            newColumns[targetColIndex] = {
              ...newColumns[targetColIndex],
              tasks: [...newColumns[targetColIndex].tasks, task],
            }

            // Update selected task if it's being moved
            if (selectedTask && selectedTask.id === taskId) {
              setSelectedTask(task)
            }

            toast({
              title: "Task moved automatically",
              description: `"${task.title}" moved to ${newColumns[targetColIndex].title} by rule: ${rules.find((r) => r.action.targetColumnId === targetColumnId)?.name}`,
            })
          }
        }
      })

      setColumns(newColumns)
    }
  }, [columns, rules, selectedTask, toast])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new arrays for the columns
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    // Find the task being moved
    const task = sourceColumn.tasks.find((t) => t.id === draggableId)
    if (!task) return

    // Remove the task from the source column
    newColumns[sourceColIndex] = {
      ...sourceColumn,
      tasks: sourceColumn.tasks.filter((t) => t.id !== draggableId),
    }

    // Add the task to the destination column with updated status
    const updatedTask = { ...task, status: destColumn.title }
    newColumns[destColIndex] = {
      ...destColumn,
      tasks: [
        ...destColumn.tasks.slice(0, destination.index),
        updatedTask,
        ...destColumn.tasks.slice(destination.index),
      ],
    }

    // Atualizar estado local imediatamente (optimistic update)
    setColumns(newColumns)

    // Update selected task if it's the one being moved
    if (selectedTask && selectedTask.id === draggableId) {
      setSelectedTask(updatedTask)
    }

    // Persistir mudança no backend
    try {
      const newStatus = columnToStatus[destColumn.title]
      await tasksApi.partialUpdate(draggableId, { status: newStatus })

      toast({
        title: "Tarefa movida",
        description: `"${task.title}" movida para ${destColumn.title}`,
      })
    } catch (error) {
      console.error('Erro ao atualizar task:', error)
      // Reverter mudança em caso de erro
      setColumns(columns)
      toast({
        title: "Erro ao mover tarefa",
        description: "Não foi possível salvar a mudança. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const addTask = (columnId: string, task: Task) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        }
      }
      return column
    })
    setColumns(newColumns)
    toast({
      title: "Task created",
      description: `"${task.title}" added to ${columns.find((col) => col.id === columnId)?.title}`,
    })
  }

  const updateTask = (updatedTask: Task) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      }
    })
    setColumns(newColumns)
    setSelectedTask(updatedTask)
    toast({
      title: "Task updated",
      description: `"${updatedTask.title}" has been updated`,
    })
  }

  const deleteTask = (taskId: string) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }
    })
    setColumns(newColumns)
    setSelectedTask(null)
    toast({
      title: "Task deleted",
      description: "The task has been deleted",
    })
  }

  const duplicateTask = (task: Task, columnId?: string) => {
    // Create a deep copy of the task with a new ID
    const duplicatedTask: Task = {
      ...JSON.parse(JSON.stringify(task)),
      id: `task-${generateId()}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
    }

    // If columnId is provided, add to that column, otherwise add to the same column as the original
    const targetColumnId = columnId || columns.find((col) => col.tasks.some((t) => t.id === task.id))?.id

    if (targetColumnId) {
      addTask(targetColumnId, duplicatedTask)
      toast({
        title: "Task duplicated",
        description: `"${duplicatedTask.title}" created`,
      })
    }
  }

  const addColumn = () => {
    if (!newColumnTitle.trim()) {
      toast({
        title: "Error",
        description: "Column title cannot be empty",
        variant: "destructive",
      })
      return
    }

    const newColumn: ColumnType = {
      id: `column-${generateId()}`,
      title: newColumnTitle,
      tasks: [],
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddingColumn(false)
    toast({
      title: "Column added",
      description: `"${newColumnTitle}" column has been added`,
    })
  }

  const updateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    const newColumns = columns.map((column) => (column.id === columnId ? { ...column, ...updates } : column))
    setColumns(newColumns)
  }

  const deleteColumn = (columnId: string) => {
    // Check if column has tasks
    const column = columns.find((col) => col.id === columnId)
    if (column && column.tasks.length > 0) {
      toast({
        title: "Cannot delete column",
        description: "Please move or delete all tasks in this column first",
        variant: "destructive",
      })
      return
    }

    setColumns(columns.filter((col) => col.id !== columnId))
    toast({
      title: "Column deleted",
      description: `"${column?.title}" column has been deleted`,
    })
  }

  const addRule = (rule: Rule) => {
    setRules([...rules, rule])
    toast({
      title: "Rule created",
      description: `"${rule.name}" has been added`,
    })
  }

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    const newRules = rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    setRules(newRules)
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
    toast({
      title: "Rule deleted",
      description: "The automation rule has been deleted",
    })
  }

  // Board content for the "board" tab
  const renderBoardContent = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 items-start">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddTask={addTask}
            onTaskClick={setSelectedTask}
            onDeleteColumn={() => deleteColumn(column.id)}
            onUpdateColumn={updateColumn}
            onDuplicateTask={duplicateTask}
          />
        ))}

        <div className="shrink-0 w-72">
          {isAddingColumn ? (
            <div className="bg-white  p-3 rounded-md shadow-sm border ">
              <Label htmlFor="column-title" className="">
                Column Title
              </Label>
              <Input
                id="column-title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title"
                className="mb-2   "
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addColumn}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingColumn(false)}
                  className=" "
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="border-dashed border-2 w-full h-12  "
              onClick={() => setIsAddingColumn(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Column
            </Button>
          )}
        </div>
      </div>
    </DragDropContext>
  )

  // Automation content for the "automation" tab
  const renderAutomationContent = () => (
    <div className="max-w-4xl mx-auto">
      <AutomationRules
        rules={rules}
        columns={columns}
        onAddRule={addRule}
        onUpdateRule={updateRule}
        onDeleteRule={deleteRule}
      />
    </div>
  )

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando tarefas...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full ">
      {renderBoardContent()}

      {selectedTask && (
        <TaskDetailSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onDuplicate={duplicateTask}
          columns={columns}
        />
      )}
    </div>
  )
}
