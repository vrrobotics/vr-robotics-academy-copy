import { BaseCrudService } from '@/integrations';
import { Assignments, AssignmentSubmissions } from '@/entities';
import { WebSocketService } from '@/services/websocketService';

/**
 * AssignmentManagementService - Handle assignment CRUD operations
 */
export class AssignmentManagementService {
  /**
   * Create new assignment
   */
  static async createAssignment(assignmentData: {
    title: string;
    description: string;
    instructions: string;
    dueDate: Date | string;
    maxPoints: number;
    submissionType: string;
  }): Promise<Assignments> {
    try {
      const newAssignment: Assignments = {
        _id: crypto.randomUUID(),
        title: assignmentData.title,
        description: assignmentData.description,
        instructions: assignmentData.instructions,
        dueDate: assignmentData.dueDate,
        maxPoints: assignmentData.maxPoints,
        submissionType: assignmentData.submissionType
      };

      const created = await BaseCrudService.create<Assignments>('assignments', newAssignment);

      // Emit WebSocket event
      WebSocketService.sendAssignmentCreated(newAssignment._id, newAssignment);

      return created;
    } catch (error) {
      console.error('[AssignmentManagementService] Error creating assignment:', error);
      throw error;
    }
  }

  /**
   * Update assignment
   */
  static async updateAssignment(assignmentId: string, updates: Partial<Assignments>): Promise<Assignments> {
    try {
      const updated = await BaseCrudService.update<Assignments>('assignments', {
        _id: assignmentId,
        ...updates
      });

      // Emit WebSocket event
      WebSocketService.sendAssignmentUpdated(assignmentId, updates);

      return updated;
    } catch (error) {
      console.error('[AssignmentManagementService] Error updating assignment:', error);
      throw error;
    }
  }

  /**
   * Delete assignment
   */
  static async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await BaseCrudService.delete<Assignments>('assignments', assignmentId);

