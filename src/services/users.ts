import { apiClient, handleApiError } from './api';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface OrdocUser {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;

    // OrdocUser specific fields
    status: 'pending' | 'active' | 'blocked' | 'inactive';
    status_display: string;
    is_external: boolean;
    phone?: string;
    cpf?: string;
    date_of_birth?: string;
    registration_number?: string;
    avatar?: string;
    profile_complete: number;

    // Preferences
    language: string;
    language_display: string;
    timezone: string;
    email_notifications: boolean;

    // Security
    must_change_password: boolean;
    password_changed_at?: string;
    failed_attempts: number;
    last_login_at?: string;
    last_login_ip?: string;
    two_factor_enabled: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Related
    roles?: UserOrganizationRole[];
    current_role?: {
        id: string;
        name: string;
        code: string;
    };
    department?: {
        id: string;
        name: string;
    };
}

export interface UserOrganizationRole {
    id: string;
    user: string;
    user_name: string;
    organization: string;
    organization_name: string;
    role: 'admin' | 'organization_manager' | 'organization_member' | 'department_manager' | 'department_member';
    role_display: string;
    is_active: boolean;
    is_primary: boolean;
    started_at: string;
    ended_at?: string;
    assigned_by?: string;
    assigned_by_name?: string;
    created_at: string;
    updated_at: string;
}

export interface UserGroup {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    users_count: number;
    created_at: string;
    updated_at: string;
}

export interface Policy {
    id: string;
    name: string;
    description: string;
    effect: 'allow' | 'deny';
    effect_display: string;
    service: string;
    service_display: string;
    resource: string[] | null;
    actions: string[] | null;
    conditions: Record<string, any> | null;
    source: 'system' | 'customer';
    source_display: string;
    is_public: boolean;
    is_active: boolean;
    priority: number;
    version: number;
    user_groups_count: number;
    users_count: number;
    created_by?: string;
    created_by_name?: string;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: string;
    action: string;
    action_display: string;
    description: string;
    user?: string;
    user_name: string;
    target_user?: string;
    target_user_name?: string;
    target_type?: string;
    target_id?: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    organization: string;
    created_at: string;
}

export interface CreateUserData {
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    phone?: string;
    cpf?: string;
    date_of_birth?: string;
    registration_number?: string;
    role?: string;
    send_welcome_email?: boolean;
}

export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
}

export interface CreateGroupData {
    name: string;
    description?: string;
    organization_id?: string;
    is_active?: boolean;
}

export interface CreatePolicyData {
    name: string;
    description?: string;
    effect: 'allow' | 'deny';
    service?: string;
    resource?: string[];
    actions?: string[];
    conditions?: Record<string, any>;
    is_public?: boolean;
    is_active?: boolean;
    priority?: number;
}

// ============================================
// USER SERVICE
// ============================================

class UserService {
    private baseUrl = '/ordoc-cloud';

    // ==================== USERS ====================

