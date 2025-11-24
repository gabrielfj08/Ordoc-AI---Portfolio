// User roles and permissions system
export enum UserRole {
  ADMIN = 'admin',
  ORGANIZATION_MANAGER = 'organization_manager',
  ORGANIZATION_MEMBER = 'organization_member',
  DEPARTMENT_MANAGER = 'department_manager',
  DEPARTMENT_MEMBER = 'department_member',
  EXTERNAL_USER = 'external_user'
}

export enum Permission {
  // Organization permissions
  CREATE_ORGANIZATION = 'create_organization',
  EDIT_ORGANIZATION = 'edit_organization',
  DELETE_ORGANIZATION = 'delete_organization',
  VIEW_ORGANIZATION = 'view_organization',
  ACTIVATE_ORGANIZATION = 'activate_organization',
  
  // User management permissions
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  VIEW_USERS = 'view_users',
  MANAGE_USER_ROLES = 'manage_user_roles',
  
  // Document permissions
  CREATE_DOCUMENT = 'create_document',
  EDIT_DOCUMENT = 'edit_document',
  DELETE_DOCUMENT = 'delete_document',
  VIEW_DOCUMENTS = 'view_documents',
  SHARE_DOCUMENTS = 'share_documents',
  
  // Analytics permissions
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
  
  // Settings permissions
  MANAGE_SETTINGS = 'manage_settings',
  CONFIGURE_INTEGRATIONS = 'configure_integrations',
}

// Role-based permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission)
  ],
  
  [UserRole.ORGANIZATION_MANAGER]: [
    Permission.EDIT_ORGANIZATION,
    Permission.VIEW_ORGANIZATION,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.VIEW_USERS,
    Permission.MANAGE_USER_ROLES,
    Permission.CREATE_DOCUMENT,
    Permission.EDIT_DOCUMENT,
    Permission.DELETE_DOCUMENT,
    Permission.VIEW_DOCUMENTS,
    Permission.SHARE_DOCUMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_SETTINGS,
    Permission.CONFIGURE_INTEGRATIONS,
  ],
  
  [UserRole.ORGANIZATION_MEMBER]: [
    Permission.VIEW_ORGANIZATION,
    Permission.VIEW_USERS,
    Permission.CREATE_DOCUMENT,
    Permission.EDIT_DOCUMENT,
    Permission.VIEW_DOCUMENTS,
    Permission.SHARE_DOCUMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
  ],
  
  [UserRole.DEPARTMENT_MANAGER]: [
    Permission.VIEW_ORGANIZATION,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.VIEW_USERS,
    Permission.CREATE_DOCUMENT,
    Permission.EDIT_DOCUMENT,
    Permission.DELETE_DOCUMENT,
    Permission.VIEW_DOCUMENTS,
    Permission.SHARE_DOCUMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_REPORTS,
  ],
  
  [UserRole.DEPARTMENT_MEMBER]: [
    Permission.VIEW_ORGANIZATION,
    Permission.VIEW_USERS,
    Permission.CREATE_DOCUMENT,
    Permission.EDIT_DOCUMENT,
    Permission.VIEW_DOCUMENTS,
    Permission.SHARE_DOCUMENTS,
  ],
  
  [UserRole.EXTERNAL_USER]: [
    Permission.VIEW_DOCUMENTS,
  ]
};

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  organizationId?: string;
  departmentId?: string;
}

// Check if user has specific permission
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  // Check if any of user's roles has the required permission
  return user.roles.some(role => 
    rolePermissions[role]?.includes(permission)
  );
}

// Check if user has any of the specified permissions
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
}

// Check if user has all specified permissions
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
  return user?.roles?.includes(UserRole.ADMIN) || false;
}

// Check if user is organization manager
export function isOrganizationManager(user: User | null): boolean {
  return user?.roles?.includes(UserRole.ORGANIZATION_MANAGER) || false;
}

// Check if user can manage organization
export function canManageOrganization(user: User | null): boolean {
  return hasAnyPermission(user, [
    Permission.EDIT_ORGANIZATION,
    Permission.DELETE_ORGANIZATION,
    Permission.ACTIVATE_ORGANIZATION
  ]);
}

// Check if user can manage users
export function canManageUsers(user: User | null): boolean {
  return hasAnyPermission(user, [
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_USER_ROLES
  ]);
}

// Check if user can view analytics
export function canViewAnalytics(user: User | null): boolean {
  return hasPermission(user, Permission.VIEW_ANALYTICS);
}

// Get user's highest role priority (for UI purposes)
export function getHighestRole(user: User | null): UserRole | null {
  if (!user?.roles || user.roles.length === 0) return null;
  
  const rolePriority = {
    [UserRole.ADMIN]: 6,
    [UserRole.ORGANIZATION_MANAGER]: 5,
    [UserRole.DEPARTMENT_MANAGER]: 4,
    [UserRole.ORGANIZATION_MEMBER]: 3,
    [UserRole.DEPARTMENT_MEMBER]: 2,
    [UserRole.EXTERNAL_USER]: 1,
  };
  
  return user.roles.reduce((highest, current) => {
    return rolePriority[current] > (rolePriority[highest] || 0) ? current : highest;
  }, user.roles[0]);
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.ORGANIZATION_MANAGER]: 'Gerente da Organização',
    [UserRole.ORGANIZATION_MEMBER]: 'Membro da Organização', 
    [UserRole.DEPARTMENT_MANAGER]: 'Gerente do Departamento',
    [UserRole.DEPARTMENT_MEMBER]: 'Membro do Departamento',
    [UserRole.EXTERNAL_USER]: 'Usuário Externo',
  };
  
  return roleNames[role] || role;
}

// Filter actions based on user permissions
export function getAvailableActions(user: User | null, context: 'organization' | 'user' | 'document' = 'organization') {
  const actions = [];
  
  switch (context) {
    case 'organization':
      if (hasPermission(user, Permission.VIEW_ORGANIZATION)) {
        actions.push('view');
      }
      if (hasPermission(user, Permission.EDIT_ORGANIZATION)) {
        actions.push('edit');
      }
      if (hasPermission(user, Permission.DELETE_ORGANIZATION)) {
        actions.push('delete');
      }
      if (hasPermission(user, Permission.ACTIVATE_ORGANIZATION)) {
        actions.push('activate', 'deactivate');
      }
      break;
      
    case 'user':
      if (hasPermission(user, Permission.VIEW_USERS)) {
        actions.push('view');
      }
      if (hasPermission(user, Permission.EDIT_USER)) {
        actions.push('edit');
      }
      if (hasPermission(user, Permission.DELETE_USER)) {
        actions.push('delete');
      }
      if (hasPermission(user, Permission.MANAGE_USER_ROLES)) {
        actions.push('manage_roles');
      }
      break;
      
    case 'document':
      if (hasPermission(user, Permission.VIEW_DOCUMENTS)) {
        actions.push('view');
      }
      if (hasPermission(user, Permission.EDIT_DOCUMENT)) {
        actions.push('edit');
      }
      if (hasPermission(user, Permission.DELETE_DOCUMENT)) {
        actions.push('delete');
      }
      if (hasPermission(user, Permission.SHARE_DOCUMENTS)) {
        actions.push('share');
      }
      break;
  }
  
  return actions;
}