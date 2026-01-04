// Tipos para notificações baseados no backend ordoc_flow

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read'
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'

export interface NotificationLog {
    id: string
    template: string
    recipient: string | null
    external_recipient: string | null
    status: NotificationStatus
    channel: NotificationChannel
    subject: string
    message: string
    metadata: Record<string, any>
    sent_at: string | null
    read_at: string | null
    error_message: string | null
    created_at: string
    updated_at: string
}

export interface NotificationTemplate {
    id: string
    name: string
    description: string
    channel: NotificationChannel
    subject_template: string
    message_template: string
    is_active: boolean
    organization: string
    created_at: string
    updated_at: string
}

export interface PaginatedNotifications {
    count: number
    next: string | null
    previous: string | null
    results: NotificationLog[]
}
