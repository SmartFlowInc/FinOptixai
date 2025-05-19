import React, { createContext, useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Lock, ShieldAlert, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Types
export type UserRole = 'admin' | 'finance_manager' | 'department_head' | 'analyst' | 'viewer';
export type PermissionArea = 'dashboard' | 'budgeting' | 'forecasting' | 'reporting' | 'data_integration' | 'settings' | 'workflows';
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export interface Permission {
  area: PermissionArea;
  action: PermissionAction;
  allowed: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  usersCount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  lastLogin?: Date;
}

// Role-based access context
interface AccessContextType {
  currentRole: UserRole;
  hasPermission: (area: PermissionArea, action: PermissionAction) => boolean;
  setCurrentRole: (role: UserRole) => void;
}

const AccessContext = createContext<AccessContextType>({
  currentRole: 'viewer',
  hasPermission: () => false,
  setCurrentRole: () => {},
});

export const useAccess = () => useContext(AccessContext);

// Default roles configuration
const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    isSystemRole: true,
    usersCount: 2,
    permissions: [
      ...['dashboard', 'budgeting', 'forecasting', 'reporting', 'data_integration', 'settings', 'workflows']
        .flatMap(area => ['view', 'create', 'edit', 'delete', 'approve', 'export']
          .map(action => ({ area: area as PermissionArea, action: action as PermissionAction, allowed: true }))
        )
    ]
  },
  {
    id: 'finance_manager',
    name: 'Finance Manager',
    description: 'Can manage all financial aspects and approve workflows',
    isSystemRole: true,
    usersCount: 5,
    permissions: [
      { area: 'dashboard', action: 'view', allowed: true },
      { area: 'dashboard', action: 'create', allowed: true },
      { area: 'dashboard', action: 'edit', allowed: true },
      { area: 'dashboard', action: 'export', allowed: true },
      
      { area: 'budgeting', action: 'view', allowed: true },
      { area: 'budgeting', action: 'create', allowed: true },
      { area: 'budgeting', action: 'edit', allowed: true },
      { area: 'budgeting', action: 'delete', allowed: true },
      { area: 'budgeting', action: 'approve', allowed: true },
      { area: 'budgeting', action: 'export', allowed: true },
      
      { area: 'forecasting', action: 'view', allowed: true },
      { area: 'forecasting', action: 'create', allowed: true },
      { area: 'forecasting', action: 'edit', allowed: true },
      { area: 'forecasting', action: 'export', allowed: true },
      
      { area: 'reporting', action: 'view', allowed: true },
      { area: 'reporting', action: 'create', allowed: true },
      { area: 'reporting', action: 'export', allowed: true },
      
      { area: 'data_integration', action: 'view', allowed: true },
      
      { area: 'workflows', action: 'view', allowed: true },
      { area: 'workflows', action: 'create', allowed: true },
      { area: 'workflows', action: 'approve', allowed: true },
      
      { area: 'settings', action: 'view', allowed: true },
    ]
  },
  {
    id: 'department_head',
    name: 'Department Head',
    description: 'Can manage budgets and approve workflows for their department',
    isSystemRole: true,
    usersCount: 8,
    permissions: [
      { area: 'dashboard', action: 'view', allowed: true },
      { area: 'dashboard', action: 'export', allowed: true },
      
      { area: 'budgeting', action: 'view', allowed: true },
      { area: 'budgeting', action: 'create', allowed: true },
      { area: 'budgeting', action: 'edit', allowed: true },
      { area: 'budgeting', action: 'export', allowed: true },
      
      { area: 'forecasting', action: 'view', allowed: true },
      { area: 'forecasting', action: 'create', allowed: true },
      { area: 'forecasting', action: 'edit', allowed: true },
      { area: 'forecasting', action: 'export', allowed: true },
      
      { area: 'reporting', action: 'view', allowed: true },
      { area: 'reporting', action: 'export', allowed: true },
      
      { area: 'workflows', action: 'view', allowed: true },
      { area: 'workflows', action: 'create', allowed: true },
      { area: 'workflows', action: 'approve', allowed: true },
    ]
  },
  {
    id: 'analyst',
    name: 'Financial Analyst',
    description: 'Can view and analyze financial data',
    isSystemRole: true,
    usersCount: 12,
    permissions: [
      { area: 'dashboard', action: 'view', allowed: true },
      { area: 'dashboard', action: 'export', allowed: true },
      
      { area: 'budgeting', action: 'view', allowed: true },
      { area: 'budgeting', action: 'export', allowed: true },
      
      { area: 'forecasting', action: 'view', allowed: true },
      { area: 'forecasting', action: 'create', allowed: true },
      { area: 'forecasting', action: 'edit', allowed: true },
      { area: 'forecasting', action: 'export', allowed: true },
      
      { area: 'reporting', action: 'view', allowed: true },
      { area: 'reporting', action: 'create', allowed: true },
      { area: 'reporting', action: 'export', allowed: true },
      
      { area: 'workflows', action: 'view', allowed: true },
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can only view data without making changes',
    isSystemRole: true,
    usersCount: 20,
    permissions: [
      { area: 'dashboard', action: 'view', allowed: true },
      { area: 'budgeting', action: 'view', allowed: true },
      { area: 'forecasting', action: 'view', allowed: true },
      { area: 'reporting', action: 'view', allowed: true },
    ]
  },
  {
    id: 'custom_role_1',
    name: 'Finance Report Creator',
    description: 'Custom role for finance team members who create reports',
    isSystemRole: false,
    usersCount: 3,
    permissions: [
      { area: 'dashboard', action: 'view', allowed: true },
      { area: 'dashboard', action: 'export', allowed: true },
      
      { area: 'budgeting', action: 'view', allowed: true },
      { area: 'budgeting', action: 'export', allowed: true },
      
      { area: 'reporting', action: 'view', allowed: true },
      { area: 'reporting', action: 'create', allowed: true },
      { area: 'reporting', action: 'edit', allowed: true },
      { area: 'reporting', action: 'export', allowed: true },
    ]
  }
];

