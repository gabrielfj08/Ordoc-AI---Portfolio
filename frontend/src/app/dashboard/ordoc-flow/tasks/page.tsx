import KanbanBoard from '@/components/ordoc-flow/kanban-board'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="flex-1 h-[calc(100vh-65px)] bg-slate-50">
        <KanbanBoard />
      </div>
    </ProtectedRoute>
  )
}