    /**
     * List all users in current organization
     */
    async list(params?: {
        type?: 'internal' | 'external';
        department?: string;
        role?: string;
        status?: string;
        search?: string;
        page?: number;
        page_size?: number;
    }): Promise<{ results: OrdocUser[]; count: number }> {
        try {
            const response = await apiClient.get<{ results: OrdocUser[]; count: number }>(
                `${this.baseUrl}/users/`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get user by ID
     */
    async getById(id: string): Promise<OrdocUser> {
        try {
            const response = await apiClient.get<OrdocUser>(`${this.baseUrl}/users/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Create new user
     */
    async create(data: CreateUserData): Promise<OrdocUser> {
        try {
            const response = await apiClient.post<OrdocUser>(`${this.baseUrl}/users/`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Update user
     */
    async update(id: string, data: UpdateUserData): Promise<OrdocUser> {
        try {
            const response = await apiClient.patch<OrdocUser>(`${this.baseUrl}/users/${id}/`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Delete user (soft delete)
     */
    async delete(id: string): Promise<void> {
        try {
            await apiClient.delete(`${this.baseUrl}/users/${id}/`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Activate user
     */
    async activate(id: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/activate/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Deactivate user
     */
    async deactivate(id: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/deactivate/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Block user account
     */
    async block(id: string, reason?: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/block/`, { reason });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Unlock user account
     */
    async unlock(id: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/unlock/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Force password change
     */
    async forcePasswordChange(id: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/force_password_change/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${id}/send_password_reset/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Search users
     */
    async search(query: string): Promise<OrdocUser[]> {
        try {
            const response = await apiClient.get<OrdocUser[]>(`${this.baseUrl}/users/search/`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // ==================== ROLES ====================

    /**
     * Get user roles
     */
    async getUserRoles(userId: string): Promise<UserOrganizationRole[]> {
        try {
            const response = await apiClient.get<UserOrganizationRole[]>(
                `${this.baseUrl}/users/${userId}/roles/`
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Assign role to user
     */
    async assignRole(userId: string, role: string): Promise<UserOrganizationRole> {
        try {
            const response = await apiClient.post<UserOrganizationRole>(
                `${this.baseUrl}/users/${userId}/assign_role/`,
                { role }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Remove role from user
     */
    async removeRole(userId: string, role: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${userId}/remove_role/`, {
                role
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get available roles
     */
    async getAvailableRoles(): Promise<{ code: string; name: string }[]> {
        try {
            const response = await apiClient.get<{ code: string; name: string }[]>(
                `${this.baseUrl}/roles/available_roles/`
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // ==================== 2FA ====================

    /**
     * Enable 2FA for user
     */
    async enable2FA(userId: string): Promise<{
        secret: string;
        uri: string;
        backup_codes: string[];
    }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${userId}/enable_2fa/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Disable 2FA for user
     */
    async disable2FA(userId: string, code: string): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(`${this.baseUrl}/users/${userId}/disable_2fa/`, {
                code
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // ==================== USER GROUPS ====================

    /**
     * List all user groups
     */
    async listGroups(params?: {
        organization_id?: string;
        search?: string;
    }): Promise<{ results: UserGroup[] }> {
        try {
            const response = await apiClient.get<{ results: UserGroup[] }>(
                `${this.baseUrl}/user-groups/`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Create user group
     */
    async createGroup(data: CreateGroupData): Promise<UserGroup> {
        try {
            const response = await apiClient.post<UserGroup>(
                `${this.baseUrl}/user-groups/`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Add users to group
     */
    async addUsersToGroup(groupId: string, userIds: string[]): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(
                `${this.baseUrl}/user-groups/${groupId}/add_users/`,
                { user_ids: userIds }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Remove users from group
     */
    async removeUsersFromGroup(groupId: string, userIds: string[]): Promise<{ status: string }> {
        try {
            const response = await apiClient.post(
                `${this.baseUrl}/user-groups/${groupId}/remove_users/`,
                { user_ids: userIds }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // ==================== POLICIES ====================

    /**
     * List all policies
     */
    async listPolicies(params?: {
        effect?: 'allow' | 'deny';
        service?: string;
        source?: 'system' | 'customer';
        is_public?: boolean;
        search?: string;
    }): Promise<{ results: Policy[] }> {
        try {
            const response = await apiClient.get<{ results: Policy[] }>(
                `${this.baseUrl}/policies/`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Create policy
     */
    async createPolicy(data: CreatePolicyData): Promise<Policy> {
        try {
            const response = await apiClient.post<Policy>(`${this.baseUrl}/policies/`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Update policy
     */
    async updatePolicy(id: string, data: Partial<CreatePolicyData>): Promise<Policy> {
        try {
            const response = await apiClient.patch<Policy>(
                `${this.baseUrl}/policies/${id}/`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Toggle policy status
     */
    async togglePolicyStatus(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/policies/${id}/toggle_status/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Attach policy to users
     */
    async attachPolicyToUsers(policyId: string, userIds: string[]): Promise<{
        status: string;
        attached_count: number;
    }> {
        try {
            const response = await apiClient.post(
                `${this.baseUrl}/policies/${policyId}/attach_users/`,
                { user_ids: userIds }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get affected users by policy
     */
    async getPolicyAffectedUsers(policyId: string): Promise<{
        total: number;
        users: OrdocUser[];
    }> {
        try {
            const response = await apiClient.get(
                `${this.baseUrl}/policies/${policyId}/affected_users/`
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // ==================== AUDIT LOGS ====================

    /**
     * List audit logs
     */
    async listAuditLogs(params?: {
        action?: string;
        user?: string;
        target_user?: string;
        search?: string;
        page?: number;
    }): Promise<{ results: AuditLog[]; count: number }> {
        try {
            const response = await apiClient.get<{ results: AuditLog[]; count: number }>(
                `${this.baseUrl}/audit-logs/`,
                { params }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get audit logs by user
     */
    async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
        try {
            const response = await apiClient.get<AuditLog[]>(
                `${this.baseUrl}/audit-logs/by_user/`,
                { params: { user_id: userId } }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get recent audit logs (last 24h)
     */
    async getRecentAuditLogs(): Promise<AuditLog[]> {
        try {
            const response = await apiClient.get<AuditLog[]>(
                `${this.baseUrl}/audit-logs/recent/`
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get audit log statistics
     */
    async getAuditLogStats(): Promise<{
        total_last_7_days: number;
        by_action: { action: string; count: number }[];
        top_users: { user__user__username: string; count: number }[];
    }> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/audit-logs/stats/`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

// Export singleton instance
const userService = new UserService();
export default userService;
