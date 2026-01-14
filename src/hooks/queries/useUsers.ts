import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, {
    OrdocUser,
    UserOrganizationRole,
    UserGroup,
    Policy,
    AuditLog,
    CreateUserData,
    UpdateUserData,
    CreateGroupData,
    CreatePolicyData,
} from '@/services/users';

// ============================================
// QUERY KEYS
// ============================================

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...userKeys.lists(), filters] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    roles: (id: string) => [...userKeys.detail(id), 'roles'] as const,
    search: (query: string) => [...userKeys.all, 'search', query] as const,
};

export const groupKeys = {
    all: ['user-groups'] as const,
    lists: () => [...groupKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...groupKeys.lists(), filters] as const,
};

export const policyKeys = {
    all: ['policies'] as const,
    lists: () => [...policyKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...policyKeys.lists(), filters] as const,
    details: () => [...policyKeys.all, 'detail'] as const,
    detail: (id: string) => [...policyKeys.details(), id] as const,
    affectedUsers: (id: string) => [...policyKeys.detail(id), 'affected-users'] as const,
};

export const auditKeys = {
    all: ['audit-logs'] as const,
    lists: () => [...auditKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...auditKeys.lists(), filters] as const,
    byUser: (userId: string) => [...auditKeys.all, 'by-user', userId] as const,
    recent: () => [...auditKeys.all, 'recent'] as const,
    stats: () => [...auditKeys.all, 'stats'] as const,
};

export const roleKeys = {
    all: ['roles'] as const,
    available: () => [...roleKeys.all, 'available'] as const,
};

// ============================================
// USER HOOKS
// ============================================

/**
 * Hook para listar usuários da organização
 */
export function useUsers(params?: {
    type?: 'internal' | 'external';
    department?: string;
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
}) {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => userService.list(params),
    });
}

/**
 * Hook para obter usuário por ID
 */
export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getById(id),
        enabled: !!id,
    });
}

/**
 * Hook para buscar usuários
 */
export function useSearchUsers(query: string) {
    return useQuery({
        queryKey: userKeys.search(query),
        queryFn: () => userService.search(query),
        enabled: query.length >= 2, // Só busca com 2+ caracteres
    });
}

/**
 * Hook para criar usuário
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserData) => userService.create(data),
        onSuccess: () => {
            // Invalidar lista de usuários
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            // Invalidar analytics
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para atualizar usuário
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
            userService.update(id, data),
        onSuccess: (_, variables) => {
            // Invalidar detalhe do usuário
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            // Invalidar listas
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para deletar usuário
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.details() });
        },
    });
}

/**
 * Hook para ativar usuário
 */
export function useActivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.activate(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para desativar usuário
 */
export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deactivate(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para bloquear usuário
 */
export function useBlockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            userService.block(id, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para desbloquear usuário
 */
export function useUnlockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.unlock(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para forçar troca de senha
 */
export function useForcePasswordChange() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.forcePasswordChange(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
        },
    });
}

/**
 * Hook para enviar email de reset de senha
 */
export function useSendPasswordReset() {
    return useMutation({
        mutationFn: (id: string) => userService.sendPasswordReset(id),
    });
}

// ============================================
// ROLE HOOKS
// ============================================

/**
 * Hook para obter roles do usuário
 */
export function useUserRoles(userId: string) {
    return useQuery({
        queryKey: userKeys.roles(userId),
        queryFn: () => userService.getUserRoles(userId),
        enabled: !!userId,
    });
}

/**
 * Hook para obter roles disponíveis
 */
export function useAvailableRoles() {
    return useQuery({
        queryKey: roleKeys.available(),
        queryFn: () => userService.getAvailableRoles(),
    });
}

/**
 * Hook para atribuir role
 */
export function useAssignRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            userService.assignRole(userId, role),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.userId) });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

/**
 * Hook para remover role
 */
export function useRemoveRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            userService.removeRole(userId, role),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.userId) });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}

