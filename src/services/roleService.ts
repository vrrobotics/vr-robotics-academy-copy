import { BaseCrudService } from '@/integrations';
import { Users } from '@/entities';
import { useRoleStore, UserRole } from '@/stores/roleStore';

/**
 * Role Service - Manages user roles and permissions
 * Syncs between Wix Members and Users collection
 */
export class RoleService {
  /**
   * Get user role from Users collection
   */
  static async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const user = await BaseCrudService.getById<Users>('users', userId);
      if (!user) {
        console.warn(`[RoleService] User not found: ${userId}`);
        return null;
      }
      return (user.role as UserRole) || 'guest';
    } catch (error) {
      console.error('[RoleService] Error fetching user role:', error);
      return null;
    }
  }

  /**
   * Get full user data including role, department, joinDate
   */
  static async getUserData(userId: string): Promise<Users | null> {
    try {
      const user = await BaseCrudService.getById<Users>('users', userId);
      if (!user) {
        console.warn(`[RoleService] User not found: ${userId}`);
        return null;
      }
      return user;
    } catch (error) {
      console.error('[RoleService] Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      await BaseCrudService.update<Users>('users', {
        _id: userId,
        role: role
      });
      console.log(`[RoleService] Updated role for user ${userId} to ${role}`);
      return true;
    } catch (error) {
      console.error('[RoleService] Error updating user role:', error);
      return false;
    }
  }

  /**
   * Update user department
   */
  static async updateUserDepartment(userId: string, department: string): Promise<boolean> {
    try {
      await BaseCrudService.update<Users>('users', {
        _id: userId,
        department: department
      });
      console.log(`[RoleService] Updated department for user ${userId} to ${department}`);
      return true;
    } catch (error) {
      console.error('[RoleService] Error updating user department:', error);
      return false;
    }
  }

  /**
   * Initialize role store from user data
   */
  static async initializeRoleStore(userId: string): Promise<void> {
    try {
      const user = await this.getUserData(userId);
      if (!user) {
        console.warn(`[RoleService] Cannot initialize role store - user not found: ${userId}`);
        useRoleStore.getState().clearRole();
        return;
      }

      const role = (user.role as UserRole) || 'guest';
      const joinDate = user.dateOfBirth ? new Date(user.dateOfBirth) : undefined;

      useRoleStore.getState().initializeRole(
        userId,
        role,
        user.department || undefined,
        joinDate
      );

      console.log(`[RoleService] Role store initialized for user ${userId}`);
    } catch (error) {
      console.error('[RoleService] Error initializing role store:', error);
      useRoleStore.getState().clearRole();
    }
  }

  /**
   * Get all users with specific role
   */
  static async getUsersByRole(role: UserRole): Promise<Users[]> {
    try {
      const { items } = await BaseCrudService.getAll<Users>('users');
      return items.filter(user => user.role === role);
    } catch (error) {
      console.error('[RoleService] Error fetching users by role:', error);
      return [];
    }
  }

  /**
   * Get all teachers
   */
  static async getAllTeachers(): Promise<Users[]> {
    return this.getUsersByRole('teacher');
  }

  /**
   * Get all students
   */
  static async getAllStudents(): Promise<Users[]> {
    return this.getUsersByRole('student');
  }

  /**
   * Get all admins
   */
  static async getAllAdmins(): Promise<Users[]> {
    return this.getUsersByRole('admin');
  }

  /**
   * Check if user has permission for action
   */
  static hasPermission(role: UserRole, action: string): boolean {
    const permissions: Record<UserRole, string[]> = {
      admin: ['view_all', 'create', 'edit', 'delete', 'manage_users', 'manage_batches', 'view_analytics'],
      teacher: ['view_own', 'create_content', 'grade_assignments', 'manage_batch', 'view_students'],
      student: ['view_own', 'submit_assignments', 'view_courses', 'view_grades'],
      guest: ['view_public']
    };

    return permissions[role]?.includes(action) || false;
  }

  /**
   * Check if user can access resource
   */
  static canAccessResource(userRole: UserRole, resourceType: string): boolean {
    const accessControl: Record<UserRole, string[]> = {
      admin: ['dashboard', 'users', 'batches', 'analytics', 'settings'],
      teacher: ['dashboard', 'students', 'batches', 'assignments'],
      student: ['dashboard', 'courses', 'assignments', 'grades'],
      guest: ['home', 'about', 'contact']
    };

    return accessControl[userRole]?.includes(resourceType) || false;
  }
}
