import { useState, useEffect } from 'react'
import type { Task } from '@/app/processes/types'

/**
 * Hook para calcular prioridade inteligente de tarefas
 * 
 * Calcula score de prioridade baseado em:
 * - Deadline (proximidade)
 * - Prioridade manual (high/normal)
 * - Status (urgência baseada no estado)
 * - Tempo desde criação (tarefas antigas ganham urgência)
 */

export interface IntelligentPriority {
    score: number // 0-100
    level: 'critical' | 'high' | 'medium' | 'low'
    factors: {
        deadline: number // 0-30 pontos
        manualPriority: number // 0-25 pontos
        status: number // 0-20 pontos
        age: number // 0-25 pontos
    }
    recommendations: string[]
}

export function calculateIntelligentPriority(task: Task): IntelligentPriority {
    const factors = {
        deadline: 0,
        manualPriority: 0,
        status: 0,
        age: 0,
    }
    const recommendations: string[] = []

    // FATOR 1: Deadline (0-30 pontos)
    if (task.deadline) {
        const now = new Date()
        const deadline = new Date(task.deadline)
        const daysUntilDeadline = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysUntilDeadline < 0) {
            // Atrasada
            factors.deadline = 30
            recommendations.push('⚠️ Tarefa está atrasada!')
        } else if (daysUntilDeadline === 0) {
            // Hoje
            factors.deadline = 28
            recommendations.push('🔥 Vence hoje - ação urgente necessária')
        } else if (daysUntilDeadline === 1) {
            // Amanhã
            factors.deadline = 25
            recommendations.push('⏰ Vence amanhã - priorize essa tarefa')
        } else if (daysUntilDeadline <= 3) {
            // 2-3 dias
            factors.deadline = 20
            recommendations.push('📅 Prazo em 2-3 dias')
        } else if (daysUntilDeadline <= 7) {
            // Semana
            factors.deadline = 12
        } else if (daysUntilDeadline <= 14) {
            // Duas semanas
            factors.deadline = 6
        } else {
            // Mais de 2 semanas
            factors.deadline = 3
        }
    } else {
        // Sem deadline - baixa urgência
        factors.deadline = 0
        recommendations.push('ℹ️ Considere definir um prazo')
    }

    // FATOR 2: Prioridade Manual (0-25 pontos)
    if (task.priority === 'high') {
        factors.manualPriority = 25
    } else {
        factors.manualPriority = 10
    }

    // FATOR 3: Status (0-20 pontos)
    switch (task.status) {
        case 'started':
            factors.status = 20
            recommendations.push('🚀 Tarefa iniciada - mantenha o ritmo')
            break
        case 'running':
            factors.status = 15
            break
        case 'draft':
            factors.status = 5
            recommendations.push('📝 Tarefa em rascunho - inicie o trabalho')
            break
        case 'refused':
            factors.status = 0
            recommendations.push('❌ Tarefa recusada')
            break
        case 'finished':
            factors.status = 0
            recommendations.push('✅ Tarefa concluída')
            break
    }

    // FATOR 4: Idade da tarefa (0-25 pontos)
    const createdAt = new Date(task.created_at)
    const now = new Date()
    const daysOld = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOld > 30) {
        factors.age = 25
        recommendations.push('⏳ Tarefa pendente há mais de 30 dias')
    } else if (daysOld > 14) {
        factors.age = 18
        recommendations.push('⏳ Tarefa pendente há mais de 2 semanas')
    } else if (daysOld > 7) {
        factors.age = 12
    } else if (daysOld > 3) {
        factors.age = 6
    } else {
        factors.age = 2
    }

    // Calcular score total (0-100)
    const score = Math.min(
        100,
        factors.deadline + factors.manualPriority + factors.status + factors.age
    )

    // Determinar nível
    let level: IntelligentPriority['level']
    if (score >= 75) {
        level = 'critical'
    } else if (score >= 55) {
        level = 'high'
    } else if (score >= 30) {
        level = 'medium'
    } else {
        level = 'low'
    }

    return {
        score,
        level,
        factors,
        recommendations,
    }
}

export function useIntelligentPriority(tasks: Task[]) {
    const [prioritizedTasks, setPrioritizedTasks] = useState<
        Array<Task & { intelligentPriority: IntelligentPriority }>
    >([])

    useEffect(() => {
        if (!tasks || tasks.length === 0) {
            setPrioritizedTasks([])
            return
        }

        // Calcular prioridade inteligente para cada tarefa
        const tasksWithPriority = tasks.map(task => ({
            ...task,
            intelligentPriority: calculateIntelligentPriority(task),
        }))

        // Ordenar por score (maior primeiro)
        const sorted = tasksWithPriority.sort(
            (a, b) => b.intelligentPriority.score - a.intelligentPriority.score
        )

        setPrioritizedTasks(sorted)
    }, [tasks])

    return {
        prioritizedTasks,
        calculateIntelligentPriority,
    }
}

// Função auxiliar para obter cor do nível de prioridade
export function getPriorityColor(level: IntelligentPriority['level']) {
    switch (level) {
        case 'critical':
            return 'text-destructive'
        case 'high':
            return 'text-orange-600'
        case 'medium':
            return 'text-yellow-600'
        case 'low':
            return 'text-muted-foreground'
    }
}

// Função auxiliar para obter badge de prioridade
export function getPriorityBadgeVariant(
    level: IntelligentPriority['level']
): 'destructive' | 'default' | 'secondary' | 'outline' {
    switch (level) {
        case 'critical':
            return 'destructive'
        case 'high':
            return 'default'
        case 'medium':
            return 'secondary'
        case 'low':
            return 'outline'
    }
}

// Função auxiliar para obter label do nível
export function getPriorityLabel(level: IntelligentPriority['level']) {
    switch (level) {
        case 'critical':
            return 'Crítico'
        case 'high':
            return 'Alto'
        case 'medium':
            return 'Médio'
        case 'low':
            return 'Baixo'
    }
}
