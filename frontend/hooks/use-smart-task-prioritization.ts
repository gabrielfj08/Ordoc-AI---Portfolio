import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface Task {
    id: string
    name: string
    description?: string
    status: string
    priority: string
    deadline?: string
    created_at: string
    assignee?: any
    procedure?: any
    estimated_hours?: number
    actual_hours?: number
    dependencies?: string[]
}

export interface SmartPriorityScore {
    taskId: string
    score: number
    factors: {
        deadline_urgency: number // 0-1: quão próximo do prazo
        dependency_impact: number // 0-1: impacto em outras tasks
        estimated_duration: number // 0-1: baseado em duração estimada
        historical_pattern: number // 0-1: baseado em histórico
        business_value: number // 0-1: valor de negócio
    }
    suggestedPriority: 'low' | 'normal' | 'high' | 'urgent'
    reasoning: string
    confidence: number
}

export interface PrioritizationConfig {
    enabled: boolean
    autoApply: boolean
    weights: {
        deadline: number
        dependencies: number
        duration: number
        historical: number
        value: number
    }
}

/**
 * Hook para priorização inteligente de tarefas usando ML
 */
export function useSmartTaskPrioritization(
    tasks: Task[],
    config: Partial<PrioritizationConfig> = {}
) {
    const [scores, setScores] = useState<SmartPriorityScore[]>([])
    const [loading, setLoading] = useState(false)
    const [enabled, setEnabled] = useState(config.enabled ?? true)
    const { toast } = useToast()

    const defaultWeights = {
        deadline: 0.3,
        dependencies: 0.25,
        duration: 0.2,
        historical: 0.15,
        value: 0.1,
    }

    const weights = { ...defaultWeights, ...config.weights }

    /**
     * Calcula urgência baseada no prazo
     */
    const calculateDeadlineUrgency = (task: Task): number => {
        if (!task.deadline) return 0.3 // Sem prazo = urgência média

        const now = new Date()
        const deadline = new Date(task.deadline)
        const diffDays = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 1.0 // Vencido
        if (diffDays === 0) return 0.95 // Hoje
        if (diffDays === 1) return 0.9 // Amanhã
        if (diffDays <= 3) return 0.8 // 2-3 dias
        if (diffDays <= 7) return 0.6 // Semana
        if (diffDays <= 14) return 0.4 // 2 semanas
        if (diffDays <= 30) return 0.2 // Mês

        return 0.1 // Mais de um mês
    }

    /**
     * Calcula impacto de dependências
     */
    const calculateDependencyImpact = (task: Task, allTasks: Task[]): number => {
        if (!task.dependencies || task.dependencies.length === 0) {
            return 0.2 // Sem dependências = baixo impacto
        }

        // Contar quantas tasks dependem desta
        const dependentCount = allTasks.filter(t =>
            t.dependencies?.includes(task.id)
        ).length

        if (dependentCount === 0) return 0.3
        if (dependentCount === 1) return 0.5
        if (dependentCount === 2) return 0.7
        if (dependentCount >= 3) return 0.9

        return 0.5
    }

    /**
     * Calcula fator de duração
     */
    const calculateDurationFactor = (task: Task): number => {
        if (!task.estimated_hours) return 0.5

        // Tasks mais curtas têm maior prioridade (podem ser finalizadas rápido)
        if (task.estimated_hours <= 1) return 0.8
        if (task.estimated_hours <= 4) return 0.6
        if (task.estimated_hours <= 8) return 0.4
        if (task.estimated_hours <= 16) return 0.3
        if (task.estimated_hours <= 40) return 0.2

        return 0.1 // Tasks muito longas
    }

    /**
     * Calcula padrão histórico (simulado)
     * Em produção, isso viria de ML treinado com histórico real
     */
    const calculateHistoricalPattern = (task: Task): number => {
        // Simular análise de padrões históricos
        // Por exemplo: tasks similares geralmente são urgentes?

        const taskAge = Math.floor(
            (new Date().getTime() - new Date(task.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
        )

        // Tasks antigas que ainda não foram concluídas podem ser importantes
        if (taskAge > 30) return 0.7
        if (taskAge > 14) return 0.5
        if (taskAge > 7) return 0.3

        return 0.2
    }

    /**
     * Calcula valor de negócio (baseado em procedimento/tipo)
     */
    const calculateBusinessValue = (task: Task): number => {
        // Prioridade atual já indica certo valor
        switch (task.priority) {
            case 'urgent':
                return 0.9
            case 'high':
                return 0.7
            case 'normal':
                return 0.5
            case 'low':
                return 0.3
            default:
                return 0.5
        }
    }

    /**
     * Calcula score final de priorização
     */
    const calculatePriorityScore = (task: Task, allTasks: Task[]): SmartPriorityScore => {
        const factors = {
            deadline_urgency: calculateDeadlineUrgency(task),
            dependency_impact: calculateDependencyImpact(task, allTasks),
            estimated_duration: calculateDurationFactor(task),
            historical_pattern: calculateHistoricalPattern(task),
            business_value: calculateBusinessValue(task),
        }

        // Score ponderado
        const score =
            factors.deadline_urgency * weights.deadline +
            factors.dependency_impact * weights.dependencies +
            factors.estimated_duration * weights.duration +
            factors.historical_pattern * weights.historical +
            factors.business_value * weights.value

        // Determinar prioridade sugerida
        let suggestedPriority: 'low' | 'normal' | 'high' | 'urgent'
        if (score >= 0.75) suggestedPriority = 'urgent'
        else if (score >= 0.6) suggestedPriority = 'high'
        else if (score >= 0.4) suggestedPriority = 'normal'
        else suggestedPriority = 'low'

        // Gerar explicação
        const reasons: string[] = []
        if (factors.deadline_urgency > 0.7)
            reasons.push('prazo muito próximo')
        if (factors.dependency_impact > 0.6)
            reasons.push('bloqueia outras tarefas')
        if (factors.estimated_duration > 0.6)
            reasons.push('pode ser concluída rapidamente')
        if (factors.historical_pattern > 0.6)
            reasons.push('padrão histórico sugere urgência')
        if (factors.business_value > 0.7)
            reasons.push('alto valor de negócio')

        const reasoning =
            reasons.length > 0
                ? `Prioridade ${suggestedPriority}: ${reasons.join(', ')}`
                : `Prioridade ${suggestedPriority} baseada em análise geral`

        // Confidence baseado em quantos dados temos
        const dataPoints = [
            task.deadline ? 1 : 0,
            task.dependencies?.length ? 1 : 0,
            task.estimated_hours ? 1 : 0,
            task.created_at ? 1 : 0,
            task.priority ? 1 : 0,
        ].reduce((a, b) => a + b, 0)

        const confidence = dataPoints / 5 // 0-1

        return {
            taskId: task.id,
            score,
            factors,
            suggestedPriority,
            reasoning,
            confidence,
        }
    }

    /**
     * Recalcula prioridades quando tasks mudam
     */
    useEffect(() => {
        if (!enabled || tasks.length === 0) {
            setScores([])
            return
        }

        setLoading(true)

        try {
            const newScores = tasks.map(task => calculatePriorityScore(task, tasks))

            // Ordenar por score (maior primeiro)
            newScores.sort((a, b) => b.score - a.score)

            setScores(newScores)

            // Detectar mudanças significativas de prioridade
            const priorityChanges = newScores.filter(score => {
                const task = tasks.find(t => t.id === score.taskId)
                return task && task.priority !== score.suggestedPriority
            })

            if (priorityChanges.length > 0) {
                toast({
                    title: '🧠 Sugestões de Priorização',
                    description: `${priorityChanges.length} tarefa(s) com prioridade sugerida diferente`,
                })
            }
        } catch (error) {
            console.error('Error calculating priorities:', error)
        } finally {
            setLoading(false)
        }
    }, [tasks, enabled])

    /**
     * Retorna score de uma task específica
     */
    const getTaskScore = (taskId: string): SmartPriorityScore | undefined => {
        return scores.find(s => s.taskId === taskId)
    }

    /**
     * Retorna tasks ordenadas por prioridade inteligente
     */
    const getSortedTasks = (): Task[] => {
        if (scores.length === 0) return tasks

        return [...tasks].sort((a, b) => {
            const scoreA = scores.find(s => s.taskId === a.id)?.score || 0
            const scoreB = scores.find(s => s.taskId === b.id)?.score || 0
            return scoreB - scoreA
        })
    }

    /**
     * Retorna tasks que precisam de atenção urgente
     */
    const getUrgentTasks = (): Task[] => {
        return tasks.filter(task => {
            const score = scores.find(s => s.taskId === task.id)
            return score && score.suggestedPriority === 'urgent'
        })
    }

    /**
     * Retorna tasks com mudança de prioridade sugerida
     */
    const getTasksWithPriorityChange = (): Array<{
        task: Task
        currentPriority: string
        suggestedPriority: string
        reasoning: string
    }> => {
        return tasks
            .map(task => {
                const score = scores.find(s => s.taskId === task.id)
                if (!score || task.priority === score.suggestedPriority) return null

                return {
                    task,
                    currentPriority: task.priority,
                    suggestedPriority: score.suggestedPriority,
                    reasoning: score.reasoning,
                }
            })
            .filter(Boolean) as Array<{
            task: Task
            currentPriority: string
            suggestedPriority: string
            reasoning: string
        }>
    }

    return {
        scores,
        loading,
        enabled,
        setEnabled,
        getTaskScore,
        getSortedTasks,
        getUrgentTasks,
        getTasksWithPriorityChange,
    }
}
