/**
 * Teacher Approval Service
 * Manages the teacher registration approval workflow
 */

import { SupabaseCrudService } from '@/lib/supabaseCrud';

export interface DocumentFile {
  name: string;
  content: string; // base64 encoded content
  type: string;
  size: number;
}

export interface TeacherApprovalRecord {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  experience?: string;
  subject?: string;
  status?: 'pending' | 'approved' | 'rejected'; // pending, approved, rejected
  submissionDate?: Date | string;
  approvalDate?: Date | string;
  approvedByAdmin?: string;
  rejectionReason?: string;
  submittedDocumentNames?: string; // JSON stringified array of document names
  submittedDocuments?: string; // JSON stringified array of DocumentFile objects
}

class TeacherApprovalService {
  private static readonly COLLECTION_ID = 'teacherapprovals';

  /**
   * Create a pending approval record for a new teacher
   */
  static async createApprovalRecord(teacherData: {
    email: string;
    fullName: string;
    phoneNumber?: string;
    documentNames: string[];
    documents?: DocumentFile[];
  }): Promise<TeacherApprovalRecord> {
    try {
      console.log('[TeacherApprovalService] Creating approval record for:', teacherData.email);

      const approvalRecord: TeacherApprovalRecord = {
        _id: `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: teacherData.email,
        fullName: teacherData.fullName,
        phoneNumber: teacherData.phoneNumber || '',
        status: 'pending',
        submissionDate: new Date().toISOString(),
        submittedDocumentNames: JSON.stringify(teacherData.documentNames),
        submittedDocuments: teacherData.documents ? JSON.stringify(teacherData.documents) : undefined,
      };

      const result = await SupabaseCrudService.create(this.COLLECTION_ID, approvalRecord);
      console.log('[TeacherApprovalService] ✓ Approval record created:', approvalRecord._id);
      return result;
    } catch (error) {
      console.error('[TeacherApprovalService] Error creating approval record:', error);
      throw error;
    }
  }

  /**
   * Check if a teacher's email is approved
   */
  static async isTeacherApproved(email: string): Promise<boolean> {
    try {
      console.log('[TeacherApprovalService] Checking approval status for:', email);

      const { items } = await SupabaseCrudService.getAll<TeacherApprovalRecord>(this.COLLECTION_ID);
      const approvalRecord = items.find(
        item => item.email?.toLowerCase() === email.toLowerCase()
      );

      if (!approvalRecord) {
        console.log('[TeacherApprovalService] No approval record found for:', email);
        return false;
      }

      const isApproved = approvalRecord.status === 'approved';
      console.log('[TeacherApprovalService] Approval status for', email, ':', approvalRecord.status);
      return isApproved;
    } catch (error) {
      console.error('[TeacherApprovalService] Error checking approval status:', error);
      return false;
    }
  }

  /**
   * Get approval record by email
   */
  static async getApprovalRecord(email: string): Promise<TeacherApprovalRecord | null> {
    try {
      const { items } = await SupabaseCrudService.getAll<TeacherApprovalRecord>(this.COLLECTION_ID);
      const record = items.find(
        item => item.email?.toLowerCase() === email.toLowerCase()
      );
      return record || null;
    } catch (error) {
      console.error('[TeacherApprovalService] Error getting approval record:', error);
      return null;
    }
  }

  /**
   * Approve a teacher (admin only)
   */
  static async approveTeacher(email: string, approvedBy: string = 'admin'): Promise<TeacherApprovalRecord> {
    try {
      console.log('[TeacherApprovalService] Approving teacher:', email);

      const record = await this.getApprovalRecord(email);
      if (!record) {
        throw new Error(`No approval record found for email: ${email}`);
      }

      const updatedRecord: TeacherApprovalRecord = {
        ...record,
        status: 'approved',
        approvalDate: new Date().toISOString(),
        approvedByAdmin: approvedBy,
      };

      await SupabaseCrudService.update(this.COLLECTION_ID, updatedRecord);
      console.log('[TeacherApprovalService] ✓ Teacher approved:', email);
      return updatedRecord;
    } catch (error) {
      console.error('[TeacherApprovalService] Error approving teacher:', error);
      throw error;
    }
  }

  /**
   * Reject and permanently delete a teacher record (admin only)
   */
  static async rejectTeacher(
    email: string,
    rejectionReason: string,
    approvedBy: string = 'admin'
  ): Promise<void> {
    try {
      console.log('[TeacherApprovalService] Rejecting and deleting teacher record:', email);

      const record = await this.getApprovalRecord(email);
      if (!record) {
        throw new Error(`No approval record found for email: ${email}`);
      }

      // Permanently delete the record from database
      await SupabaseCrudService.delete(this.COLLECTION_ID, record._id);
      console.log('[TeacherApprovalService] ✓ Teacher record permanently deleted:', email);
    } catch (error) {
      console.error('[TeacherApprovalService] Error rejecting teacher:', error);
      throw error;
    }
  }

  /**
   * Get all pending approvals (admin only)
   */
  static async getPendingApprovals(): Promise<TeacherApprovalRecord[]> {
    try {
      const { items } = await SupabaseCrudService.getAll<TeacherApprovalRecord>(this.COLLECTION_ID);
      const pending = items.filter(item => item.status === 'pending');
      console.log('[TeacherApprovalService] Found', pending.length, 'pending approvals');
      return pending;
    } catch (error) {
      console.error('[TeacherApprovalService] Error getting pending approvals:', error);
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
      const { items } = await SupabaseCrudService.getAll<TeacherApprovalRecord>(this.COLLECTION_ID);
      return {
        pending: items.filter(i => i.status === 'pending').length,
        approved: items.filter(i => i.status === 'approved').length,
        rejected: items.filter(i => i.status === 'rejected').length,
        total: items.length,
      };
    } catch (error) {
      console.error('[TeacherApprovalService] Error getting approval summary:', error);
      return { pending: 0, approved: 0, rejected: 0, total: 0 };
    }
  }
}

export { TeacherApprovalService };
