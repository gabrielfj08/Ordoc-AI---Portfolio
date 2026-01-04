import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { produce } from 'immer'
import { myDayApi, type DashboardOverview, type RecentDocument, type ActiveWorkflow, type PendingSummary, type DashboardConfig } from '@/services/my-day-api'
import { documentsApi, type StorageStats } from '@/services/documents-api'
import { rankingApi, type RankedEntity } from '@/services/ranking-api'
import { analysisApi, alertsApi, patternsApi } from '@/services/intelligence-api'
import { tasksApi } from '@/app/processes/api'
import type { Task } from '@/app/processes/types'


// --- Data Types ---

export interface MyDayData {
    overview: DashboardOverview | null
    recentDocuments: RecentDocument[]
    activeWorkflows: ActiveWorkflow[]
    pending: PendingSummary
    userName: string
    dashboardConfig: DashboardConfig | null
    enabledCardIds: string[]
    viewMode: 'personal' | 'team'
    canAccessTeamView: boolean
    privacyMode: {
        mode: string
        compliant: boolean
        lgpd_ready: boolean
        data_residency: string
    } | null
    continueWorkingItems: {
        lastTask: any | null
        lastDocument: RecentDocument | null
    } | null
    storageStats: StorageStats | null
    aiStats: {
        analysisCount: number
        alertsCount: number
        patternsCount: number
        systemStatus: string
    } | null
    priorityTasks: Task[]
}

export interface RankingState {
    documentRankings: RankedEntity[]
    taskRankings: RankedEntity[]
    procedureRankings: RankedEntity[]
    isRankingEnabled: boolean
    isRankingLoading: boolean
    lastUpdated: string | null
}

export interface CardPreferences {
    pinnedCards: string[]
    hiddenCards: string[]
    customOrder: string[]
    lastModified: string
}

// --- State and Actions Types ---

interface MyDayStateBase extends MyDayData, RankingState {
    // Loading states
    isLoading: boolean
    error: string | null

    // Card preferences
    cardPreferences: CardPreferences

    // Actions
    fetchDashboardData: () => Promise<void>
    fetchRankings: (entityTypes?: string[]) => Promise<void>
    toggleRanking: () => void
    setRankingEnabled: (enabled: boolean) => void
    setViewMode: (mode: 'personal' | 'team') => Promise<void>

    // Card preference actions
    pinCard: (cardId: string) => void
    hideCard: (cardId: string) => void
    unhideCard: (cardId: string) => void
    resetCardLayout: () => void

    // Utility methods
    getSortedDocuments: () => RecentDocument[]
    getSortedWorkflows: () => ActiveWorkflow[]
    getDocumentScore: (documentId: string) => number
    getWorkflowScore: (workflowId: string) => number
    reset: () => void
}

// Export for use in other modules
export type MyDayState = MyDayStateBase

// --- Initial State ---

const initialState: MyDayData & RankingState & { isLoading: boolean; error: string | null; cardPreferences: CardPreferences } = {
    // Dashboard data
    overview: null,
    recentDocuments: [],
    activeWorkflows: [],
    pending: { pending_signatures: 0, pending_approvals: 0 },
    userName: '',
    dashboardConfig: null,
    enabledCardIds: [],
    viewMode: 'personal',
    canAccessTeamView: false,
    privacyMode: null,
    continueWorkingItems: null,
    storageStats: null,
    aiStats: null,
    priorityTasks: [],

    // Ranking data
    documentRankings: [],
    taskRankings: [],
    procedureRankings: [],
    isRankingEnabled: true,
    isRankingLoading: false,
    lastUpdated: null,

    // Card preferences
    cardPreferences: {
        pinnedCards: [],
        hiddenCards: [],
        customOrder: [],
        lastModified: new Date().toISOString(),
    },

    // Loading states
    isLoading: false,
    error: null,
}

// --- Store Creation ---

/**
 * NOTE: TypeScript error on line 100 is a known Zustand issue with nested middlewares.
 * The code works correctly at runtime. See: https://github.com/pmndrs/zustand/issues/1937
 */
