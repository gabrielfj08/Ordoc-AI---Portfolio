"use client"

import { useState } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"
import TaskCard from "./kanban-task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task, Column as ColumnType } from "@/types/kanban"
import { generateId } from "@/lib/utils"



interface ColumnProps {
  column: ColumnType
  onAddTask: (columnId: string, task: Task) => void
  onTaskClick: (task: Task) => void
  onDeleteColumn: () => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnType>) => void
  onDuplicateTask: (task: Task, columnId: string) => void
}

export default function Column({
  column,
  onAddTask,
  onTaskClick,
  onDeleteColumn,
  onUpdateColumn,
  onDuplicateTask,
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showAllTasks, setShowAllTasks] = useState(false)

  const TASKS_LIMIT = 10
  const visibleTasks = showAllTasks ? column.tasks : column.tasks.slice(0, TASKS_LIMIT)
  const hasMoreTasks = column.tasks.length > TASKS_LIMIT


  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `task-${generateId()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      status: column.title,
      dueDate: undefined,
      subtasks: [],
      customFields: [],
      createdAt: new Date().toISOString(),
    }

    onAddTask(column.id, newTask)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setIsAddingTask(false)
  }

  const handleColorChange = (color: string) => {
    onUpdateColumn(column.id, { color })
  }

  // Get header color class or default to white/dark gray
  const headerColorClass = column.color || "bg-white "

  return (
    <div className="shrink-0 w-72 bg-white rounded-md shadow-sm border">
      <div className={`p-3 flex justify-between items-center bg-orange-500 rounded-t-md`}>
        <h3 className="font-medium text-sm text-white flex items-center">
          {column.title}
          <span className="ml-2 text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </h3>
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-orange-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDeleteColumn} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="p-2">
            {visibleTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onDuplicate={() => onDuplicateTask(task, column.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {hasMoreTasks && !showAllTasks && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => setShowAllTasks(true)}
              >
                Ver mais ({column.tasks.length - TASKS_LIMIT} tarefas)
              </Button>
            )}

            {showAllTasks && hasMoreTasks && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => setShowAllTasks(false)}
              >
                Ver menos
              </Button>
            )}

            {isAddingTask ? (
              <div className="mt-2 p-3 bg-white  rounded-md shadow-sm border ">
                <Label htmlFor="task-title" className="">
                  Task Title
                </Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="mb-2 "
                />
                <Label htmlFor="task-description" className="">
                  Description (optional)
                </Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="mb-2 "
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTask}>
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingTask(false)}
                    className=""
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-whitedark:hover:text-gray-200 justify-start"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
