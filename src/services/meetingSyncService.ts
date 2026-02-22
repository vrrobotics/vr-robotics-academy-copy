import { SupabaseCrudService } from "@/lib/supabaseCrud";
import { Meetings, Batches, TeacherAssignments, Students } from '@/entities';
import { useAuthStore } from '@/stores/authStore';
import { 
  convertLocalDateToUTCMidnight, 
  convertUTCToLocalDate, 
  combineDateAndTimeToUTC,
  extractLocalDateFromUTC,
  extractTimeFromDateTime 
} from '@/lib/dateNormalization';

/**
 * Meeting and Batch Sync Service
 * Handles real-time synchronization of meetings and batch assignments
 * across Admin, Teacher, and Student portals
 */

export class MeetingSyncService {
  /**
   * Create a meeting (Admin or Teacher)
   * @param meetingData Meeting data with batch and creator info
   * @param creatorRole Role of the creator ('admin' or 'teacher')
   */
  static async createMeeting(
    meetingData: Partial<Meetings>,
    creatorRole: 'admin' | 'teacher'
  ): Promise<Meetings> {
    const { user } = useAuthStore.getState();
    
    // Strategy: Store meeting date as UTC midnight
    // This ensures the meeting appears on the correct day regardless of timezone
    
    let startTime: Date | undefined;
    let endTime: Date | undefined;

    // If startTime is provided, convert to UTC midnight (date only)
    if (meetingData.startTime) {
      const startDate = typeof meetingData.startTime === 'string' 
        ? new Date(meetingData.startTime) 
        : meetingData.startTime;
      startTime = new Date(convertLocalDateToUTCMidnight(startDate));
    }

    // If endTime is provided, convert to UTC midnight
    if (meetingData.endTime) {
      const endDate = typeof meetingData.endTime === 'string' 
        ? new Date(meetingData.endTime) 
        : meetingData.endTime;
      endTime = new Date(convertLocalDateToUTCMidnight(endDate));
    }

    // If no startTime but meetingDate is provided, use it
    if (!startTime && meetingData.meetingDate) {
      const dateStr = extractLocalDateFromUTC(meetingData.meetingDate);
      startTime = new Date(convertLocalDateToUTCMidnight(
        typeof meetingData.meetingDate === 'string' 
          ? new Date(meetingData.meetingDate) 
          : meetingData.meetingDate
      ));
    }

    // If still no startTime, use today as UTC midnight
    if (!startTime) {
      startTime = new Date(convertLocalDateToUTCMidnight(new Date()));
    }

    // If no endTime, set to same day as startTime (or 1 day later)
    if (!endTime) {
      endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
    }
    
    const meeting: Meetings = {
      _id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: meetingData.title || meetingData.meetingTitle || '',
      meetingTitle: meetingData.meetingTitle || meetingData.title || '',
      meetingDate: extractLocalDateFromUTC(startTime),
      meetingTime: meetingData.meetingTime || '',
      startTime: startTime,
      endTime: endTime,
      meetingLink: meetingData.meetingLink || '',
      location: meetingData.location || '',
      description: meetingData.description || '',
      batchId: meetingData.batchId || '',
      createdBy: creatorRole === 'admin' ? 'admin' : user?.id || '',
      teacherId: creatorRole === 'teacher' ? user?.id || '' : meetingData.teacherId || '',
      timestamp: new Date(),
    };

    await SupabaseCrudService.create('meetings', meeting);
    return meeting;
  }

  /**
   * Get meetings for a specific batch
   * @param batchId Batch ID to filter meetings
   */
  static async getMeetingsByBatch(batchId: string): Promise<Meetings[]> {
    const { items } = await SupabaseCrudService.getAll<Meetings>('meetings');
    return items.filter(m => m.batchId === batchId);
  }

  /**
   * Get meetings created by a specific teacher
   * @param teacherId Teacher ID to filter meetings
   */
  static async getMeetingsByTeacher(teacherId: string): Promise<Meetings[]> {
    const { items } = await SupabaseCrudService
.getAll<Meetings>('meetings');
    return items.filter(m => m.teacherId === teacherId);
  }

  /**
   * Get meetings created by admin for a batch
   * @param batchId Batch ID to filter admin meetings
   */
  static async getAdminMeetingsByBatch(batchId: string): Promise<Meetings[]> {
    const { items } = await SupabaseCrudService
.getAll<Meetings>('meetings');
    return items.filter(m => m.batchId === batchId && m.createdBy === 'admin');
  }

