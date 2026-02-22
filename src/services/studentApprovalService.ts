/**
 * Student Approval Service
 * Manages the student registration approval workflow
 */

import { BaseCrudService } from '@/integrations';
import { Students, Enrollments } from '@/entities';

export interface StudentApprovalRecord {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType number */
  age?: number;
  /** @wixFieldType text */
  gender?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType text */
  status?: 'pending' | 'approved' | 'rejected';
  /** @wixFieldType datetime */
  approvalDate?: Date | string;
  /** @wixFieldType text */
  approvedByAdmin?: string;
  /** @wixFieldType text */
  rejectionReason?: string;
}

class StudentApprovalService {
  private static readonly COLLECTION_ID = 'studentapprovals';

  /**
   * Create a pending approval record for a new student
   */
  static async createApprovalRecord(studentData: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    age?: number;
    gender?: string;
  }): Promise<StudentApprovalRecord> {
    try {
      console.log('[StudentApprovalService] Creating approval record for:', studentData.email);

      const approvalRecord: StudentApprovalRecord = {
        _id: `student_approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: studentData.fullName,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber || '',
        age: studentData.age,
        gender: studentData.gender,
        status: 'pending',
        submissionDate: new Date(),
      };

      const result = await BaseCrudService.create(this.COLLECTION_ID, approvalRecord);
      console.log('[StudentApprovalService] ✓ Approval record created:', approvalRecord._id);
      return result;
    } catch (error) {
      console.error('[StudentApprovalService] Error creating approval record:', error);
      throw error;
    }
  }

  /**
   * Check if a student's email is approved
   */
  static async isStudentApproved(email: string): Promise<boolean> {
    try {
      console.log('[StudentApprovalService] Checking approval status for:', email);

      const { items } = await BaseCrudService.getAll<StudentApprovalRecord>(this.COLLECTION_ID);
      const approvalRecord = items.find(
        item => item.email?.toLowerCase() === email.toLowerCase()
      );

      if (!approvalRecord) {
        console.log('[StudentApprovalService] No approval record found for:', email);
        return false;
      }

      const isApproved = approvalRecord.status === 'approved';
      console.log('[StudentApprovalService] Approval status for', email, ':', approvalRecord.status);
      return isApproved;
    } catch (error) {
      console.error('[StudentApprovalService] Error checking approval status:', error);
      return false;
    }
  }

  /**
   * Get approval record by email
   */
  static async getApprovalRecord(email: string): Promise<StudentApprovalRecord | null> {
    try {
      const { items } = await BaseCrudService.getAll<StudentApprovalRecord>(this.COLLECTION_ID);
      const record = items.find(
        item => item.email?.toLowerCase() === email.toLowerCase()
      );
      return record || null;
    } catch (error) {
      console.error('[StudentApprovalService] Error getting approval record:', error);
      return null;
    }
  }

  /**
   * Approve a student (admin only)
   * Also marks all their enrollments as paid
   */
  static async approveStudent(email: string, approvedBy: string = 'admin'): Promise<StudentApprovalRecord> {
    try {
      console.log('[StudentApprovalService] Approving student:', email);

      const record = await this.getApprovalRecord(email);
      if (!record) {
        throw new Error(`No approval record found for email: ${email}`);
      }

      const updatedRecord: StudentApprovalRecord = {
        ...record,
        status: 'approved',
        approvalDate: new Date(),
        approvedByAdmin: approvedBy,
      };

      await BaseCrudService.update(this.COLLECTION_ID, updatedRecord);
      console.log('[StudentApprovalService] ✓ Student approved:', email);

      // Mark all enrollments as paid for this student
      await this.markEnrollmentsAsPaid(email);

      return updatedRecord;
    } catch (error) {
      console.error('[StudentApprovalService] Error approving student:', error);
      throw error;
    }
  }

  /**
   * Mark all enrollments for a student as paid
   */
  static async markEnrollmentsAsPaid(email: string): Promise<void> {
    try {
      console.log('[StudentApprovalService] Marking enrollments as paid for:', email);

      // Get student by email
      const { items: allStudents } = await BaseCrudService.getAll<Students>('students');
      const student = allStudents.find(s => s.email?.toLowerCase() === email.toLowerCase());

      if (!student) {
        console.log('[StudentApprovalService] No student found with email:', email);
        return;
      }

      // Get all enrollments for this student
      const { items: allEnrollments } = await BaseCrudService.getAll<Enrollments>('enrollments');
      const studentEnrollments = allEnrollments.filter(e => e.userId === student._id);

      // Update each enrollment to mark as paid
      for (const enrollment of studentEnrollments) {
        const updatedEnrollment: Enrollments = {
          ...enrollment,
          paymentStatus: 'paid',
        };
        await BaseCrudService.update('enrollments', updatedEnrollment);
        console.log('[StudentApprovalService] ✓ Marked enrollment as paid:', enrollment._id);
      }

      console.log('[StudentApprovalService] ✓ All enrollments marked as paid for:', email);
    } catch (error) {
      console.error('[StudentApprovalService] Error marking enrollments as paid:', error);
      // Don't throw - this is a secondary operation
    }
  }

  /**
   * Reject and permanently delete a student record (admin only)
   */
  static async rejectStudent(
    email: string,
    rejectionReason: string,
    approvedBy: string = 'admin'
  ): Promise<void> {
    try {
      console.log('[StudentApprovalService] Rejecting and deleting student record:', email);

      const record = await this.getApprovalRecord(email);
      if (!record) {
        throw new Error(`No approval record found for email: ${email}`);
      }

      // Permanently delete the record from database
      await BaseCrudService.delete(this.COLLECTION_ID, record._id);
      console.log('[StudentApprovalService] ✓ Student record permanently deleted:', email);
    } catch (error) {
      console.error('[StudentApprovalService] Error rejecting student:', error);
      throw error;
    }
  }

  /**
   * Get all pending approvals (admin only)
   */
  static async getPendingApprovals(): Promise<StudentApprovalRecord[]> {
    try {
      const { items } = await BaseCrudService.getAll<StudentApprovalRecord>(this.COLLECTION_ID);
      const pending = items.filter(item => item.status === 'pending');
      console.log('[StudentApprovalService] Found', pending.length, 'pending approvals');
      return pending;
    } catch (error) {
      console.error('[StudentApprovalService] Error getting pending approvals:', error);
      return [];
    }
  }

  /**
   * Get approval status summary (admin only)
   */
  static async getApprovalSummary(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  }> {
    try {
      const { items } = await BaseCrudService.getAll<StudentApprovalRecord>(this.COLLECTION_ID);
      return {
        pending: items.filter(i => i.status === 'pending').length,
        approved: items.filter(i => i.status === 'approved').length,
        rejected: items.filter(i => i.status === 'rejected').length,
        total: items.length,
      };
    } catch (error) {
      console.error('[StudentApprovalService] Error getting approval summary:', error);
      return { pending: 0, approved: 0, rejected: 0, total: 0 };
    }
  }
}

export { StudentApprovalService };
