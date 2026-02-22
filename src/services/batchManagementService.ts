import { BaseCrudService } from '@/integrations';
import { Batches, Students } from '@/entities';
import { WebSocketService } from '@/services/websocketService';

/**
 * BatchManagementService - Handle batch CRUD operations
 */
export class BatchManagementService {
  /**
   * Create new batch
   */
  static async createBatch(batchData: {
    batchName: string;
    batchLevel: string;
    startDate: Date | string;
    endDate: Date | string;
    batchStatus?: string;
    assignedTeacherName?: string;
  }): Promise<Batches> {
    try {
      const newBatch: Batches = {
        _id: crypto.randomUUID(),
        batchName: batchData.batchName,
        batchLevel: batchData.batchLevel,
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        batchStatus: batchData.batchStatus || 'active',
        assignedTeacherName: batchData.assignedTeacherName
      };

      const created = await BaseCrudService.create<Batches>('batches', newBatch);

      // Emit WebSocket event
      WebSocketService.sendBatchCreated(newBatch._id, newBatch);

      return created;
    } catch (error) {
      console.error('[BatchManagementService] Error creating batch:', error);
      throw error;
    }
  }

  /**
   * Update batch
   */
  static async updateBatch(batchId: string, updates: Partial<Batches>): Promise<Batches> {
    try {
      const updated = await BaseCrudService.update<Batches>('batches', {
        _id: batchId,
        ...updates
      });

      // Emit WebSocket event
      WebSocketService.sendBatchUpdated(batchId, updates);

      return updated;
    } catch (error) {
      console.error('[BatchManagementService] Error updating batch:', error);
      throw error;
    }
  }

  /**
   * Delete batch
   */
  static async deleteBatch(batchId: string): Promise<void> {
    try {
      await BaseCrudService.delete<Batches>('batches', batchId);

      // Emit WebSocket event
      WebSocketService.sendBatchDeleted(batchId);
    } catch (error) {
      console.error('[BatchManagementService] Error deleting batch:', error);
      throw error;
    }
  }

  /**
   * Get batch by ID
   */
  static async getBatchById(batchId: string): Promise<Batches | null> {
    try {
      const batch = await BaseCrudService.getById<Batches>('batches', batchId);
      return batch || null;
    } catch (error) {
      console.error('[BatchManagementService] Error getting batch:', error);
      return null;
    }
  }