  /**
   * Update meeting
   * @param meetingId Meeting ID to update
   * @param updateData Partial meeting data to update
   */
  static async updateMeeting(
    meetingId: string,
    updateData: Partial<Meetings>
  ): Promise<void> {
    // Normalize dates to UTC midnight if provided
    const normalizedData = { ...updateData };
    
    if (normalizedData.startTime) {
      const startDate = typeof normalizedData.startTime === 'string'
        ? new Date(normalizedData.startTime)
        : normalizedData.startTime;
      normalizedData.startTime = new Date(convertLocalDateToUTCMidnight(startDate));
    }
    
    if (normalizedData.endTime) {
      const endDate = typeof normalizedData.endTime === 'string'
        ? new Date(normalizedData.endTime)
        : normalizedData.endTime;
      normalizedData.endTime = new Date(convertLocalDateToUTCMidnight(endDate));
    }
    
    if (normalizedData.meetingDate) {
      const dateStr = typeof normalizedData.meetingDate === 'string'
        ? normalizedData.meetingDate
        : extractLocalDateFromUTC(normalizedData.meetingDate);
      normalizedData.meetingDate = dateStr;
    }

    await SupabaseCrudService
.update('meetings', {
      _id: meetingId,
      ...normalizedData,
      _updatedDate: new Date(),
    });
  }

  /**
   * Delete meeting
   * @param meetingId Meeting ID to delete
   */
  static async deleteMeeting(meetingId: string): Promise<void> {
    await SupabaseCrudService
.delete('meetings', meetingId);
  }

  /**
   * Assign teacher to batch
   * @param teacherId Teacher ID
   * @param batchId Batch ID
   * @param assignedByUserId Admin user ID
   */
  static async assignTeacherToBatch(
    teacherId: string,
    batchId: string,
    assignedByUserId: string
  ): Promise<TeacherAssignments> {
    const assignment: TeacherAssignments = {
      _id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      teacherId,
      batchId,
      syncStatus: 'synced',
      assignmentDate: new Date(),
      assignedByUserId,
      isActive: true,
    };

    await SupabaseCrudService.create('teacherassignments', assignment);
    return assignment;
  }

  /**
   * Get batches assigned to a teacher
   * @param teacherId Teacher ID
   */
  static async getBatchesByTeacher(teacherId: string): Promise<Batches[]> {
    // Defensive check: validate teacherId
    if (!teacherId || typeof teacherId !== 'string' || teacherId.trim() === '') {
      console.error('[MeetingSyncService] Invalid teacherId provided:', teacherId);
      return [];
    }

    console.log(`[MeetingSyncService] getBatchesByTeacher called with teacherId: ${teacherId}`);

    try {
      // Get all teacher assignments
      const { items: assignments } = await SupabaseCrudService.getAll<TeacherAssignments>('teacherassignments');
      
      // Defensive check: validate assignments array
      if (!Array.isArray(assignments)) {
        console.error('[MeetingSyncService] Invalid assignments response - not an array:', assignments);
        return [];
      }

      console.log(`[MeetingSyncService] Total TeacherAssignments in database: ${assignments.length}`);

      // Filter for active assignments for this teacher
      const activeAssignments = assignments.filter(a => {
        const isMatch = a.teacherId === teacherId && a.isActive;
        if (isMatch) {
          console.log(`[MeetingSyncService] Found active assignment: teacherId=${a.teacherId}, batchId=${a.batchId}, isActive=${a.isActive}`);
        }
        return isMatch;
      });

      console.log(`[MeetingSyncService] Active assignments for teacher ${teacherId}: ${activeAssignments.length}`);

      // Get all batches
      const { items: allBatches } = await SupabaseCrudService.getAll<Batches>('batches');
      
      // Defensive check: validate batches array
      if (!Array.isArray(allBatches)) {
        console.error('[MeetingSyncService] Invalid batches response - not an array:', allBatches);
        return [];
      }

      console.log(`[MeetingSyncService] Total Batches in database: ${allBatches.length}`);

      // Filter batches that match active assignments
      const teacherBatches = allBatches.filter(b => {
        const hasAssignment = activeAssignments.some(a => a.batchId === b._id);
        if (hasAssignment) {
          console.log(`[MeetingSyncService] Batch matches assignment: ID=${b._id}, Name=${b.batchName}`);
        }
        return hasAssignment;
      });

      console.log(`[MeetingSyncService] Final result: ${teacherBatches.length} batches assigned to teacher ${teacherId}`);
      
      return teacherBatches;
    } catch (error) {
      console.error(`[MeetingSyncService] Error in getBatchesByTeacher for ${teacherId}:`, error);
      return [];
    }
  }