// ============================================
// 2FA HOOKS
// ============================================

/**
 * Hook para habilitar 2FA
 */
export function useEnable2FA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => userService.enable2FA(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
        },
    });
}

/**
 * Hook para desabilitar 2FA
 */
export function useDisable2FA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, code }: { userId: string; code: string }) =>
            userService.disable2FA(userId, code),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
        },
    });
}

// ============================================
// USER GROUP HOOKS
// ============================================

/**
 * Hook para listar grupos de usuários
 */
export function useUserGroups(params?: { organization_id?: string; search?: string }) {
    return useQuery({
        queryKey: groupKeys.list(params),
        queryFn: () => userService.listGroups(params),
    });
}

/**
 * Hook para criar grupo de usuários
 */
export function useCreateUserGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroupData) => userService.createGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
}

/**
 * Hook para adicionar usuários ao grupo
 */
export function useAddUsersToGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, userIds }: { groupId: string; userIds: string[] }) =>
            userService.addUsersToGroup(groupId, userIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
}

/**
 * Hook para remover usuários do grupo
 */
export function useRemoveUsersFromGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ groupId, userIds }: { groupId: string; userIds: string[] }) =>
            userService.removeUsersFromGroup(groupId, userIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
}

// ============================================
// POLICY HOOKS
// ============================================

/**
 * Hook para listar políticas
 */
export function usePolicies(params?: {
    effect?: 'allow' | 'deny';
    service?: string;
    source?: 'system' | 'customer';
    is_public?: boolean;
    search?: string;
}) {
    return useQuery({
        queryKey: policyKeys.list(params),
        queryFn: () => userService.listPolicies(params),
    });
}

/**
 * Hook para criar política
 */
export function useCreatePolicy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePolicyData) => userService.createPolicy(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
        },
    });
}

/**
 * Hook para atualizar política
 */
export function useUpdatePolicy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreatePolicyData> }) =>
            userService.updatePolicy(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
        },
    });
}

/**
 * Hook para toggle status da política
 */
export function useTogglePolicyStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.togglePolicyStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: policyKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
        },
    });
}

/**
 * Hook para anexar política a usuários
 */
export function useAttachPolicyToUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ policyId, userIds }: { policyId: string; userIds: string[] }) =>
            userService.attachPolicyToUsers(policyId, userIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.policyId) });
            queryClient.invalidateQueries({
                queryKey: policyKeys.affectedUsers(variables.policyId),
            });
        },
    });
}

/**
 * Hook para obter usuários afetados pela política
 */
export function usePolicyAffectedUsers(policyId: string) {
    return useQuery({
        queryKey: policyKeys.affectedUsers(policyId),
        queryFn: () => userService.getPolicyAffectedUsers(policyId),
        enabled: !!policyId,
    });
}

// ============================================
// AUDIT LOG HOOKS
// ============================================

/**
 * Hook para listar logs de auditoria
 */
export function useAuditLogs(params?: {
    action?: string;
    user?: string;
    target_user?: string;
    search?: string;
    page?: number;
}) {
    return useQuery({
        queryKey: auditKeys.list(params),
        queryFn: () => userService.listAuditLogs(params),
    });
}

/**
 * Hook para obter logs de auditoria por usuário
 */
export function useAuditLogsByUser(userId: string) {
    return useQuery({
        queryKey: auditKeys.byUser(userId),
        queryFn: () => userService.getAuditLogsByUser(userId),
        enabled: !!userId,
    });
}

/**
 * Hook para obter logs recentes (24h)
 */
export function useRecentAuditLogs() {
    return useQuery({
        queryKey: auditKeys.recent(),
        queryFn: () => userService.getRecentAuditLogs(),
    });
}

/**
 * Hook para obter estatísticas de auditoria
 */
export function useAuditLogStats() {
    return useQuery({
        queryKey: auditKeys.stats(),
        queryFn: () => userService.getAuditLogStats(),
    });
}