      // Emit WebSocket event
      WebSocketService.sendAssignmentDeleted(assignmentId);
    } catch (error) {
      console.error('[AssignmentManagementService] Error deleting assignment:', error);
      throw error;
    }
  }

  /**
   * Get assignment by ID
   */
  static async getAssignmentById(assignmentId: string): Promise<Assignments | null> {
    try {
      const assignment = await BaseCrudService.getById<Assignments>('assignments', assignmentId);
      return assignment || null;
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting assignment:', error);
      return null;
    }
  }

  /**
   * Get all assignments
   */
  static async getAllAssignments(): Promise<Assignments[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Assignments>('assignments');
      return items;
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting all assignments:', error);
      return [];
    }
  }

  /**
   * Search assignments
   */
  static async searchAssignments(query: string): Promise<Assignments[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<Assignments>('assignments');
      const lowerQuery = query.toLowerCase();

      return items.filter(assignment =>
        (assignment.title?.toLowerCase().includes(lowerQuery)) ||
        (assignment.description?.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('[AssignmentManagementService] Error searching assignments:', error);
      return [];
    }
  }

  /**
   * Get submissions for assignment
   */
  static async getSubmissionsForAssignment(assignmentId: string): Promise<AssignmentSubmissions[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<AssignmentSubmissions>('assignmentsubmissions');
      return items.filter(submission => submission.assignmentId === assignmentId);
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting submissions:', error);
      return [];
    }
  }

  /**
   * Grade submission
   */
  static async gradeSubmission(
    submissionId: string,
    grade: number,
    feedback: string
  ): Promise<AssignmentSubmissions> {
    try {
      const updated = await BaseCrudService.update<AssignmentSubmissions>('assignmentsubmissions', {
        _id: submissionId,
        grade,
        instructorFeedback: feedback
      });

      // Emit WebSocket event
      WebSocketService.sendSubmissionGraded(submissionId, grade, feedback);

      return updated;
    } catch (error) {
      console.error('[AssignmentManagementService] Error grading submission:', error);
      throw error;
    }
  }

  /**
   * Get submission by ID
   */
  static async getSubmissionById(submissionId: string): Promise<AssignmentSubmissions | null> {
    try {
      const submission = await BaseCrudService.getById<AssignmentSubmissions>('assignmentsubmissions', submissionId);
      return submission || null;
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting submission:', error);
      return null;
    }
  }

  /**
   * Get student submissions
   */
  static async getStudentSubmissions(studentId: string): Promise<AssignmentSubmissions[]> {
    try {
      const { items = [] } = await BaseCrudService.getAll<AssignmentSubmissions>('assignmentsubmissions');
      return items.filter(submission => submission.studentId === studentId);
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting student submissions:', error);
      return [];
    }
  }

  /**
   * Get assignment statistics
   */
  static async getAssignmentStatistics(): Promise<{
    totalAssignments: number;
    totalSubmissions: number;
    averageGrade: number;
    submissionRate: number;
  }> {
    try {
      const assignments = await this.getAllAssignments();
      const { items: submissions = [] } = await BaseCrudService.getAll<AssignmentSubmissions>('assignmentsubmissions');

      const totalAssignments = assignments.length;
      const totalSubmissions = submissions.length;
      const gradedSubmissions = submissions.filter(s => s.grade !== undefined && s.grade !== null);
      const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0;

      const submissionRate = totalAssignments > 0
        ? (totalSubmissions / (totalAssignments * 30)) * 100 // Assuming 30 students
        : 0;

      return {
        totalAssignments,
        totalSubmissions,
        averageGrade: Math.round(averageGrade * 100) / 100,
        submissionRate: Math.round(submissionRate)
      };
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting statistics:', error);
      return {
        totalAssignments: 0,
        totalSubmissions: 0,
        averageGrade: 0,
        submissionRate: 0
      };
    }
  }

  /**
   * Bulk create assignments
   */
  static async bulkCreateAssignments(assignmentsData: Array<{
    title: string;
    description: string;
    instructions: string;
    dueDate: Date | string;
    maxPoints: number;
    submissionType: string;
  }>): Promise<Assignments[]> {
    try {
      const createdAssignments: Assignments[] = [];

      for (const assignmentData of assignmentsData) {
        const assignment = await this.createAssignment(assignmentData);
        createdAssignments.push(assignment);
      }

      return createdAssignments;
    } catch (error) {
      console.error('[AssignmentManagementService] Error bulk creating assignments:', error);
      throw error;
    }
  }

  /**
   * Validate assignment data
   */
  static validateAssignmentData(assignmentData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!assignmentData.title || assignmentData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!assignmentData.description || assignmentData.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!assignmentData.instructions || assignmentData.instructions.trim().length === 0) {
      errors.push('Instructions are required');
    }

    if (!assignmentData.dueDate) {
      errors.push('Due date is required');
    }

    if (!assignmentData.maxPoints || assignmentData.maxPoints <= 0) {
      errors.push('Max points must be greater than 0');
    }

    if (!assignmentData.submissionType || assignmentData.submissionType.trim().length === 0) {
      errors.push('Submission type is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get overdue assignments
   */
  static async getOverdueAssignments(): Promise<Assignments[]> {
    try {
      const assignments = await this.getAllAssignments();
      const now = new Date();

      return assignments.filter(assignment => {
        const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
        return dueDate && dueDate < now;
      });
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting overdue assignments:', error);
      return [];
    }
  }

  /**
   * Get upcoming assignments
   */
  static async getUpcomingAssignments(days: number = 7): Promise<Assignments[]> {
    try {
      const assignments = await this.getAllAssignments();
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return assignments.filter(assignment => {
        const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
        return dueDate && dueDate > now && dueDate <= futureDate;
      });
    } catch (error) {
      console.error('[AssignmentManagementService] Error getting upcoming assignments:', error);
      return [];
    }
  }
}
