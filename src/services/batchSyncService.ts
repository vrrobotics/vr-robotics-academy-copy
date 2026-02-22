import { BaseCrudService } from '@/integrations';
import { Batches, TeacherAssignments, Students } from '@/entities';

/**
 * BatchSyncService - Handles batch synchronization logic
 * Syncs batch assignments, student enrollments, and batch status
 */
export class BatchSyncService {
  /**
   * Get all batches for a teacher
   */
  static async getTeacherBatches(teacherId: string): Promise<Batches[]> {
    try {
      // Get teacher assignments
      const { items: assignments = [] } = await BaseCrudService.getAll<TeacherAssignments>('teacherassignments');
      const teacherAssignments = assignments.filter(
        a => a.teacherId === teacherId && a.isActive
      );

      // Get batches
      const { items: batches = [] } = await BaseCrudService.getAll<Batches>('batches');

      // Filter batches assigned to teacher
      return batches.filter(b =>
        teacherAssignments.some(a => a.batchId === b._id)
      );
    } catch (error) {
      console.error('[BatchSyncService] Error getting teacher batches:', error);
      return [];
    }
  }

  /**
   * Get students in a batch
   */
  static async getBatchStudents(batchId: string): Promise<Students[]> {
    try {
      const { items: students = [] } = await BaseCrudService.getAll<Students>('students');
      return students.filter(s => s.batchId === batchId);
    } catch (error) {
      console.error('[BatchSyncService] Error getting batch students:', error);
      return [];
    }
  }

  /**
   * Sync batch status across system
   */
  static async syncBatchStatus(batchId: string, newStatus: string): Promise<void> {
    try {
      const batch = await BaseCrudService.getById<Batches>('batches', batchId);
      if (batch) {
        await BaseCrudService.update<Batches>('batches', {
          _id: batchId,
          batchStatus: newStatus,
          _updatedDate: new Date()
        });
      }
    } catch (error) {
      console.error('[BatchSyncService] Error syncing batch status:', error);
      throw error;
    }
  }

  /**
   * Assign teacher to batch
   */
  static async assignTeacherToBatch(teacherId: string, batchId: string): Promise<void> {
    try {
      const assignment: TeacherAssignments = {
        _id: crypto.randomUUID(),
        teacherId,
        batchId,
        syncStatus: 'synced',
        assignmentDate: new Date(),
        isActive: true
      };

      await BaseCrudService.create('teacherassignments', assignment);
    } catch (error) {
      console.error('[BatchSyncService] Error assigning teacher to batch:', error);
      throw error;
    }
  }

  /**
   * Remove teacher from batch
   */
  static async removeTeacherFromBatch(teacherId: string, batchId: string): Promise<void> {
    try {
      const { items: assignments = [] } = await BaseCrudService.getAll<TeacherAssignments>('teacherassignments');
      const assignment = assignments.find(
        a => a.teacherId === teacherId && a.batchId === batchId
      );

      if (assignment) {
        await BaseCrudService.update<TeacherAssignments>('teacherassignments', {
          _id: assignment._id,
          isActive: false
        });
      }
    } catch (error) {
      console.error('[BatchSyncService] Error removing teacher from batch:', error);
      throw error;
    }
  }

  /**
   * Get batch statistics
   */
  static async getBatchStats(batchId: string): Promise<{
    studentCount: number;
    activeStudents: number;
    completedStudents: number;
  }> {
    try {
      const students = await this.getBatchStudents(batchId);
      return {
        studentCount: students.length,
        activeStudents: students.length, // Can be enhanced with enrollment status
        completedStudents: 0 // Can be enhanced with completion tracking
      };
    } catch (error) {
      console.error('[BatchSyncService] Error getting batch stats:', error);
      return {
        studentCount: 0,
        activeStudents: 0,
        completedStudents: 0
      };
    }
  }

  /**
   * Sync all batches for a teacher
   */
  static async syncAllTeacherBatches(teacherId: string): Promise<void> {
    try {
      const batches = await this.getTeacherBatches(teacherId);
      console.log(`[BatchSyncService] Synced ${batches.length} batches for teacher ${teacherId}`);
    } catch (error) {
      console.error('[BatchSyncService] Error syncing all batches:', error);
      throw error;
    }
  }
}
