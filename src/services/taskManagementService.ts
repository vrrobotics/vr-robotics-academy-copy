import { BaseCrudService } from '@/integrations';
import { Tasks } from '@/entities';
import { WebSocketService } from '@/services/websocketService';

/**
 * TaskManagementService - Handle task CRUD operations
 */
export class TaskManagementService {
  /**
   * Create new task
   */
  static async createTask(taskData: {
    title: string;
    description: string;
    dueDate: Date | string;
    status?: string;
    priority?: string;
  }): Promise<Tasks> {
    try {
      const newTask: Tasks = {
        _id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium'
      };

      const created = await BaseCrudService.create<Tasks>('tasks', newTask);

      // Emit WebSocket event
      WebSocketService.sendTaskCreated(newTask._id, newTask);

      return created;
    } catch (error) {
      console.error('[TaskManagementService] Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update task
   */
  static async updateTask(taskId: string, updates: Partial<Tasks>): Promise<Tasks> {
    try {
      const updated = await BaseCrudService.update<Tasks>('tasks', {
        _id: taskId,
        ...updates
      });

      // Emit WebSocket event
      WebSocketService.sendTaskUpdated(taskId, updates);

      return updated;
    } catch (error) {
      console.error('[TaskManagementService] Error updating task:', error);
      throw error;
    }
  }

  /**
   * Complete task
   */
  static async completeTask(taskId: string): Promise<Tasks> {
    try {
      const updated = await this.updateTask(taskId, { status: 'completed' });

      // Emit WebSocket event
      WebSocketService.sendTaskCompleted(taskId);

      return updated;
    } catch (error) {
      console.error('[TaskManagementService] Error completing task:', error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  static async deleteTask(taskId: string): Promise<void> {
    try {
      await BaseCrudService.delete<Tasks>('tasks', taskId);
    } catch (error) {
      console.error('[TaskManagementService] Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(taskId: string): Promise<Tasks | null> {
    try {
      const task = await BaseCrudService.getById<Tasks>('tasks', taskId);
      return task || null;
    } catch (error) {
      console.error('[TaskManagementService] Error getting task:', error);
      return null;
    }
  }

  /**
   * Get all tasks
   */
  static async getAllTasks(): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      return items;
    } catch (error) {
      console.error('[TaskManagementService] Error getting all tasks:', error);
      return [];
    }
  }

  /**
   * Get tasks by status
   */
  static async getTasksByStatus(status: string): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      return items.filter(task => task.status === status);
    } catch (error) {
      console.error('[TaskManagementService] Error getting tasks by status:', error);
      return [];
    }
  }

  /**
   * Get tasks by priority
   */
  static async getTasksByPriority(priority: string): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      return items.filter(task => task.priority === priority);
    } catch (error) {
      console.error('[TaskManagementService] Error getting tasks by priority:', error);
      return [];
    }
  }

  /**
   * Get overdue tasks
   */
  static async getOverdueTasks(): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      const now = new Date();

      return items.filter(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        return dueDate && dueDate < now && task.status !== 'completed';
      });
    } catch (error) {
      console.error('[TaskManagementService] Error getting overdue tasks:', error);
      return [];
    }
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(days: number = 7): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return items.filter(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        return dueDate && dueDate > now && dueDate <= futureDate && task.status !== 'completed';
      });
    } catch (error) {
      console.error('[TaskManagementService] Error getting upcoming tasks:', error);
      return [];
    }
  }

  /**
   * Search tasks
   */
  static async searchTasks(query: string): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      const lowerQuery = query.toLowerCase();

      return items.filter(task =>
        (task.title?.toLowerCase().includes(lowerQuery)) ||
        (task.description?.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('[TaskManagementService] Error searching tasks:', error);
      return [];
    }
  }

  /**
   * Get task statistics
   */
  static async getTaskStatistics(): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
  }> {
    try {
      const tasks = await this.getAllTasks();
      const overdueTasks = await this.getOverdueTasks();

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks: overdueTasks.length,
        completionRate: Math.round(completionRate)
      };
    } catch (error) {
      console.error('[TaskManagementService] Error getting task statistics:', error);
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0
      };
    }
  }

  /**
   * Bulk create tasks
   */
  static async bulkCreateTasks(tasksData: Array<{
    title: string;
    description: string;
    dueDate: Date | string;
    priority?: string;
  }>): Promise<Tasks[]> {
    try {
      const createdTasks: Tasks[] = [];

      for (const taskData of tasksData) {
        const task = await this.createTask(taskData);
        createdTasks.push(task);
      }

      return createdTasks;
    } catch (error) {
      console.error('[TaskManagementService] Error bulk creating tasks:', error);
      throw error;
    }
  }

  /**
   * Bulk update tasks
   */
  static async bulkUpdateTasks(updates: Array<{
    taskId: string;
    data: Partial<Tasks>;
  }>): Promise<Tasks[]> {
    try {
      const updatedTasks: Tasks[] = [];

      for (const { taskId, data } of updates) {
        const task = await this.updateTask(taskId, data);
        updatedTasks.push(task);
      }

      return updatedTasks;
    } catch (error) {
      console.error('[TaskManagementService] Error bulk updating tasks:', error);
      throw error;
    }
  }

  /**
   * Validate task data
   */
  static validateTaskData(taskData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!taskData.title || taskData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!taskData.description || taskData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!taskData.dueDate) {
      errors.push('Due date is required');
    }

    if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
      errors.push('Priority must be low, medium, or high');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get tasks by priority and status
   */
  static async getTasksByPriorityAndStatus(priority: string, status: string): Promise<Tasks[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Tasks>('tasks');
      return items.filter(task => task.priority === priority && task.status === status);
    } catch (error) {
      console.error('[TaskManagementService] Error getting filtered tasks:', error);
      return [];
    }
  }

  /**
   * Export tasks to CSV
   */
  static async exportTasksToCSV(tasks: Tasks[]): Promise<string> {
    try {
      const headers = ['ID', 'Title', 'Description', 'Due Date', 'Status', 'Priority'];
      const rows = tasks.map(task => [
        task._id,
        task.title || '',
        task.description || '',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        task.status || '',
        task.priority || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('[TaskManagementService] Error exporting tasks:', error);
      throw error;
    }
  }
}
