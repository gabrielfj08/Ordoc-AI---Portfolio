import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { 
  User, 
  Permission, 
  UserRole,
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  isAdmin,
  isOrganizationManager,
  canManageOrganization,
  canManageUsers,
  canViewAnalytics,
  getHighestRole,
  getRoleDisplayName,
  getAvailableActions
} from '@/utils/permissions';

// Mock user data - In real implementation this would come from AuthContext
const mockUser: User = {
  id: '1',
  email: 'admin@ordoc.ai',
  name: 'Administrador',
  roles: [UserRole.ADMIN],
  organizationId: '1'
};

export function usePermissions() {
  // In real implementation, get user from AuthContext
  // const { user } = useContext(AuthContext);
  const user = mockUser; // Using mock for now
  
  return {
    user,
    
    // Permission checking functions
    hasPermission: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    
    // Role checking functions
    isAdmin: () => isAdmin(user),
    isOrganizationManager: () => isOrganizationManager(user),
    
    // Feature-specific permissions
    canManageOrganization: () => canManageOrganization(user),
    canManageUsers: () => canManageUsers(user),
    canViewAnalytics: () => canViewAnalytics(user),
    
    // Utility functions
    getHighestRole: () => getHighestRole(user),
    getRoleDisplayName: (role: UserRole) => getRoleDisplayName(role),
    getAvailableActions: (context: 'organization' | 'user' | 'document') => 
      getAvailableActions(user, context),
    
    // UI helper functions
    canCreateOrganization: () => hasPermission(user, Permission.CREATE_ORGANIZATION),
    canEditOrganization: () => hasPermission(user, Permission.EDIT_ORGANIZATION),
    canDeleteOrganization: () => hasPermission(user, Permission.DELETE_ORGANIZATION),
    canActivateOrganization: () => hasPermission(user, Permission.ACTIVATE_ORGANIZATION),
    
    canCreateUser: () => hasPermission(user, Permission.CREATE_USER),
    canEditUser: () => hasPermission(user, Permission.EDIT_USER),
    canDeleteUser: () => hasPermission(user, Permission.DELETE_USER),
    canViewUsers: () => hasPermission(user, Permission.VIEW_USERS),
    
    canViewDocuments: () => hasPermission(user, Permission.VIEW_DOCUMENTS),
    canCreateDocument: () => hasPermission(user, Permission.CREATE_DOCUMENT),
    canEditDocument: () => hasPermission(user, Permission.EDIT_DOCUMENT),
    canDeleteDocument: () => hasPermission(user, Permission.DELETE_DOCUMENT),
    canShareDocuments: () => hasPermission(user, Permission.SHARE_DOCUMENTS),
    
    canManageSettings: () => hasPermission(user, Permission.MANAGE_SETTINGS),
    canConfigureIntegrations: () => hasPermission(user, Permission.CONFIGURE_INTEGRATIONS),
    canExportData: () => hasPermission(user, Permission.EXPORT_DATA),
  };
}

// Component wrapper for permission-based rendering
export function WithPermission({ 
  permission, 
  permissions,
  requireAll = false,
  fallback = null,
  children 
}: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Hook for conditional rendering based on roles
export function useRoleAccess() {
  const permissions = usePermissions();
  
  return {
    ...permissions,
    
    // Component visibility helpers
    showCreateButton: (context: 'organization' | 'user' | 'document') => {
      switch (context) {
        case 'organization': return permissions.canCreateOrganization();
        case 'user': return permissions.canCreateUser();
        case 'document': return permissions.canCreateDocument();
        default: return false;
      }
    },
    
    showEditButton: (context: 'organization' | 'user' | 'document') => {
      switch (context) {
        case 'organization': return permissions.canEditOrganization();
        case 'user': return permissions.canEditUser();
        case 'document': return permissions.canEditDocument();
        default: return false;
      }
    },
    
    showDeleteButton: (context: 'organization' | 'user' | 'document') => {
      switch (context) {
        case 'organization': return permissions.canDeleteOrganization();
        case 'user': return permissions.canDeleteUser();
        case 'document': return permissions.canDeleteDocument();
        default: return false;
      }
    },
    
    showAnalyticsTab: () => permissions.canViewAnalytics(),
    showSettingsTab: () => permissions.canManageSettings(),
    showUsersSection: () => permissions.canViewUsers(),
    showExportButton: () => permissions.canExportData(),
  };
}