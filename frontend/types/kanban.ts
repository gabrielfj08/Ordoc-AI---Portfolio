export interface Subtask {
    id: string
    title: string
    completed: boolean
}

export interface CustomField {
    id: string
    name: string
    value: string
}

export interface Task {
    id: string
    title: string
    description: string
    status: string
    dueDate?: string
    subtasks: Subtask[]
    customFields: CustomField[]
    createdAt: string
}

export interface Column {
    id: string
    title: string
    tasks: Task[]
    color?: string
}

export interface Rule {
    id: string
    name: string
    condition: {
        type: string
        operator: string
        field?: string
        value?: string
    }
    action: {
        type: string
        targetColumnId?: string
        value?: string
    }
    enabled: boolean
}