export const useMyDayStore = create<MyDayState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Fetch all dashboard data
            fetchDashboardData: async () => {
                set({ isLoading: true, error: null })
                try {
                    const [dashboardConfig, overview, documents, workflows, pending, userInfo, privacyInfo, analysisRes, alertsRes, patternsRes, continueWorkingRes, storageRes, tasksRes] = await Promise.all([
                        myDayApi.getDashboardConfig().catch(() => null),
                        myDayApi.getDashboardOverview(),
                        myDayApi.getRecentDocuments(30),
                        myDayApi.getActiveWorkflows(10),
                        myDayApi.getPendingSummary(),
                        myDayApi.getUserInfo(),
                        analysisApi.getStatus().catch(() => null),
                        // Fetch counts for AI stats
                        analysisApi.list({}).catch(() => ({ count: 0 })),
                        alertsApi.list({}).catch(() => ({ count: 0 })),
                        patternsApi.list({}).catch(() => ({ count: 0 })),
                        myDayApi.getContinueWorkingItems().catch(() => null),
                        documentsApi.getStorageStats().catch(() => null),
                        tasksApi.myTasks({ status: 'running,started,draft', page_size: 20 }).catch(() => ({ results: [] })),
                    ])

                    const aiStats = {
                        analysisCount: (analysisRes as any)?.count || 0,
                        alertsCount: (alertsRes as any)?.count || 0,
                        patternsCount: (patternsRes as any)?.count || 0,
                        systemStatus: (privacyInfo as any)?.status || 'Online'
                    }



                    set({
                        dashboardConfig: dashboardConfig as DashboardConfig | null,
                        enabledCardIds: (dashboardConfig as any)?.dashboard?.cards || [],
                        overview,
                        recentDocuments: documents,
                        activeWorkflows: workflows,
                        pending,
                        userName: userInfo.first_name || userInfo.username || '',
                        viewMode: userInfo.view_mode || 'personal',
                        canAccessTeamView: (dashboardConfig as any)?.user?.can_access_team_view ?? (userInfo.can_access_team_view || false),
                        privacyMode: privacyInfo ? (privacyInfo as any).privacy : null,
                        continueWorkingItems: continueWorkingRes,
                        storageStats: storageRes,
                        aiStats,
                        priorityTasks: (tasksRes as any)?.results || [],
                        isLoading: false,
                    })

                    // Auto-fetch rankings after loading data
                    get().fetchRankings(['document', 'task', 'procedure'])
                } catch (error) {
                    console.error('Error fetching dashboard data:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load dashboard',
                        isLoading: false,
                    })
                }
            },

            // Fetch rankings for specified entity types
            fetchRankings: async (entityTypes = ['document', 'task', 'procedure']) => {
                set({ isRankingLoading: true })
                try {
                    const state = get()
                    const results = await Promise.all(
                        entityTypes.map(type => rankingApi.getRankedEntities(type, 50, state.viewMode))
                    )

                    const updates: Partial<RankingState> = {
                        isRankingLoading: false,
                        lastUpdated: new Date().toISOString(),
                    }

                    entityTypes.forEach((type, index) => {
                        if (type === 'document') updates.documentRankings = results[index]
                        if (type === 'task') updates.taskRankings = results[index]
                        if (type === 'procedure') updates.procedureRankings = results[index]
                    })

                    set(updates)
                } catch (error) {
                    console.error('Error fetching rankings:', error)
                    set({ isRankingLoading: false })
                }
            },

            // Set view mode (personal/team)
            setViewMode: async (mode: 'personal' | 'team') => {
                const state = get()
                if (mode === 'team' && !state.canAccessTeamView) {
                    console.error('User does not have permission for team view')
                    return
                }

                try {
                    // Update preference in backend
                    await myDayApi.updateUserPreferences({ view_mode: mode })

                    // Update local state
                    set({ viewMode: mode })

                    // Refresh rankings with new context
                    await get().fetchRankings(['document', 'task', 'procedure'])
                } catch (error) {
                    console.error('Error updating view mode:', error)
                }
            },

            // Toggle ranking on/off
            toggleRanking: () => {
                set(state => ({ isRankingEnabled: !state.isRankingEnabled }))
            },

            // Set ranking enabled state
            setRankingEnabled: (enabled: boolean) => {
                set({ isRankingEnabled: enabled })
            },

            // Get sorted documents based on ranking
            getSortedDocuments: () => {
                const state = get()

                if (!state.isRankingEnabled || state.documentRankings.length === 0) {
                    return state.recentDocuments
                }

                return rankingApi.sortByRanking(
                    state.recentDocuments,
                    state.documentRankings
                )
            },

            // Get sorted workflows based on ranking
            getSortedWorkflows: () => {
                const state = get()

                if (!state.isRankingEnabled || state.procedureRankings.length === 0) {
                    return state.activeWorkflows
                }

                return rankingApi.sortByRanking(
                    state.activeWorkflows,
                    state.procedureRankings
                )
            },

            // Get score for a specific document
            getDocumentScore: (documentId: string) => {
                const state = get()
                const ranking = state.documentRankings.find(r => r.entity_id === documentId)
                return ranking?.score || 0
            },

            // Get score for a specific workflow/procedure
            getWorkflowScore: (workflowId: string) => {
                const state = get()
                const ranking = state.procedureRankings.find(r => r.entity_id === workflowId)
                return ranking?.score || 0
            },

            // Pin a card to top
            pinCard: (cardId: string) => {
                (set as any)(
                    produce((state: MyDayStateBase) => {
                        if (!state.cardPreferences.pinnedCards.includes(cardId)) {
                            state.cardPreferences.pinnedCards.push(cardId)
                        }
                        // Remove from hidden if it was hidden
                        state.cardPreferences.hiddenCards = state.cardPreferences.hiddenCards.filter(
                            id => id !== cardId
                        )
                        state.cardPreferences.lastModified = new Date().toISOString()
                    })
                )
            },

            // Hide a card
            hideCard: (cardId: string) => {
                (set as any)(
                    produce((state: MyDayStateBase) => {
                        if (!state.cardPreferences.hiddenCards.includes(cardId)) {
                            state.cardPreferences.hiddenCards.push(cardId)
                        }
                        // Remove from pinned if it was pinned
                        state.cardPreferences.pinnedCards = state.cardPreferences.pinnedCards.filter(
                            id => id !== cardId
                        )
                        state.cardPreferences.lastModified = new Date().toISOString()
                    })
                )
            },

            // Unhide a card
            unhideCard: (cardId: string) => {
                (set as any)(
                    produce((state: MyDayStateBase) => {
                        state.cardPreferences.hiddenCards = state.cardPreferences.hiddenCards.filter(
                            id => id !== cardId
                        )
                        state.cardPreferences.lastModified = new Date().toISOString()
                    })
                )
            },

            // Reset card layout to default
            resetCardLayout: () => {
                (set as any)(
                    produce((state: MyDayStateBase) => {
                        state.cardPreferences = {
                            pinnedCards: [],
                            hiddenCards: [],
                            customOrder: [],
                            lastModified: new Date().toISOString(),
                        }
                    })
                )
            },

            // Reset store to initial state
            reset: () => {
                set(initialState)
            },
        }),
        { name: 'MyDayStore' }
    )
)

// --- Selectors (for optimized re-renders) ---

export const selectDashboardOverview = (state: MyDayState) => state.overview
export const selectRecentDocuments = (state: MyDayState) => state.recentDocuments
export const selectSortedDocuments = (state: MyDayState) => state.getSortedDocuments()
export const selectActiveWorkflows = (state: MyDayState) => state.activeWorkflows
export const selectSortedWorkflows = (state: MyDayState) => state.getSortedWorkflows()
export const selectPending = (state: MyDayState) => state.pending
export const selectIsRankingEnabled = (state: MyDayState) => state.isRankingEnabled
export const selectDocumentRankings = (state: MyDayState) => state.documentRankings
export const selectProcedureRankings = (state: MyDayState) => state.procedureRankings
export const selectIsLoading = (state: MyDayState) => state.isLoading
export const selectViewMode = (state: MyDayState) => state.viewMode
export const selectCanAccessTeamView = (state: MyDayState) => state.canAccessTeamView
export const selectPrivacyMode = (state: MyDayState) => state.privacyMode
export const selectAiStats = (state: MyDayState) => state.aiStats
export const selectStorageStats = (state: MyDayState) => state.storageStats
