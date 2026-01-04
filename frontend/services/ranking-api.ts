import apiClient from './api-client'

export interface RankedEntity {
    entity_type: string
    entity_id: string
    score: number
    personal_score: number
    department_score: number
    organization_score: number
    sector_score: number
    last_updated: string
}

export const rankingApi = {
    /**
     * Get ranked entities for the current user
     */
    getRankedEntities: async (entityType?: string, limit = 20, viewMode: 'personal' | 'team' = 'personal'): Promise<RankedEntity[]> => {
        const response = await apiClient.get<RankedEntity[]>(
            '/api/v1/intelligence/ranking/',
            {
                params: {
                    entity_type: entityType,
                    limit,
                    view_mode: viewMode
                }
            }
        )
        return response.data
    },

    /**
     * Get ranking score for a specific entity
     */
    getEntityScore: async (entityId: string, entityType: string): Promise<RankedEntity | null> => {
        const rankings = await rankingApi.getRankedEntities(entityType, 100)
        return rankings.find(r => r.entity_id === entityId) || null
    },

    /**
     * Sort items by their ranking scores
     */
    sortByRanking: <T extends { id: string }>(
        items: T[],
        rankings: RankedEntity[]
    ): T[] => {
        return [...items].sort((a, b) => {
            const scoreA = rankings.find(r => r.entity_id === a.id)?.score || 0
            const scoreB = rankings.find(r => r.entity_id === b.id)?.score || 0
            return scoreB - scoreA
        })
    }
}
