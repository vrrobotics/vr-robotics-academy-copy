import { BaseCrudService } from '@/integrations';
import { Users } from '@/entities';
import { WebSocketService } from '@/services/websocketService';

/**
 * UserManagementService - Handle user CRUD operations
 */
export class UserManagementService {
  /**
   * Create new user
   */
  static async createUser(userData: {
    fullName: string;
    email: string;
    role: string;
    department?: string;
    phoneNumber?: string;
    dateOfBirth?: Date | string;
    profilePicture?: string;
  }): Promise<Users> {
    try {
      const newUser: Users = {
        _id: crypto.randomUUID(),
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        profilePicture: userData.profilePicture,
        joinDate: new Date()
      };

      const created = await BaseCrudService.create<Users>('users', newUser);
      
      // Emit WebSocket event
      WebSocketService.sendUserCreated(newUser._id, newUser);

      return created;
    } catch (error) {
      console.error('[UserManagementService] Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, updates: Partial<Users>): Promise<Users> {
    try {
      const updated = await BaseCrudService.update<Users>('users', {
        _id: userId,
        ...updates
      });

      // Emit WebSocket event
      WebSocketService.sendUserUpdated(userId, updates);

      return updated;
    } catch (error) {
      console.error('[UserManagementService] Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await BaseCrudService.delete<Users>('users', userId);

      // Emit WebSocket event
      WebSocketService.sendUserDeleted(userId);
    } catch (error) {
      console.error('[UserManagementService] Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<Users | null> {
    try {
      const user = await BaseCrudService.getById<Users>('users', userId);
      return user || null;
    } catch (error) {
      console.error('[UserManagementService] Error getting user:', error);
      return null;
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<Users[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Users>('users');
      return items;
    } catch (error) {
      console.error('[UserManagementService] Error getting all users:', error);
      return [];
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<Users[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Users>('users');
      return items.filter(user => user.role === role);
    } catch (error) {
      console.error('[UserManagementService] Error getting users by role:', error);
      return [];
    }
  }

  /**
   * Get users by department
   */
  static async getUsersByDepartment(department: string): Promise<Users[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Users>('users');
      return items.filter(user => user.department === department);
    } catch (error) {
      console.error('[UserManagementService] Error getting users by department:', error);
      return [];
    }
  }

  /**
   * Search users
   */
  static async searchUsers(query: string): Promise<Users[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Users>('users');
      const lowerQuery = query.toLowerCase();

      return items.filter(user =>
        (user.fullName?.toLowerCase().includes(lowerQuery)) ||
        (user.email?.toLowerCase().includes(lowerQuery)) ||
        (user.department?.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('[UserManagementService] Error searching users:', error);
      return [];
    }
  }

  /**
   * Bulk create users
   */
  static async bulkCreateUsers(usersData: Array<{
    fullName: string;
    email: string;
    role: string;
    department?: string;
    phoneNumber?: string;
  }>): Promise<Users[]> {
    try {
      const createdUsers: Users[] = [];

      for (const userData of usersData) {
        const user = await this.createUser(userData);
        createdUsers.push(user);
      }

      return createdUsers;
    } catch (error) {
      console.error('[UserManagementService] Error bulk creating users:', error);
      throw error;
    }
  }

  /**
   * Bulk update users
   */
  static async bulkUpdateUsers(updates: Array<{
    userId: string;
    data: Partial<Users>;
  }>): Promise<Users[]> {
    try {
      const updatedUsers: Users[] = [];

      for (const { userId, data } of updates) {
        const user = await this.updateUser(userId, data);
        updatedUsers.push(user);
      }

      return updatedUsers;
    } catch (error) {
      console.error('[UserManagementService] Error bulk updating users:', error);
      throw error;
    }
  }

  /**
   * Bulk delete users
   */
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    try {
      for (const userId of userIds) {
        await this.deleteUser(userId);
      }
    } catch (error) {
      console.error('[UserManagementService] Error bulk deleting users:', error);
      throw error;
    }
  }

  /**
   * Export users to CSV
   */
  static async exportUsersToCSV(users: Users[]): Promise<string> {
    try {
      const headers = ['ID', 'Full Name', 'Email', 'Role', 'Department', 'Phone', 'Join Date'];
      const rows = users.map(user => [
        user._id,
        user.fullName || '',
        user.email || '',
        user.role || '',
        user.department || '',
        user.phoneNumber || '',
        user.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('[UserManagementService] Error exporting users:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics(): Promise<{
    totalUsers: number;
    totalAdmins: number;
    totalTeachers: number;
    totalStudents: number;
    usersByDepartment: Record<string, number>;
  }> {
    try {
      const users = await this.getAllUsers();

      const stats = {
        totalUsers: users.length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        totalTeachers: users.filter(u => u.role === 'teacher').length,
        totalStudents: users.filter(u => u.role === 'student').length,
        usersByDepartment: {} as Record<string, number>
      };

      // Count by department
      users.forEach(user => {
        const dept = user.department || 'Unassigned';
        stats.usersByDepartment[dept] = (stats.usersByDepartment[dept] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[UserManagementService] Error getting user statistics:', error);
      return {
        totalUsers: 0,
        totalAdmins: 0,
        totalTeachers: 0,
        totalStudents: 0,
        usersByDepartment: {}
      };
    }
  }

  /**
   * Validate user data
   */
  static validateUserData(userData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.fullName || userData.fullName.trim().length === 0) {
      errors.push('Full name is required');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.role || !['admin', 'teacher', 'student'].includes(userData.role)) {
      errors.push('Valid role is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