  /**
   * Get all teacher assignments for a batch
   * @param batchId Batch ID
   */
  static async getTeachersByBatch(batchId: string): Promise<TeacherAssignments[]> {
    const { items } = await SupabaseCrudService.getAll<TeacherAssignments>('teacherassignments');
    return items.filter(a => a.batchId === batchId && a.isActive);
  }

  /**
   * Update teacher assignment sync status
   * @param assignmentId Assignment ID
   * @param syncStatus New sync status
   */
  static async updateAssignmentSyncStatus(
    assignmentId: string,
    syncStatus: 'synced' | 'pending' | 'error'
  ): Promise<void> {
    await SupabaseCrudService.update('teacherassignments', {
      _id: assignmentId,
      syncStatus,
      _updatedDate: new Date(),
    });
  }

  /**
   * Remove teacher from batch
   * @param assignmentId Assignment ID
   */
  static async removeTeacherFromBatch(assignmentId: string): Promise<void> {
    await SupabaseCrudService.update('teacherassignments', {
      _id: assignmentId,
      isActive: false,
      _updatedDate: new Date(),
    });
  }

  /**
   * Get students in a batch
   * @param batchId Batch ID
   */
  static async getStudentsByBatch(batchId: string): Promise<Students[]> {
    const { items } = await SupabaseCrudService.getAll<Students>('students');
    return items.filter(s => s.batchId === batchId);
  }

  /**
   * Get all meetings for a student's batch
   * @param studentBatchId Student's batch ID
   */
  static async getMeetingsForStudentBatch(studentBatchId: string): Promise<Meetings[]> {
    const { items } = await SupabaseCrudService.getAll<Meetings>('meetings');
    return items.filter(m => m.batchId === studentBatchId);
  }

  /**
   * Sync batch assignment - called when admin assigns/reassigns/removes teacher
   * @param batchId Batch ID
   * @param oldTeacherId Previous teacher ID (if reassigning)
   * @param newTeacherId New teacher ID
   * @param adminId Admin user ID
   */
  static async syncBatchAssignment(
    batchId: string,
    oldTeacherId: string | null,
    newTeacherId: string,
    adminId: string
  ): Promise<void> {
    try {
      // If reassigning, deactivate old assignment
      if (oldTeacherId) {
        const { items: assignments } = await SupabaseCrudService.getAll<TeacherAssignments>('teacherassignments');
        const oldAssignment = assignments.find(
          a => a.teacherId === oldTeacherId && a.batchId === batchId && a.isActive
        );
        if (oldAssignment) {
          await this.removeTeacherFromBatch(oldAssignment._id);
        }
      }

      // Create new assignment
      await this.assignTeacherToBatch(newTeacherId, batchId, adminId);

      // Update batch with new teacher
      await SupabaseCrudService.update('batches', {
        _id: batchId,
        assignedTeacherName: newTeacherId,
        _updatedDate: new Date(),
      });
    } catch (error) {
      console.error('Error syncing batch assignment:', error);
      throw error;
    }
  }

  /**
   * Get real-time updates for a batch
   * Returns all related data: batch, meetings, students, teacher assignments
   * @param batchId Batch ID
   */
  static async getBatchWithRelations(batchId: string): Promise<{
    batch: Batches | null;
    meetings: Meetings[];
    students: Students[];
    teacherAssignments: TeacherAssignments[];
  }> {
    const { items: batches } = await SupabaseCrudService.getAll<Batches>('batches');
    const batch = batches.find(b => b._id === batchId) || null;

    const meetings = await this.getMeetingsByBatch(batchId);
    const students = await this.getStudentsByBatch(batchId);
    const teacherAssignments = await this.getTeachersByBatch(batchId);

    return { batch, meetings, students, teacherAssignments };
  }
}
