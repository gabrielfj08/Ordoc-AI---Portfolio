"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { tasksApi } from '../api'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types'

export function useTasks(procedureId?: string) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    /**
     * Busca tarefas com filtros opcionais
     */
    const fetchTasks = useCallback(async (params?: {
        status?: string
        priority?: string
        search?: string
    }) => {
        setLoading(true)
        setError(null)

        try {
            const allParams = procedureId
                ? { ...params, procedure: procedureId }
                : params

            const response = await tasksApi.list(allParams)
            setTasks(response.results)
            return response.results
        } catch (err: any) {
            console.error('FetchTasks Error:', err, err.response?.data)
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar tarefas'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            return []
        } finally {
            setLoading(false)
        }
    }, [procedureId, toast])

    /**
     * Busca minhas tarefas
     */
    const fetchMyTasks = useCallback(async (params?: {
        status?: string
        priority?: string
        search?: string
    }) => {
        setLoading(true)
        setError(null)

        try {
            const response = await tasksApi.myTasks(params)
            setTasks(response.results)
            return response.results
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar minhas tarefas'
            setError(errorMessage)
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            return []
        } finally {
            setLoading(false)
        }
    }, [toast])

    /**
     * Obtém detalhes de uma tarefa
     */
    const getTask = useCallback(async (id: string) => {
        try {
            const task = await tasksApi.retrieve(id)
            return task
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao buscar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Cria nova tarefa
     */
    const createTask = useCallback(async (data: CreateTaskDto) => {
        setLoading(true)

        try {
            const newTask = await tasksApi.create(data)
            setTasks((prev) => [...prev, newTask])
            toast({
                title: 'Sucesso',
                description: 'Tarefa criada com sucesso',
            })
            return newTask
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao criar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    /**
     * Atualiza tarefa
     */
    const updateTask = useCallback(async (id: string, data: UpdateTaskDto) => {
        setLoading(true)

        try {
            const updatedTask = await tasksApi.update(id, data)
            setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
            toast({
                title: 'Sucesso',
                description: 'Tarefa atualizada com sucesso',
            })
            return updatedTask
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    /**
     * Atualiza tarefa parcialmente
     */
    const patchTask = useCallback(async (id: string, data: Partial<Task>) => {
        try {
            const updatedTask = await tasksApi.partialUpdate(id, data)
            setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
            return updatedTask
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao atualizar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Remove tarefa
     */
    const deleteTask = useCallback(async (id: string) => {
        setLoading(true)

        try {
            await tasksApi.delete(id)
            setTasks((prev) => prev.filter((task) => task.id !== id))
            toast({
                title: 'Sucesso',
                description: 'Tarefa removida com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao remover tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        } finally {
            setLoading(false)
        }
    }, [toast])

    /**
     * Executa tarefa (draft → running)
     */
    const runTask = useCallback(async (id: string) => {
        try {
            await tasksApi.run(id)
            // Atualizar tarefa localmente
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: 'running' as TaskStatus } : task
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Tarefa executada com sucesso',
            })
        } catch (err: any) {
            console.error('RunTask Error:', err, err.response?.data)
            const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Erro ao executar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Inicia tarefa (running → started)
     */
    const startTask = useCallback(async (id: string) => {
        try {
            await tasksApi.start(id)
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: 'started' as TaskStatus } : task
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Tarefa iniciada com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao iniciar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Finaliza tarefa (started → finished)
     */
    const finishTask = useCallback(async (id: string) => {
        try {
            await tasksApi.finish(id)
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: 'finished' as TaskStatus } : task
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Tarefa finalizada com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao finalizar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Recusa tarefa (running → refused)
     */
    const refuseTask = useCallback(async (id: string) => {
        try {
            await tasksApi.refuse(id)
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, status: 'refused' as TaskStatus } : task
                )
            )
            toast({
                title: 'Sucesso',
                description: 'Tarefa recusada com sucesso',
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao recusar tarefa'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Adiciona comentário à tarefa
     */
    const addComment = useCallback(async (id: string, comment: string) => {
        try {
            const response = await tasksApi.addComment(id, comment)
            toast({
                title: 'Sucesso',
                description: 'Comentário adicionado com sucesso',
            })
            return response.comment
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro ao adicionar comentário'
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            })
            throw err
        }
    }, [toast])

    /**
     * Transição de status baseada no drag-and-drop
     */
    const transitionTaskStatus = useCallback(async (id: string, newStatus: TaskStatus) => {
        const task = tasks.find((t) => t.id === id)
        if (!task) return

        try {
            // Mapeamento de status para ações FSM
            const statusActions: Record<TaskStatus, () => Promise<void>> = {
                draft: async () => { }, // Não há ação para draft
                running: async () => await runTask(id),
                started: async () => await startTask(id),
                finished: async () => await finishTask(id),
                refused: async () => await refuseTask(id),
            }

            const action = statusActions[newStatus]
            if (action) {
                await action()
            }
        } catch (err) {
            console.error('TransitionTaskStatus Error:', err)
            // Erro já tratado nas funções individuais
            throw err
        }
    }, [tasks, runTask, startTask, finishTask, refuseTask])

    return {
        tasks,
        setTasks, // Expor para updates otimistas
        loading,
        error,
        fetchTasks,
        fetchMyTasks,
        getTask,
        createTask,
        updateTask,
        patchTask,
        deleteTask,
        runTask,
        startTask,
        finishTask,
        refuseTask,
        addComment,
        transitionTaskStatus,
    }
}