// Mock users
const mockUsers: User[] = [
  { id: 1, name: 'John Smith', email: 'jsmith@example.com', role: 'admin', department: 'IT', isActive: true, lastLogin: new Date('2023-09-15') },
  { id: 2, name: 'Jane Doe', email: 'jdoe@example.com', role: 'finance_manager', department: 'Finance', isActive: true, lastLogin: new Date('2023-09-16') },
  { id: 3, name: 'Michael Johnson', email: 'mjohnson@example.com', role: 'department_head', department: 'Marketing', isActive: true, lastLogin: new Date('2023-09-14') },
  { id: 4, name: 'Sarah Williams', email: 'swilliams@example.com', role: 'analyst', department: 'Finance', isActive: true, lastLogin: new Date('2023-09-13') },
  { id: 5, name: 'Robert Davis', email: 'rdavis@example.com', role: 'department_head', department: 'Sales', isActive: true, lastLogin: new Date('2023-09-11') },
  { id: 6, name: 'Emily Brown', email: 'ebrown@example.com', role: 'viewer', department: 'HR', isActive: true, lastLogin: new Date('2023-09-10') },
  { id: 7, name: 'James Wilson', email: 'jwilson@example.com', role: 'admin', department: 'Executive', isActive: true, lastLogin: new Date('2023-09-12') },
];

