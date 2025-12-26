// ===========================
// ENUMS E TIPOS
// ===========================

export type ProcedureStatus = 'draft' | 'running' | 'started' | 'finished' | 'archived'
export type TaskStatus = 'draft' | 'running' | 'started' | 'finished' | 'refused'
export type Priority = 'normal' | 'high'
export type Source = 'internal' | 'external'
export type TemplateStatus = 'active' | 'inactive'

// ===========================
// MODELOS PRINCIPAIS
// ===========================

export interface Procedure {
    id: string
    process_number: string
    procedure_template_name: string
    source: Source
    priority: Priority
    status: ProcedureStatus
    payload: any[]
    schema: object
    private: boolean
    deadline: string | null
    prn: string

    // Relacionamentos
    procedure_template: string
    requester: string
    responsible_group: string
    created_by: string
    organization: string

    // Timestamps
    created_at: string
    updated_at: string
}

export interface Task {
    id: string
    name: string
    description: string
    priority: Priority
    status: TaskStatus
    deadline: string | null
    prn: string

    // Relacionamentos
    procedure: string
    task_template: string | null
    assignee: string | null
    group_assignee: string | null
    created_by: string

    // Timestamps
    created_at: string
    updated_at: string
}

export interface ProcedureTemplate {
    id: string
    name: string
    description: string
    status: TemplateStatus
    prn: string

    // Relacionamentos
    organization: string
    group_requester: string | null
    parent_procedure_template: string | null

    // Timestamps
    created_at: string
    updated_at: string
}

export interface TaskTemplate {
    id: string
    name: string
    description: string
    status: TemplateStatus
    prn: string
    organization: string
    created_at: string
    updated_at: string
}

export interface TaskComment {
    id: string
    comment: string
    task: string
    created_by: string
    created_at: string
    updated_at: string
}

export interface JustificationNote {
    id: string
    note: string
    action: 'finish' | 'refuse' | 'archive' | 'comment'
    content_type: number
    object_id: string
    created_by: string
    created_at: string
    updated_at: string
}

// ===========================
// DASHBOARD E ESTATÍSTICAS
// ===========================

export interface ProcedureStats {
    draft: number
    running: number
    started: number
    finished: number
    archived: number
}

export interface TaskStats {
    draft: number
    running: number
    started: number
    finished: number
    refused: number
}

export interface RecentActivity {
    id: string
    type: string
    title: string
    description: string
    created_at: string
    status: string
}

export interface DashboardStats {
    procedure_stats: ProcedureStats
    task_stats: TaskStats
    pending_approvals: number
    overdue_tasks: number
    recent_activities: RecentActivity[]
}

// ===========================
// DTOs (Data Transfer Objects)
// ===========================

export interface CreateProcedureDto {
    procedure_template: string
    priority?: Priority
    deadline?: string | null
    payload?: any[]
    schema?: object
    private?: boolean
}

export interface UpdateProcedureDto {
    priority?: Priority
    deadline?: string | null
    payload?: any[]
    schema?: object
    private?: boolean
}

export interface CreateTaskDto {
    procedure: string
    name: string
    description: string
    priority?: Priority
    deadline?: string | null
    task_template?: string | null
    assignee?: string | null
    group_assignee?: string | null
}

export interface UpdateTaskDto {
    name?: string
    description?: string
    priority?: Priority
    deadline?: string | null
    assignee?: string | null
    group_assignee?: string | null
}

export interface AddCommentDto {
    comment: string
}

// ===========================
// RESPONSE TYPES
// ===========================

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface ActionResponse {
    message: string
    status: string
}

export interface CommentResponse {
    message: string
    comment: TaskComment
}

// ===========================
// KANBAN TYPES (Frontend)
// ===========================

export interface KanbanColumn {
    id: string
    title: string
    status: TaskStatus
    color: string
    tasks: Task[]
}

export interface KanbanBoard {
    columns: KanbanColumn[]
    procedure?: Procedure
}

// ===========================
// ATTACHMENTS & DOCUMENTS
// ===========================

export type DocumentType = 'attachment' | 'evidence' | 'report' | 'contract' | 'invoice' | 'certificate' | 'other'
export type DocumentStatus = 'pending' | 'approved' | 'rejected'
export type AttachmentType = 'document' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'presentation' | 'other'

export interface ProcedureDocument {
    id: string
    name: string
    description: string
    document_type: DocumentType

    // File info
    file: string // URL do arquivo
    file_name: string
    file_size: number
    file_type: string
    storage_key: string

    // Status
    status: DocumentStatus

    // Versioning
    version: number
    is_current: boolean
    parent_document: string | null

    // Relations
    procedure: string
    uploaded_by: string

    // Timestamps
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface TaskAttachment {
    id: string
    name: string
    description: string
    attachment_type: AttachmentType

    // File info
    file: string // URL do arquivo
    file_name: string
    file_size: number
    file_type: string
    storage_key: string
    thumbnail: string | null

    // Relations
    task: string
    uploaded_by: string

    // Timestamps
    created_at: string
    updated_at: string
    deleted_at: string | null
}

// Upload DTOs
export interface UploadDocumentDto {
    procedure: string
    file: File
    name?: string
    description?: string
    document_type?: DocumentType
}


export interface UploadAttachmentDto {
    task: string
    file: File
    name?: string
    description?: string
}

// ===========================
// APPROVALS
// ===========================

export type ApprovalType = 'sequential' | 'parallel' | 'any_one' | 'majority'
export type ApprovalStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'timeout' | 'cancelled'
export type StepType = 'user' | 'group' | 'role' | 'department'
export type StepStatus = 'pending' | 'approved' | 'rejected' | 'timeout' | 'skipped'

export interface ApprovalWorkflow {
    id: string
    name: string
    description: string
    approval_type: ApprovalType
    status: 'active' | 'inactive'
    organization: string
    created_at: string
    updated_at: string
}

export interface ApprovalStep {
    id: string
    name: string
    order: number
    step_type: StepType
    is_required: boolean
    timeout_hours: number | null
    workflow: string
    approver_user: string | null
    approver_group: string | null
    created_at: string
    updated_at: string
}

export interface ApprovalInstance {
    id: string
    status: ApprovalStatus
    workflow: string
    content_type: number
    object_id: string
    requested_by: string
    created_at: string
    updated_at: string
    completed_at: string | null
}

export interface ApprovalStepInstance {
    id: string
    status: StepStatus
    comments: string
    approval_instance: string
    approval_step: string
    assigned_to: string | null
    approved_by: string | null
    created_at: string
    updated_at: string
    due_date: string | null
    completed_at: string | null
}
