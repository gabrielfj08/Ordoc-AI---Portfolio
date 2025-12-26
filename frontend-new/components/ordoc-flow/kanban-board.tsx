"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"
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

// Mock data for initial tasks
const generateMockTasks = (): { [key: string]: Task[] } => {
  // Helper to create a date string (past or future)
  const createDate = (daysFromNow: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString()
  }

  // To Do tasks
  const todoTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Research competitor products",
      description: "Analyze top 5 competitor products and create a comparison report",
      status: "To Do",
      dueDate: createDate(5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Identify top competitors", completed: false },
        { id: `subtask-${generateId()}`, title: "Create comparison criteria", completed: false },
        { id: `subtask-${generateId()}`, title: "Gather product information", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Estimated Hours", value: "8" },
      ],
      createdAt: createDate(-2),
    },
    {
      id: `task-${generateId()}`,
      title: "Design new landing page",
      description: "Create wireframes and mockups for the new product landing page",
      status: "To Do",
      dueDate: createDate(7),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Research design trends", completed: false },
        { id: `subtask-${generateId()}`, title: "Create wireframes", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Assigned To", value: "Sarah" },
      ],
      createdAt: createDate(-1),
    },
    {
      id: `task-${generateId()}`,
      title: "Update documentation",
      description: "Update the user documentation with the latest features",
      status: "To Do",
      dueDate: createDate(3),
      subtasks: [],
      customFields: [{ id: `field-${generateId()}`, name: "Priority", value: "Low" }],
      createdAt: createDate(-3),
    },
  ]

  // In Progress tasks
  const inProgressTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Implement authentication flow",
      description: "Create login, registration, and password reset functionality",
      status: "In Progress",
      dueDate: createDate(2),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Design authentication screens", completed: true },
        { id: `subtask-${generateId()}`, title: "Implement login functionality", completed: true },
        { id: `subtask-${generateId()}`, title: "Implement registration", completed: false },
        { id: `subtask-${generateId()}`, title: "Implement password reset", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Assigned To", value: "Michael" },
        { id: `field-${generateId()}`, name: "Story Points", value: "8" },
      ],
      createdAt: createDate(-5),
    },
    {
      id: `task-${generateId()}`,
      title: "Optimize database queries",
      description: "Improve performance of slow database queries on the dashboard",
      status: "In Progress",
      dueDate: createDate(1),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Identify slow queries", completed: true },
        { id: `subtask-${generateId()}`, title: "Add indexes", completed: false },
        { id: `subtask-${generateId()}`, title: "Rewrite complex queries", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Estimated Hours", value: "6" },
      ],
      createdAt: createDate(-4),
    },
  ]

  // Blocked tasks
  const blockedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Fix payment integration",
      description: "Resolve issues with the Stripe payment integration",
      status: "Blocked",
      dueDate: createDate(-1), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Investigate error logs", completed: true },
        { id: `subtask-${generateId()}`, title: "Contact Stripe support", completed: true },
        { id: `subtask-${generateId()}`, title: "Update API integration", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Critical" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Waiting for API documentation" },
      ],
      createdAt: createDate(-7),
    },
    {
      id: `task-${generateId()}`,
      title: "Finalize third-party integrations",
      description: "Complete integration with analytics and marketing tools",
      status: "Blocked",
      dueDate: createDate(-2), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Set up Google Analytics", completed: true },
        { id: `subtask-${generateId()}`, title: "Integrate Mailchimp", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Waiting for API keys" },
      ],
      createdAt: createDate(-6),
    },
  ]

  // Completed tasks
  const completedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Create project proposal",
      description: "Draft and finalize the project proposal document",
      status: "Completed",
      dueDate: createDate(-5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Research market needs", completed: true },
        { id: `subtask-${generateId()}`, title: "Define project scope", completed: true },
        { id: `subtask-${generateId()}`, title: "Create budget estimate", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Completed On", value: createDate(-6).split("T")[0] },
      ],
      createdAt: createDate(-10),
    },
    {
      id: `task-${generateId()}`,
      title: "Set up development environment",
      description: "Configure development, staging, and production environments",
      status: "Completed",
      dueDate: createDate(-8),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Set up local environment", completed: true },
        { id: `subtask-${generateId()}`, title: "Configure staging server", completed: true },
        { id: `subtask-${generateId()}`, title: "Set up CI/CD pipeline", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Completed By", value: "David" },
      ],
      createdAt: createDate(-12),
    },
    {
      id: `task-${generateId()}`,
      title: "Initial user research",
      description: "Conduct interviews and surveys with potential users",
      status: "Completed",
      dueDate: createDate(-15),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Create research questions", completed: true },
        { id: `subtask-${generateId()}`, title: "Recruit participants", completed: true },
        { id: `subtask-${generateId()}`, title: "Analyze results", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Participants", value: "12" },
      ],
      createdAt: createDate(-20),
    },
  ]

  return {
    "To Do": todoTasks,
    "In Progress": inProgressTasks,
    Blocked: blockedTasks,
    Completed: completedTasks,
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

  // Initialize with default columns and mock data
  useEffect(() => {
    const mockTasks = generateMockTasks()

    const initialColumns: ColumnType[] = [
      {
        id: "column-1",
        title: "To Do",
        tasks: mockTasks["To Do"],
      },
      {
        id: "column-2",
        title: "In Progress",
        tasks: mockTasks["In Progress"],
      },
      {
        id: "column-3",
        title: "Blocked",
        tasks: mockTasks["Blocked"],
      },
      {
        id: "column-4",
        title: "Completed",
        tasks: mockTasks["Completed"],
      },
    ]
    setColumns(initialColumns)

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

  const handleDragEnd = (result: DropResult) => {
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

    setColumns(newColumns)

    // Update selected task if it's the one being moved
    if (selectedTask && selectedTask.id === draggableId) {
      setSelectedTask(updatedTask)
    }

    toast({
      title: "Task moved",
      description: `"${task.title}" moved to ${destColumn.title}`,
    })
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