// Helper to format area and action names for display
const formatPermissionName = (input: string): string => {
  return input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Permission Manager component
export const AccessProvider: React.FC<{
  children: React.ReactNode;
  initialRole?: UserRole;
}> = ({ children, initialRole = 'finance_manager' }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  
  // Check if the current role has a specific permission
  const hasPermission = (area: PermissionArea, action: PermissionAction): boolean => {
    const role = defaultRoles.find(r => r.id === currentRole);
    if (!role) return false;
    
    const permission = role.permissions.find(
      p => p.area === area && p.action === action
    );
    
    return permission?.allowed || false;
  };
  
  return (
    <AccessContext.Provider value={{ currentRole, hasPermission, setCurrentRole }}>
      {children}
    </AccessContext.Provider>
  );
};

// Role Matrix component for managing permissions
export const RoleMatrix: React.FC<{
  roles?: Role[];
  onUpdateRole?: (roleId: string, permissions: Permission[]) => void;
  onCreateRole?: (role: Omit<Role, 'id' | 'usersCount'>) => void;
  onDeleteRole?: (roleId: string) => void;
}> = ({
  roles = defaultRoles,
  onUpdateRole,
  onCreateRole,
  onDeleteRole
}) => {
  const [activeTab, setActiveTab] = useState('permission-matrix');
  
  // Group permissions by area for the matrix view
  const permissionAreas: PermissionArea[] = [
    'dashboard', 
    'budgeting', 
    'forecasting', 
    'reporting', 
    'data_integration', 
    'workflows', 
    'settings'
  ];
  
  const permissionActions: PermissionAction[] = [
    'view', 
    'create', 
    'edit', 
    'delete', 
    'approve', 
    'export'
  ];

  // Toggle permission handler
  const handleTogglePermission = (roleId: string, area: PermissionArea, action: PermissionAction) => {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.isSystemRole) return;
    
    const updatedPermissions = [...role.permissions];
    const permissionIndex = updatedPermissions.findIndex(
      p => p.area === area && p.action === action
    );
    
    if (permissionIndex >= 0) {
      updatedPermissions[permissionIndex] = {
        ...updatedPermissions[permissionIndex],
        allowed: !updatedPermissions[permissionIndex].allowed
      };
    } else {
      updatedPermissions.push({
        area,
        action,
        allowed: true
      });
    }
    
    if (onUpdateRole) {
      onUpdateRole(roleId, updatedPermissions);
    }
  };

  // Check if a role has a specific permission
  const roleHasPermission = (roleId: string, area: PermissionArea, action: PermissionAction): boolean => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    
    const permission = role.permissions.find(
      p => p.area === area && p.action === action
    );
    
    return permission?.allowed || false;
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="permission-matrix">
            Permission Matrix
          </TabsTrigger>
          <TabsTrigger value="user-roles">
            User Roles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="permission-matrix" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permission Matrix</CardTitle>
              <CardDescription>
                Define access levels for different roles across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Permissions</TableHead>
                      {roles.map(role => (
                        <TableHead key={role.id} className="text-center">
                          <div>{role.name}</div>
                          {role.isSystemRole && (
                            <Badge variant="outline" className="mt-1">
                              System Role
                            </Badge>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionAreas.map(area => (
                      <React.Fragment key={area}>
                        <TableRow className="bg-muted/40">
                          <TableCell colSpan={roles.length + 1} className="font-medium py-2">
                            {formatPermissionName(area)}
                          </TableCell>
                        </TableRow>
                        
                        {permissionActions.map(action => (
                          <TableRow key={`${area}-${action}`}>
                            <TableCell className="pl-8">
                              {formatPermissionName(action)}
                            </TableCell>
                            
                            {roles.map(role => (
                              <TableCell key={`${role.id}-${area}-${action}`} className="text-center">
                                {role.isSystemRole ? (
                                  roleHasPermission(role.id, area, action) ? (
                                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                  )
                                ) : (
                                  <Switch
                                    checked={roleHasPermission(role.id, area, action)}
                                    onCheckedChange={() => handleTogglePermission(role.id, area, action)}
                                  />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                <Lock className="h-4 w-4 inline mr-1 mb-1" />
                System roles cannot be modified
              </p>
              <Button>
                Create Custom Role
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="user-roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Role Assignments</CardTitle>
              <CardDescription>
                Manage which users have which roles in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {formatPermissionName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? format(user.lastLogin, 'MMM d, yyyy') : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <ShieldAlert className="h-4 w-4 inline mr-1 mb-1" />
                  Changing user roles affects their permissions across the system
                </p>
              </div>
              <Button>
                Add User
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component that can be used to protect content based on permissions
export const ProtectedComponent: React.FC<{
  children: React.ReactNode;
  requiredPermission: {
    area: PermissionArea;
    action: PermissionAction;
  };
  fallback?: React.ReactNode;
}> = ({ children, requiredPermission, fallback }) => {
  const { hasPermission } = useAccess();
  
  if (hasPermission(requiredPermission.area, requiredPermission.action)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

// Format function for nice display in JSX
export const format = (date: Date, format: string) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  
  if (format === 'MMM d, yyyy') {
    return `${month} ${day}, ${year}`;
  }
  
  return date.toISOString();
};

export default RoleMatrix;