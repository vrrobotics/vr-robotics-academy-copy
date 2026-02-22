import { useEffect } from 'react';
import { useRoleStore, UserRole } from '@/stores/roleStore';
import { RoleService } from '@/services/roleService';

/**
 * Hook for managing user roles
 * Provides access to role state and actions
 */
export function useRole() {
  const {
    currentRole,
    userId,
    department,
    joinDate,
    isLoading,
    error,
    setRole,
    setUserId,
    setDepartment,
    setJoinDate,
    setLoading,
    setError,
    initializeRole,
    clearRole,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent
  } = useRoleStore();

  /**
   * Initialize role from user ID
   */
  const initializeFromUserId = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await RoleService.initializeRoleStore(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize role';
      setError(errorMessage);
      console.error('[useRole] Error initializing role:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user role
   */
  const updateRole = async (newRole: UserRole) => {
    if (!userId) {
      setError('No user ID available');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await RoleService.updateUserRole(userId, newRole);
      if (success) {
        setRole(newRole);
      } else {
        setError('Failed to update role');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      setError(errorMessage);
      console.error('[useRole] Error updating role:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user department
   */
  const updateDepartment = async (newDepartment: string) => {
    if (!userId) {
      setError('No user ID available');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await RoleService.updateUserDepartment(userId, newDepartment);
      if (success) {
        setDepartment(newDepartment);
      } else {
        setError('Failed to update department');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update department';
      setError(errorMessage);
      console.error('[useRole] Error updating department:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user has permission for action
   */
  const hasPermission = (action: string): boolean => {
    return RoleService.hasPermission(currentRole, action);
  };

  /**
   * Check if user can access resource
   */
  const canAccessResource = (resourceType: string): boolean => {
    return RoleService.canAccessResource(currentRole, resourceType);
  };

  return {
    // State
    currentRole,
    userId,
    department,
    joinDate,
    isLoading,
    error,

    // Role checks
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,

    // Actions
    setRole,
    setUserId,
    setDepartment,
    setJoinDate,
    initializeFromUserId,
    updateRole,
    updateDepartment,
    clearRole,

    // Permissions
    hasPermission,
    canAccessResource
  };
}