  /**
   * Get all batches
   */
  static async getAllBatches(): Promise<Batches[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Batches>('batches');
      return items;
    } catch (error) {
      console.error('[BatchManagementService] Error getting all batches:', error);
      return [];
    }
  }

  /**
   * Get batches by status
   */
  static async getBatchesByStatus(status: string): Promise<Batches[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Batches>('batches');
      return items.filter(batch => batch.batchStatus === status);
    } catch (error) {
      console.error('[BatchManagementService] Error getting batches by status:', error);
      return [];
    }
  }

  /**
   * Get batches by teacher
   */
  static async getBatchesByTeacher(teacherName: string): Promise<Batches[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Batches>('batches');
      return items.filter(batch => batch.assignedTeacherName === teacherName);
    } catch (error) {
      console.error('[BatchManagementService] Error getting batches by teacher:', error);
      return [];
    }
  }

  /**
   * Get batches by level
   */
  static async getBatchesByLevel(level: string): Promise<Batches[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Batches>('batches');
      return items.filter(batch => batch.batchLevel === level);
    } catch (error) {
      console.error('[BatchManagementService] Error getting batches by level:', error);
      return [];
    }
  }

  /**
   * Search batches
   */
  static async searchBatches(query: string): Promise<Batches[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Batches>('batches');
      const lowerQuery = query.toLowerCase();

      return items.filter(batch =>
        (batch.batchName?.toLowerCase().includes(lowerQuery)) ||
        (batch.batchLevel?.toLowerCase().includes(lowerQuery)) ||
        (batch.assignedTeacherName?.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('[BatchManagementService] Error searching batches:', error);
      return [];
    }
  }

  /**
   * Assign teacher to batch
   */
  static async assignTeacherToBatch(batchId: string, teacherName: string): Promise<Batches> {
    try {
      return await this.updateBatch(batchId, { assignedTeacherName: teacherName });
    } catch (error) {
      console.error('[BatchManagementService] Error assigning teacher:', error);
      throw error;
    }
  }

  /**
   * Get students in batch
   */
  static async getStudentsInBatch(batchId: string): Promise<Students[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Students>('students');
      return items.filter(student => student.batchId === batchId);
    } catch (error) {
      console.error('[BatchManagementService] Error getting batch students:', error);
      return [];
    }
  }

  /**
   * Get batch statistics
   */
  static async getBatchStatistics(): Promise<{
    totalBatches: number;
    activeBatches: number;
    completedBatches: number;
    batchesByLevel: Record<string, number>;
    totalStudents: number;
  }> {
    try {
      const batches = await this.getAllBatches();
      const { items: students = [] } = await BaseCrudService.getAll<Students>('students');

      const stats = {
        totalBatches: batches.length,
        activeBatches: batches.filter(b => b.batchStatus === 'active').length,
        completedBatches: batches.filter(b => b.batchStatus === 'completed').length,
        batchesByLevel: {} as Record<string, number>,
        totalStudents: students.length
      };

      // Count by level
      batches.forEach(batch => {
        const level = batch.batchLevel || 'Unassigned';
        stats.batchesByLevel[level] = (stats.batchesByLevel[level] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('[BatchManagementService] Error getting batch statistics:', error);
      return {
        totalBatches: 0,
        activeBatches: 0,
        completedBatches: 0,
        batchesByLevel: {},
        totalStudents: 0
      };
    }
  }

  /**
   * Bulk create batches
   */
  static async bulkCreateBatches(batchesData: Array<{
    batchName: string;
    batchLevel: string;
    startDate: Date | string;
    endDate: Date | string;
    assignedTeacherName?: string;
  }>): Promise<Batches[]> {
    try {
      const createdBatches: Batches[] = [];

      for (const batchData of batchesData) {
        const batch = await this.createBatch(batchData);
        createdBatches.push(batch);
      }

      return createdBatches;
    } catch (error) {
      console.error('[BatchManagementService] Error bulk creating batches:', error);
      throw error;
    }
  }

  /**
   * Validate batch data
   */
  static validateBatchData(batchData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!batchData.batchName || batchData.batchName.trim().length === 0) {
      errors.push('Batch name is required');
    }

    if (!batchData.batchLevel || batchData.batchLevel.trim().length === 0) {
      errors.push('Batch level is required');
    }

    if (!batchData.startDate) {
      errors.push('Start date is required');
    }

    if (!batchData.endDate) {
      errors.push('End date is required');
    }

    if (batchData.startDate && batchData.endDate) {
      const start = new Date(batchData.startDate);
      const end = new Date(batchData.endDate);
      if (start >= end) {
        errors.push('End date must be after start date');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Batch templates
   */
  static getBatchTemplates(): Array<{
    name: string;
    level: string;
    duration: number;
    description: string;
  }> {
    return [
      {
        name: 'Beginner Robotics',
        level: 'Beginner',
        duration: 12,
        description: 'Introduction to robotics and basic programming'
      },
      {
        name: 'Intermediate Robotics',
        level: 'Intermediate',
        duration: 16,
        description: 'Advanced robotics concepts and complex programming'
      },
      {
        name: 'Advanced Robotics',
        level: 'Advanced',
        duration: 20,
        description: 'Expert-level robotics and AI integration'
      },
      {
        name: 'Summer Camp',
        level: 'All Levels',
        duration: 8,
        description: 'Intensive summer robotics program'
      },
      {
        name: 'Weekend Workshop',
        level: 'All Levels',
        duration: 4,
        description: 'Short weekend robotics workshop'
      }
    ];
  }
}
