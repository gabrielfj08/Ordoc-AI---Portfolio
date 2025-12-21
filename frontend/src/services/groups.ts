import api from './auth';

export interface Group {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    organization: string;
    members_count?: number; // Backend might not return this, need to check or compute
    permissions?: string[]; // Backend relation?
    created_at: string;
    updated_at: string;
}

export interface CreateGroupData {
    name: string;
    description?: string;
    is_active?: boolean;
    organization_id?: string;
}

export interface UpdateGroupData {
    name?: string;
    description?: string;
    is_active?: boolean;
}

export interface GroupsListParams {
    page?: number;
    per_page?: number;
    search?: string;
    ordering?: string;
}

export interface GroupsListResponse {
    results: Group[];
    count: number;
    next: string | null;
    previous: string | null;
}

class GroupsService {
    async getGroups(params: GroupsListParams = {}): Promise<GroupsListResponse> {
        const response = await api.get('/api/v1/ordoc-cloud/user-groups/', { params });
        return response.data;
    }

    async getGroup(groupId: string): Promise<Group> {
        const response = await api.get(`/api/v1/ordoc-cloud/user-groups/${groupId}/`);
        return response.data;
    }

    async createGroup(data: CreateGroupData): Promise<Group> {
        try {
            const response = await api.post('/api/v1/ordoc-cloud/user-groups/', data);
            return response.data;
        } catch (error: any) {
            // Extract backend validation message
            if (error.response?.data?.name) {
                throw new Error(error.response.data.name[0]);
            } else if (error.response?.data?.organization_id) {
                throw new Error(error.response.data.organization_id[0]);
            } else if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    async updateGroup(groupId: string, data: UpdateGroupData): Promise<Group> {
        const response = await api.patch(`/api/v1/ordoc-cloud/user-groups/${groupId}/`, data);
        return response.data;
    }

    async deleteGroup(groupId: string): Promise<void> {
        await api.delete(`/api/v1/ordoc-cloud/user-groups/${groupId}/`);
    }

    async addUsersToGroup(groupId: string, userIds: string[]): Promise<void> {
        await api.post(`/api/v1/ordoc-cloud/user-groups/${groupId}/add_users/`, { user_ids: userIds });
    }

    async removeUsersFromGroup(groupId: string, userIds: string[]): Promise<void> {
        await api.post(`/api/v1/ordoc-cloud/user-groups/${groupId}/remove_users/`, { user_ids: userIds });
    }
}

export const groupsService = new GroupsService();
